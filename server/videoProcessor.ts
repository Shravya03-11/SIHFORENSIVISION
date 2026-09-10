import { execSync, exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface VideoProbeResult {
  isVideo: boolean;
  duration: number;
  resolution: string;
  width: number;
  height: number;
  fps: number;
  codec: string;
  fileSize: number;
  fileSizeBytes: number;
  creationTime?: string;
  isBrowserPlayable: boolean;
  error?: string;
}

export interface ExtractedFrameItem {
  id: string;
  video_id: string;
  timestamp: string;
  frame_number: number;
  frame_path: string;
  camera_id: string;
  time_seconds: number;
}

// Format seconds into SMPTE 00:00:00.000
export function formatSecondsToTimecode(totalSec: number): string {
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = Math.floor(totalSec % 60);
  const ms = Math.floor((totalSec % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function validateAndProbeVideo(filePath: string): VideoProbeResult {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        isVideo: false,
        duration: 0,
        resolution: 'Unknown',
        width: 0,
        height: 0,
        fps: 0,
        codec: 'None',
        fileSize: 0,
        fileSizeBytes: 0,
        isBrowserPlayable: false,
        error: 'File does not exist on disk',
      };
    }

    const stat = fs.statSync(filePath);
    const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
    const output = execSync(cmd, { timeout: 8000 }).toString();
    const parsed = JSON.parse(output);

    const videoStream = parsed.streams?.find((s: any) => s.codec_type === 'video');
    if (!videoStream) {
      return {
        isVideo: false,
        duration: 0,
        resolution: 'N/A',
        width: 0,
        height: 0,
        fps: 0,
        codec: 'Raw Storage Substrate',
        fileSize: stat.size,
        fileSizeBytes: stat.size,
        isBrowserPlayable: false,
        error: 'No video stream detected in container',
      };
    }

    let duration = parseFloat(parsed.format?.duration || videoStream.duration || '0');
    if (isNaN(duration) || duration <= 0) {
      duration = 15.0; // fallback duration for un-indexed stream chunks
    }

    const width = videoStream.width || 1280;
    const height = videoStream.height || 720;
    const resolution = `${width}x${height}`;

    let fps = 30.0;
    if (videoStream.avg_frame_rate) {
      const parts = videoStream.avg_frame_rate.split('/');
      if (parts.length === 2 && parseFloat(parts[1]) > 0) {
        fps = Math.round((parseFloat(parts[0]) / parseFloat(parts[1])) * 100) / 100;
      }
    } else if (videoStream.r_frame_rate) {
      const parts = videoStream.r_frame_rate.split('/');
      if (parts.length === 2 && parseFloat(parts[1]) > 0) {
        fps = Math.round((parseFloat(parts[0]) / parseFloat(parts[1])) * 100) / 100;
      }
    }

    const codec = (videoStream.codec_name || 'h264').toLowerCase();
    const ext = path.extname(filePath).toLowerCase();
    const isBrowserPlayable =
      (codec === 'h264' || codec === 'vp8' || codec === 'vp9') &&
      (ext === '.mp4' || ext === '.webm');

    const creationTime =
      parsed.format?.tags?.creation_time ||
      videoStream.tags?.creation_time ||
      new Date(stat.mtime).toISOString();

    return {
      isVideo: true,
      duration,
      resolution,
      width,
      height,
      fps,
      codec,
      fileSize: stat.size,
      fileSizeBytes: stat.size,
      creationTime,
      isBrowserPlayable,
    };
  } catch (err: any) {
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    return {
      isVideo: false,
      duration: 0,
      resolution: 'N/A',
      width: 0,
      height: 0,
      fps: 0,
      codec: 'Non-standard container',
      fileSize: stat?.size || 0,
      fileSizeBytes: stat?.size || 0,
      isBrowserPlayable: false,
      error: err.message,
    };
  }
}

// If file is not natively playable in browser (e.g. AVI, MKV, MOV, or uncompressed), transcode a web MP4
export function ensureWebPlayable(inputPath: string): { webPath: string; isTranscoded: boolean } {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const probe = validateAndProbeVideo(inputPath);

    if (probe.isBrowserPlayable) {
      return { webPath: inputPath, isTranscoded: false };
    }

    // Transcode to web-playable MP4
    const uploadsDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputPath = path.join(uploadsDir, `web_${baseName}.mp4`);

    if (fs.existsSync(outputPath)) {
      return { webPath: outputPath, isTranscoded: true };
    }

    // Fast transcode with ultrafast preset for immediate responsiveness
    const cmd = `ffmpeg -y -i "${inputPath}" -c:v libx264 -preset ultrafast -crf 24 -pix_fmt yuv420p -c:a aac -movflags +faststart "${outputPath}"`;
    execSync(cmd, { timeout: 30000 });

    if (fs.existsSync(outputPath)) {
      return { webPath: outputPath, isTranscoded: true };
    }
    return { webPath: inputPath, isTranscoded: false };
  } catch (err) {
    console.warn('Transcode fallback notice:', err);
    return { webPath: inputPath, isTranscoded: false };
  }
}

// Extract representative keyframes from video across timeline
export function extractRepresentativeFrames(
  filePath: string,
  videoId: string,
  duration: number,
  count = 5
): ExtractedFrameItem[] {
  const framesDir = path.join(process.cwd(), 'uploads', 'frames');
  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  const items: ExtractedFrameItem[] = [];
  const safeDuration = duration > 0 ? duration : 15;
  const safeCount = Math.max(3, Math.min(count, 8));

  // Points at 10%, 25%, 50%, 75%, 90%
  const ratios = [0.1, 0.25, 0.5, 0.75, 0.9].slice(0, safeCount);
  const cameraPool = ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-05'];

  for (let i = 0; i < ratios.length; i++) {
    const targetSec = Math.max(0.5, Math.min(safeDuration - 0.2, safeDuration * ratios[i]));
    const frameNumber = Math.floor(targetSec * 30);
    const frameId = `frm-${videoId}-${i + 1}`;
    const filename = `${videoId}_frame_${i + 1}.jpg`;
    const frameDiskPath = path.join(framesDir, filename);
    const frameWebPath = `/uploads/frames/${filename}`;
    const cameraId = cameraPool[i % cameraPool.length];

    try {
      if (!fs.existsSync(frameDiskPath)) {
        const cmd = `ffmpeg -y -ss ${targetSec.toFixed(2)} -i "${filePath}" -frames:v 1 -q:v 2 "${frameDiskPath}"`;
        execSync(cmd, { timeout: 5000 });
      }

      items.push({
        id: frameId,
        video_id: videoId,
        timestamp: formatSecondsToTimecode(targetSec),
        frame_number: frameNumber,
        frame_path: frameWebPath,
        camera_id: cameraId,
        time_seconds: targetSec,
      });
    } catch (err) {
      console.warn(`Frame extraction notice for index ${i}:`, err);
    }
  }

  return items;
}

// Capture a specific frame from the actual uploaded video using ffmpeg
export function captureFrameFromVideo(
  filePath: string,
  videoId: string,
  timestampSeconds: number,
  frameNumber?: number
): ExtractedFrameItem {
  const capturesDir = path.join(process.cwd(), 'uploads', 'captures');
  if (!fs.existsSync(capturesDir)) {
    fs.mkdirSync(capturesDir, { recursive: true });
  }

  const safeSec = Math.max(0, timestampSeconds || 0);
  const safeFrame = frameNumber !== undefined ? frameNumber : Math.floor(safeSec * 30);
  const captureId = `cap-${videoId}-${Date.now()}`;
  const filename = `${videoId}_capture_${safeFrame}_${Date.now()}.jpg`;
  const captureDiskPath = path.join(capturesDir, filename);
  const captureWebPath = `/uploads/captures/${filename}`;

  try {
    const cmd = `ffmpeg -y -ss ${safeSec.toFixed(3)} -i "${filePath}" -frames:v 1 -q:v 2 "${captureDiskPath}"`;
    execSync(cmd, { timeout: 6000 });
  } catch (err: any) {
    console.error('Frame capture execution failure:', err);
    throw new Error(`Frame extraction failed: ${err.message}`);
  }

  return {
    id: captureId,
    video_id: videoId,
    timestamp: formatSecondsToTimecode(safeSec),
    frame_number: safeFrame,
    frame_path: captureWebPath,
    camera_id: 'CCTV-CAPTURE',
    time_seconds: safeSec,
  };
}

// Extract a forensic subclip from the actual uploaded video using ffmpeg
export function createClipFromVideo(
  filePath: string,
  videoId: string,
  startSeconds: number,
  endSeconds: number
): { clipId: string; clipPath: string; duration: number; startSeconds: number; endSeconds: number } {
  const clipsDir = path.join(process.cwd(), 'uploads', 'clips');
  if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir, { recursive: true });
  }

  const safeStart = Math.max(0, startSeconds || 0);
  let safeDuration = endSeconds > safeStart ? endSeconds - safeStart : 5;
  if (safeDuration <= 0) safeDuration = 3;

  const clipId = `clip-${videoId}-${Date.now()}`;
  const filename = `${videoId}_clip_${Math.floor(safeStart)}s_${Math.floor(safeDuration)}s.mp4`;
  const clipDiskPath = path.join(clipsDir, filename);
  const clipWebPath = `/uploads/clips/${filename}`;

  try {
    // Cut with re-encoding for exact keyframe bounds and web compatibility
    const cmd = `ffmpeg -y -ss ${safeStart.toFixed(3)} -i "${filePath}" -t ${safeDuration.toFixed(3)} -c:v libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p -c:a aac -movflags +faststart "${clipDiskPath}"`;
    execSync(cmd, { timeout: 20000 });
  } catch (err: any) {
    console.error('Clip generation failure:', err);
    throw new Error(`CLIP GENERATION UNAVAILABLE IN PROTOTYPE: ${err.message}`);
  }

  return {
    clipId,
    clipPath: clipWebPath,
    duration: safeDuration,
    startSeconds: safeStart,
    endSeconds: safeStart + safeDuration,
  };
}
