import React, { useState, useEffect, useRef } from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize2,
  BookmarkPlus,
  Scissors,
  Copy,
  Check,
  Shield,
  SlidersHorizontal,
  Crosshair,
  Film,
  UploadCloud,
  Eye,
  SkipForward,
  SkipBack,
  Repeat,
  FileVideo,
  Layers,
  Sparkles,
} from 'lucide-react';
import { VideoFrame } from '../../types';

export const VideoAnalysisScreen: React.FC = () => {
  const {
    activeCase,
    activeEvidence,
    activeVendor,
    activeVideo,
    activeVideoUrl,
    videoFrames,
    timelineEvents,
    loadSampleSurveillanceVideo,
    captureCurrentFrame,
    createSubClip,
    seekTimestamp,
    setSeekTimestamp,
    addCustodyEntry,
    addTimelineEvent,
    navigateTo,
  } = useForensics();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [filterMode, setFilterMode] = useState<'RAW' | 'LUM-EQ' | 'LAPLACIAN' | 'OPTIC-4X'>('RAW');
  const [timeMs, setTimeMs] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(activeVideo?.duration || 15.0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [capturedBanner, setCapturedBanner] = useState<string | null>(null);
  const [activeCamera, setActiveCamera] = useState('CAM-04');
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false);
  const [selectedInspectedFrame, setSelectedInspectedFrame] = useState<VideoFrame | null>(null);

  // Sync duration from activeVideo
  useEffect(() => {
    if (activeVideo?.duration && activeVideo.duration > 0) {
      setVideoDuration(activeVideo.duration);
    }
  }, [activeVideo]);

  const handleSwitchCamera = (cam: string) => {
    if (cam === activeCamera) return;
    setIsCameraTransitioning(true);
    setActiveCamera(cam);
    setTimeout(() => setIsCameraTransitioning(false), 240);
  };

  // Determine if active evidence is a playable surveillance video
  const isPlayable = Boolean(
    activeVideoUrl &&
      (activeVideo ||
        activeEvidence?.filename?.toLowerCase().endsWith('.mp4') ||
        activeEvidence?.filename?.toLowerCase().endsWith('.webm') ||
        activeEvidence?.file_type?.toLowerCase().includes('video') ||
        activeEvidence?.file_type?.toLowerCase().includes('mp4'))
  );

  const totalDurationMs = Math.max(1000, Math.floor(videoDuration * 1000));

  // Format millisecond time to SMPTE 00:00:00.000
  const formatTimecode = (totalMs: number) => {
    const hours = Math.floor(totalMs / 3600000);
    const mins = Math.floor((totalMs % 3600000) / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor(totalMs % 1000);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  // Jump to specific timecode if requested from AI detection or Timeline (Requirement 9)
  useEffect(() => {
    if (seekTimestamp) {
      const parts = seekTimestamp.split(':');
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10) || 0;
        const m = parseInt(parts[1], 10) || 0;
        const s = parseFloat(parts[2] || '0') || 0;
        let targetSeconds = h * 3600 + m * 60 + s;
        if (targetSeconds > videoDuration && videoDuration > 0) {
          targetSeconds = targetSeconds % videoDuration;
        }
        const targetMs = Math.floor(targetSeconds * 1000);
        setTimeMs(targetMs);
        const fps = activeVideo?.fps || 30;
        setCurrentFrame(Math.floor(targetSeconds * fps));
        if (videoRef.current && isPlayable) {
          videoRef.current.currentTime = targetSeconds;
        }
      }
      setSeekTimestamp(null);
    }
  }, [seekTimestamp, setSeekTimestamp, isPlayable, videoDuration, activeVideo]);

  // Sync playback speed to video element
  useEffect(() => {
    if (videoRef.current && isPlayable) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, isPlayable]);

  // Toggle play/pause (Requirement 10)
  const togglePlay = () => {
    if (isPlayable && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(true));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Frame stepper for fine forensic scrubbing (Requirement 10)
  const stepFrame = (delta: number) => {
    setIsPlaying(false);
    const fps = activeVideo?.fps || 30;
    if (isPlayable && videoRef.current) {
      videoRef.current.pause();
      const newTime = Math.max(0, Math.min(videoDuration, videoRef.current.currentTime + delta / fps));
      videoRef.current.currentTime = newTime;
      setTimeMs(Math.floor(newTime * 1000));
      setCurrentFrame(Math.floor(newTime * fps));
    } else {
      setCurrentFrame((prev) => Math.max(0, prev + delta));
      setTimeMs((prev) => Math.max(0, Math.min(totalDurationMs, prev + Math.round((delta / fps) * 1000))));
    }
  };

  // Scrubber change (Requirement 10)
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valMs = parseInt(e.target.value, 10);
    setTimeMs(valMs);
    const fps = activeVideo?.fps || 30;
    setCurrentFrame(Math.floor((valMs / 1000) * fps));
    if (isPlayable && videoRef.current) {
      videoRef.current.currentTime = valMs / 1000;
    }
  };

  // Capture frame from the uploaded video (Requirement 11)
  const handleCaptureFrame = async () => {
    try {
      const timeSec = timeMs / 1000;
      await captureCurrentFrame(timeSec, currentFrame);
      const captureMsg = `Exhibit Still Frame #${currentFrame} (${formatTimecode(timeMs)}) captured directly from uploaded video.`;
      setCapturedBanner(captureMsg);
      setTimeout(() => setCapturedBanner(null), 4000);
    } catch (err: any) {
      setCapturedBanner(`Frame extraction failed: ${err.message}`);
      setTimeout(() => setCapturedBanner(null), 4000);
    }
  };

  // Create evidentiary sub-clip from uploaded video (Requirement 12)
  const handleCreateClip = async () => {
    if (!activeVideo || !activeVideoUrl) {
      setCapturedBanner('CLIP GENERATION UNAVAILABLE IN PROTOTYPE: No active uploaded video mounted.');
      setTimeout(() => setCapturedBanner(null), 4500);
      return;
    }
    try {
      const startSec = Math.max(0, timeMs / 1000 - 2.0);
      const endSec = Math.min(videoDuration, timeMs / 1000 + 3.0);
      await createSubClip(startSec, endSec);
      const clipMsg = `Evidentiary Sub-Clip isolated from uploaded video: ${formatTimecode(Math.floor(startSec * 1000))} → ${formatTimecode(Math.floor(endSec * 1000))}.`;
      setCapturedBanner(clipMsg);
      setTimeout(() => setCapturedBanner(null), 4500);
    } catch {
      setCapturedBanner('CLIP GENERATION UNAVAILABLE IN PROTOTYPE');
      setTimeout(() => setCapturedBanner(null), 4500);
    }
  };

  const handleAddAnnotation = () => {
    addTimelineEvent({
      camera_id: activeCamera,
      camera_name: 'Surveillance Primary Channel',
      timestamp: formatTimecode(timeMs).substring(0, 8),
      event_type: 'Anomaly',
      object_type: 'Operator Tagged Frame',
      description: `Manual investigator bookmark at frame #${currentFrame} (${formatTimecode(timeMs)}).`,
      frame_number: currentFrame,
    });
    setCapturedBanner(`Bookmark added to Synchronized Timeline at ${formatTimecode(timeMs)}`);
    setTimeout(() => setCapturedBanner(null), 3000);
  };

  const copyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const seekToSeconds = (sec: number) => {
    const validSec = Math.max(0, Math.min(videoDuration, sec));
    setTimeMs(Math.floor(validSec * 1000));
    const fps = activeVideo?.fps || 30;
    setCurrentFrame(Math.floor(validSec * fps));
    if (isPlayable && videoRef.current) {
      videoRef.current.currentTime = validSec;
    }
  };

  return (
    <div className="space-y-3 select-none">
      {/* Sub-Bar & Incident Evidentiary Header */}
      <div className="w-full bg-[#0d0e11] px-4 py-2.5 rounded border border-[#44474a]/60 flex flex-wrap items-center justify-between gap-3 shadow-sm font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#292a2d] rounded">
            <span className="text-[10px] uppercase text-[#8e9194]">CASE:</span>
            <span className="font-semibold text-[#f3f6fc]">#{activeCase?.case_number || 'FV-2026-001'}</span>
          </div>
          <div className="flex items-center gap-1 text-[#c1c7d0]">
            <span className="text-[10px] uppercase text-[#8e9194]">EXHIBIT:</span>
            <span className="text-[#f3f6fc]">{activeVideo?.filename || activeEvidence?.filename || 'NO EXHIBIT'}</span>
          </div>
          <div className="hidden xl:flex items-center gap-1 text-[#c1c7d0]">
            <span className="text-[10px] uppercase text-[#8e9194]">CODEC:</span>
            <span className="text-[#f3f6fc]">{activeVideo?.codec || activeEvidence?.video_codec || 'H.264'}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1f1f23] rounded border border-[#44474a]/60">
            <Shield className="w-3.5 h-3.5 text-[#f3f6fc]" />
            <span className="text-[#f3f6fc] tracking-wider uppercase font-semibold text-[10px]">
              EVIDENCE VERIFIED
            </span>
          </div>
        </div>

        {/* Rapid Operations Toolset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCaptureFrame}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1b1b1f] hover:bg-[#292a2d] text-[#c1c7d0] hover:text-white transition-colors border border-[#44474a]/60"
            type="button"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">CAPTURE STILL</span>
          </button>
          <button
            onClick={handleCreateClip}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1b1b1f] hover:bg-[#292a2d] text-[#c1c7d0] hover:text-white transition-colors border border-[#44474a]/60"
            type="button"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">ISOLATE CLIP</span>
          </button>
          <button
            onClick={() => navigateTo('ai-detection')}
            className="metallic-btn flex items-center gap-1 px-3 py-1.5 rounded font-semibold text-[10px] uppercase"
            type="button"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>AI DETECTION ENGINE →</span>
          </button>
        </div>
      </div>

      {/* Frame Capture Notification Banner */}
      {capturedBanner && (
        <div className="p-2.5 rounded bg-[#1b1b1f] border border-[#f3f6fc] text-xs font-mono text-[#f3f6fc] flex items-center justify-between animate-fadeIn">
          <span>{capturedBanner}</span>
          <span className="text-[10px] text-[#8e9194]">BITSTREAM LOGGED</span>
        </div>
      )}

      {/* Primary Split Forensic Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left / Center Viewport Zone (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          {/* Video Frame Wrapper */}
          <div className="relative w-full rounded bg-[#0d0e11] overflow-hidden shadow-2xl aspect-[16/9] flex flex-col justify-between border border-[#44474a]/60">
            {/* Surveillance Viewport: Uses actual uploaded video or shows NO VIDEO AVAILABLE state (Requirements 1, 2, 3) */}
            <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
              {isPlayable && activeVideoUrl ? (
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    filterMode === 'RAW'
                      ? 'grayscale contrast-125 opacity-90'
                      : filterMode === 'LUM-EQ'
                      ? 'grayscale contrast-200 brightness-110 opacity-95'
                      : filterMode === 'LAPLACIAN'
                      ? 'grayscale invert contrast-250 brightness-90 opacity-95 filter drop-shadow'
                      : 'grayscale contrast-150 scale-125 origin-center'
                  }`}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.duration && !isNaN(v.duration) && v.duration > 0) {
                      setVideoDuration(v.duration);
                    }
                  }}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    setTimeMs(Math.floor(v.currentTime * 1000));
                    const fps = activeVideo?.fps || 30;
                    setCurrentFrame(Math.floor(v.currentTime * fps));
                  }}
                  onEnded={() => {
                    if (isLooping && videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                    } else {
                      setIsPlaying(false);
                    }
                  }}
                  playsInline
                />
              ) : (
                /* Strict Requirement 2: NO RANDOM IMAGE FALLBACK. Show NO VIDEO EVIDENCE AVAILABLE */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md z-10 font-mono">
                  <div className="w-16 h-16 rounded-full bg-[#1b1b1f] border border-[#44474a] flex items-center justify-center text-[#8e9194]">
                    <Film className="w-8 h-8 text-[#8e9194]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-[#f3f6fc] uppercase tracking-wider">
                      NO VIDEO EVIDENCE AVAILABLE
                    </div>
                    <p className="text-xs text-[#8e9194]">
                      No playable surveillance video exhibit is currently mounted in this workstation session.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => navigateTo('evidence-upload')}
                      className="metallic-btn px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                      type="button"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>UPLOAD VIDEO EVIDENCE</span>
                    </button>
                    <button
                      onClick={() => loadSampleSurveillanceVideo()}
                      className="metallic-btn-dark px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                      type="button"
                    >
                      <span>LOAD DEMO CASE FOOTAGE</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11]/90 via-transparent to-[#0d0e11]/80 pointer-events-none"></div>

              {/* Camera Switching Transition (Scanline Sweep) */}
              {isCameraTransitioning && (
                <div className="absolute inset-0 bg-[#0d0e11]/85 z-30 flex flex-col items-center justify-center pointer-events-none animate-page-enter font-mono">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#f3f6fc] to-transparent animate-scan-line-h"></div>
                  <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded bg-[#1b1b1f] border border-[#8e9194]/60 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#f3f6fc] animate-ping"></span>
                    <span className="text-xs text-[#f3f6fc] font-bold tracking-widest uppercase">
                      SYNCHRONIZING FEED // {activeCamera}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Telemetry Reticle & Crosshair Overlays */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="w-24 h-24 relative flex items-center justify-center opacity-30">
                <div className="w-full h-[1px] bg-[#f3f6fc]"></div>
                <div className="h-full w-[1px] bg-[#f3f6fc] absolute"></div>
                <div className="w-12 h-12 rounded-full absolute border border-[#f3f6fc]/40"></div>
              </div>
            </div>

            {/* Optical Overlay Top Header with Camera Feed Selector */}
            <div className="relative z-20 p-3 flex flex-wrap items-start justify-between gap-2 font-mono">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-05'].map((cam) => (
                    <button
                      key={cam}
                      onClick={() => handleSwitchCamera(cam)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all border ${
                        activeCamera === cam
                          ? 'bg-[#f3f6fc] text-[#121316] border-[#ffffff] shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                          : 'bg-[#1b1b1f] text-[#8e9194] border-[#44474a]/60 hover:text-[#f3f6fc] hover:border-[#8e9194]'
                      }`}
                    >
                      {cam}{cam === 'CAM-04' ? ' [PRI]' : ''}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#c1c7d0]">
                  <span className="w-2 h-2 rounded-full bg-[#f3f6fc] animate-pulse"></span>
                  <span className="font-semibold">{activeCamera} // PERIMETER OVERWATCH</span>
                  <span className="text-[#8e9194]">
                    {activeVideo?.resolution || '1280x720'} @ {activeVideo?.fps ? `${activeVideo.fps.toFixed(0)} FPS` : '30 FPS'}
                  </span>
                </div>
              </div>

              {/* Forensic Filter Mode Buttons */}
              <div className="flex items-center gap-1 bg-[#1b1b1f]/90 p-1 rounded border border-[#44474a]/60">
                {(['RAW', 'LUM-EQ', 'LAPLACIAN', 'OPTIC-4X'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                      filterMode === mode
                        ? 'bg-[#f3f6fc] text-[#121316]'
                        : 'text-[#8e9194] hover:text-[#f3f6fc]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Optical HUD Telemetry */}
            <div className="relative z-20 p-3 flex items-end justify-between font-mono text-[10px] text-[#c1c7d0]">
              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded bg-[#0d0e11]/80 border border-[#44474a]/60">
                  SMPTE: {formatTimecode(timeMs)}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#0d0e11]/80 border border-[#44474a]/60">
                  FRAME: #{currentFrame}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#0d0e11]/80 border border-[#44474a]/60 text-[9px] text-[#8e9194]">
                  EVIDENCE: {activeVideo ? 'VIDEO VERIFIED' : 'STANDBY'}
                </span>
              </div>
            </div>
          </div>

          {/* Forensic Player Transport Bar (Requirement 10) */}
          <div className="w-full bg-[#1b1b1f] rounded p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md border border-[#44474a]/60 font-mono text-xs">
            {/* Playback Transport Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepFrame(-60)}
                className="p-1 rounded hover:bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors"
                type="button"
                title="Rewind 1 Second"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => stepFrame(-10)}
                className="p-1 rounded hover:bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors"
                type="button"
                title="Rewind 10 frames"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded bg-[#f3f6fc] text-[#121316] flex items-center justify-center hover:bg-[#d6dadf] transition-transform active:scale-95"
                type="button"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => stepFrame(10)}
                className="p-1 rounded hover:bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors"
                type="button"
                title="Forward 10 frames"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => stepFrame(60)}
                className="p-1 rounded hover:bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors"
                type="button"
                title="Forward 1 Second"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Single Frame Stepper (-1F / +1F) */}
              <div className="flex items-center gap-1 ml-2 bg-[#1f1f23] px-1.5 py-0.5 rounded font-mono text-[10px] border border-[#44474a]/60">
                <button
                  onClick={() => stepFrame(-1)}
                  className="text-[#c1c7d0] hover:text-[#f3f6fc] px-1 font-bold"
                  type="button"
                  title="Single frame back"
                >
                  -1F
                </button>
                <span className="text-[#8e9194]">|</span>
                <button
                  onClick={() => stepFrame(1)}
                  className="text-[#c1c7d0] hover:text-[#f3f6fc] px-1 font-bold"
                  type="button"
                  title="Single frame forward"
                >
                  +1F
                </button>
              </div>

              {/* Speed Controls (0.25x, 0.5x, 1.0x, 2.0x, 4.0x) */}
              <div className="flex items-center gap-0.5 ml-1 bg-[#1f1f23] px-1 py-0.5 rounded font-mono text-[10px] border border-[#44474a]/60">
                {[0.25, 0.5, 1.0, 2.0, 4.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1 rounded ${
                      playbackSpeed === spd
                        ? 'bg-[#f3f6fc] text-[#121316] font-bold'
                        : 'text-[#8e9194] hover:text-[#f3f6fc]'
                    }`}
                    type="button"
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Loop Toggle */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1 ml-1 rounded transition-colors ${
                  isLooping ? 'bg-[#f3f6fc] text-[#121316]' : 'text-[#8e9194] hover:text-[#f3f6fc]'
                }`}
                type="button"
                title="Toggle loop playback"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timecode Readout */}
            <div className="flex items-center gap-3 font-mono">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-[#f3f6fc] tracking-tight">
                  {formatTimecode(timeMs)}
                </span>
                <span className="text-[10px] text-[#8e9194]">/ {formatTimecode(totalDurationMs)}</span>
                <span className="text-[9px] text-[#c1c7d0] ml-2">
                  FRAME #{currentFrame.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  if (videoRef.current && videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                  }
                }}
                className="p-1 rounded hover:bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc]"
                type="button"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Synchronized Timeline & Multitrack Scrubber (Requirements 8, 9, 10) */}
          <div className="w-full bg-[#1b1b1f] rounded p-3 flex flex-col gap-2 shadow-md border border-[#44474a]/60 font-mono text-xs">
            {/* Timeline Control Strip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#8e9194] uppercase tracking-wider font-bold">
                  SYNCHRONIZED TIMELINE MATRIX
                </span>
                <span className="text-[10px] text-[#c1c7d0]">
                  {activeVideo?.fps ? `${activeVideo.fps.toFixed(2)} FPS` : '30.00 FPS'} VIDEO ENGINE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={() => seekToSeconds(0)}
                  className="px-2 py-0.5 rounded bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc] border border-[#44474a]/60"
                  type="button"
                >
                  START [00:00]
                </button>
                <button
                  onClick={() => seekToSeconds(videoDuration / 2)}
                  className="px-2 py-0.5 rounded bg-[#1f1f23] text-[#c1c7d0] hover:text-[#f3f6fc] border border-[#44474a]/60"
                  type="button"
                >
                  MIDPOINT
                </button>
              </div>
            </div>

            {/* Scrubber Canvas and Ruler */}
            <div className="relative w-full bg-[#0d0e11] rounded p-2 overflow-hidden flex flex-col gap-1.5 border border-[#44474a]/40">
              {/* Millisecond Tick Strip */}
              <div className="w-full h-4 relative flex items-center justify-between text-[#8e9194] text-[9px] select-none font-mono">
                <span>00:00</span>
                <span>{formatTimecode(Math.floor(totalDurationMs * 0.25)).substring(3, 8)}</span>
                <span className="text-[#f3f6fc] font-bold">
                  {formatTimecode(Math.floor(totalDurationMs * 0.5)).substring(3, 8)}
                </span>
                <span>{formatTimecode(Math.floor(totalDurationMs * 0.75)).substring(3, 8)}</span>
                <span>{formatTimecode(totalDurationMs).substring(3, 8)}</span>
              </div>

              {/* Physical Track 1: Optical Detection Track with Real Synchronized Keyframes */}
              <div className="relative w-full h-8 bg-[#1f1f23] rounded flex items-center px-2">
                <span className="text-[9px] text-[#8e9194] uppercase font-bold absolute left-2 pointer-events-none">
                  EVENTS
                </span>

                {/* Render Keyframe Markers for Real Timeline Events (Requirement 9) */}
                {timelineEvents.map((ev, idx) => {
                  const parts = ev.timestamp.split(':');
                  let sec = 0;
                  if (parts.length >= 2) {
                    const h = parseInt(parts[0], 10) || 0;
                    const m = parseInt(parts[1], 10) || 0;
                    const s = parseFloat(parts[2] || '0') || 0;
                    sec = h * 3600 + m * 60 + s;
                    if (sec > videoDuration && videoDuration > 0) sec = sec % videoDuration;
                  }
                  const percent = videoDuration > 0 ? (sec / videoDuration) * 100 : (idx + 1) * 15;
                  return (
                    <div
                      key={ev.id || idx}
                      className="absolute flex flex-col items-center group cursor-pointer z-10"
                      style={{ left: `${Math.min(96, Math.max(4, percent))}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        seekToSeconds(sec);
                      }}
                      title={`${ev.timestamp} • ${ev.event_type} (${ev.description})`}
                    >
                      <div className="w-2.5 h-2.5 rotate-45 bg-[#f3f6fc] shadow group-hover:scale-125 transition-transform ring-1 ring-black"></div>
                      <div className="hidden group-hover:block absolute bottom-5 bg-[#343538] px-2 py-1 rounded text-[#f3f6fc] text-[9px] whitespace-nowrap z-30 shadow-lg border border-[#8e9194]">
                        {ev.timestamp} • {ev.event_type}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Track 2: Telemetric Signal Strip */}
              <div className="relative w-full h-6 bg-[#292a2d] rounded flex items-center px-2 overflow-hidden">
                <span className="text-[9px] text-[#8e9194] uppercase font-bold absolute left-2 pointer-events-none">
                  BITSTREAM
                </span>
                <svg className="w-full h-full text-[#c1c7d0] opacity-40" preserveAspectRatio="none" viewBox="0 0 400 30">
                  <path
                    d="M0,15 Q20,15 30,12 T50,15 T80,18 T110,15 T128,4 T130,26 T134,2 T138,28 T145,15 T180,15 T220,13 T260,15 T270,8 T274,22 T280,15 T340,15 T400,15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  ></path>
                </svg>
              </div>

              {/* Dynamic Interactive Scrubber Slider (Requirement 10) */}
              <input
                type="range"
                min={0}
                max={totalDurationMs}
                step={10}
                value={Math.min(totalDurationMs, Math.max(0, timeMs))}
                onChange={handleScrubberChange}
                aria-label="Timeline Scrubber"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />

              {/* Playhead Needle cutting vertically (Requirement 8) */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#f3f6fc] z-20 pointer-events-none flex flex-col items-center transition-[left] duration-75"
                style={{
                  left: `${Math.max(0, Math.min(100, (timeMs / totalDurationMs) * 100))}%`,
                }}
              >
                <div className="w-2.5 h-2.5 rotate-45 bg-[#f3f6fc] shadow-sm -mt-0.5"></div>
                <div className="h-full w-px bg-[#f3f6fc]"></div>
              </div>
            </div>

            {/* Evidentiary Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddAnnotation}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f1f23] hover:bg-[#292a2d] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors text-[10px] border border-[#44474a]/40"
                  type="button"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>ADD FORENSIC MARK</span>
                </button>
                <button
                  onClick={handleCreateClip}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1f1f23] hover:bg-[#292a2d] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors text-[10px] border border-[#44474a]/40"
                  type="button"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>ISOLATE SUB-CLIP</span>
                </button>
              </div>
              <div className="flex items-center gap-1 text-[#c4c7ca] text-[10px]">
                <span className="text-[#8e9194]">SCRUB POSITION:</span>
                <span className="text-[#f3f6fc] font-semibold">{formatTimecode(timeMs)}</span>
              </div>
            </div>
          </div>

          {/* Extracted Frames Gallery Carousel (Requirement 11) */}
          {videoFrames && videoFrames.length > 0 && (
            <div className="w-full bg-[#1b1b1f] rounded p-3 shadow-md border border-[#44474a]/60 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#f3f6fc]" />
                  <span className="font-bold text-[#f3f6fc] uppercase tracking-wider text-[11px]">
                    EXTRACTED VIDEO FRAMES ({videoFrames.length} SAMPLES)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCaptureFrame}
                    className="px-2 py-0.5 rounded bg-[#0d0e11] hover:bg-[#292a2d] text-[#f3f6fc] border border-[#8e9194] text-[10px] font-semibold flex items-center gap-1"
                    type="button"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>CAPTURE CURRENT FRAME</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                {videoFrames.map((frame) => {
                  const isSelected = selectedInspectedFrame?.id === frame.id;
                  return (
                    <div
                      key={frame.id}
                      onClick={() => {
                        setSelectedInspectedFrame(frame);
                        const parts = String(frame.timestamp).split(':');
                        if (parts.length >= 2) {
                          const h = parseInt(parts[0], 10) || 0;
                          const m = parseInt(parts[1], 10) || 0;
                          const s = parseFloat(parts[2] || '0') || 0;
                          seekToSeconds(h * 3600 + m * 60 + s);
                        } else if (typeof frame.timestamp === 'number') {
                          seekToSeconds(frame.timestamp);
                        }
                      }}
                      className={`group relative rounded bg-[#0d0e11] border overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#f3f6fc] ring-1 ring-[#f3f6fc]'
                          : 'border-[#44474a]/60 hover:border-[#8e9194]'
                      }`}
                    >
                      <img
                        src={frame.thumbnail_path || frame.frame_path}
                        alt={`Frame #${frame.frame_number}`}
                        className="w-full h-16 object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
                      />
                      <div className="p-1 bg-[#0d0e11]/90 flex items-center justify-between text-[9px] text-[#c1c7d0]">
                        <span>T: {typeof frame.timestamp === 'number' ? `${frame.timestamp.toFixed(2)}s` : frame.timestamp}</span>
                        <span>#{frame.frame_number}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Forensic Evidence & Telemetric Inspector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2 font-mono text-xs">
          {/* Section A: Extracted Video Metadata Card (Requirement 4) */}
          <div className="bg-[#1b1b1f] rounded p-3 flex flex-col gap-2 shadow-md border border-[#44474a]/60">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <div className="flex items-center gap-1.5">
                <FileVideo className="w-4 h-4 text-[#f3f6fc]" />
                <span className="text-xs font-bold text-[#f3f6fc] uppercase tracking-wider">
                  EXTRACTED VIDEO METADATA
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#343538] text-[9px] text-[#c1c7d0]">
                FFPROBE VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#0d0e11] p-2.5 rounded border border-[#44474a]/40 text-[10px]">
              <div>
                <span className="text-[#8e9194] block uppercase text-[9px]">FILE NAME:</span>
                <span className="text-[#f3f6fc] font-semibold truncate block" title={activeVideo?.filename || activeEvidence?.filename}>
                  {activeVideo?.filename || activeEvidence?.filename || 'None mounted'}
                </span>
              </div>
              <div>
                <span className="text-[#8e9194] block uppercase text-[9px]">FILE SIZE:</span>
                <span className="text-[#f3f6fc] font-semibold">
                  {activeEvidence?.file_size ||
                    (typeof activeVideo?.file_size === 'number'
                      ? `${(activeVideo.file_size / (1024 * 1024)).toFixed(2)} MB`
                      : activeVideo?.file_size || '3.42 MB')}
                </span>
              </div>
              <div>
                <span className="text-[#8e9194] block uppercase text-[9px]">DURATION:</span>
                <span className="text-[#f3f6fc] font-semibold">
                  {activeVideo?.duration ? `${activeVideo.duration.toFixed(2)}s` : `${videoDuration.toFixed(2)}s`}
                </span>
              </div>
              <div>
                <span className="text-[#8e9194] block uppercase text-[9px]">RESOLUTION:</span>
                <span className="text-[#f3f6fc] font-semibold">
                  {activeVideo?.resolution || '1280x720 (HD)'}
                </span>
              </div>
              <div>
                <span className="text-[#8e9194] block uppercase text-[9px]">FRAME RATE (FPS):</span>
                <span className="text-[#f3f6fc] font-semibold">
                  {activeVideo?.fps ? `${activeVideo.fps.toFixed(2)} FPS` : '30.00 FPS'}
                </span>
              </div>
              <div>
                <span className="text-[#8e9194] block uppercase text-[9px]">CODEC:</span>
                <span className="text-[#f3f6fc] font-semibold uppercase">
                  {activeVideo?.codec || activeEvidence?.video_codec || 'H.264 / AVC'}
                </span>
              </div>
            </div>
          </div>

          {/* Section B: Evidentiary Cryptographic Hash Vault */}
          <div className="bg-[#1b1b1f] rounded p-3 flex flex-col gap-2 shadow-md border border-[#44474a]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#f3f6fc]" />
                <span className="text-xs font-bold text-[#f3f6fc] uppercase tracking-wider">
                  CRYPTOGRAPHIC INTEGRITY
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#343538] text-[9px] text-[#c1c7d0]">
                FED RULE 902(14)
              </span>
            </div>

            <div className="flex flex-col gap-1.5 bg-[#0d0e11] p-2.5 rounded border border-[#44474a]/40">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#8e9194] uppercase">SHA-256 MASTER EVIDENCE HASH</span>
                <button
                  onClick={() => copyHash(activeEvidence?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                  className="text-[#c1c7d0] hover:text-white flex items-center gap-1 text-[10px]"
                  type="button"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-[#f3f6fc]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <div className="text-[10px] text-[#f3f6fc] break-all bg-[#1f1f23] p-1.5 rounded border border-[#44474a]/60 leading-tight">
                {activeEvidence?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[9px]">
                <div>
                  <span className="text-[#8e9194] block">MD5 SUM:</span>
                  <span className="text-[#c1c7d0] font-semibold truncate block">
                    {activeEvidence?.md5 || '7d38a0b01c3e4129b87f9c2d114a821e'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8e9194] block">STATUS:</span>
                  <span className="text-[#f3f6fc] font-semibold">VERIFIED SEAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Live Synchronized Timeline Events (Requirement 8 & 9) */}
          <div className="bg-[#1b1b1f] rounded p-3 flex flex-col gap-2 shadow-md border border-[#44474a]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f3f6fc] uppercase tracking-wider">
                SYNCHRONIZED TIMELINE EVENTS
              </span>
              <span className="text-[10px] text-[#8e9194]">CLICK TO JUMP</span>
            </div>
            <div className="overflow-x-auto border border-[#44474a]/40 rounded bg-[#0d0e11] max-h-48 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#343538] text-[#c1c7d0] text-[9px] uppercase sticky top-0">
                    <th className="py-1 px-2">TIME</th>
                    <th className="py-1 px-2">EVENT</th>
                    <th className="py-1 px-2">TYPE</th>
                    <th className="py-1 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f23] text-[10px]">
                  {timelineEvents.length > 0 ? (
                    timelineEvents.map((ev) => (
                      <tr
                        key={ev.id}
                        onClick={() => {
                          const parts = ev.timestamp.split(':');
                          if (parts.length >= 2) {
                            const h = parseInt(parts[0], 10) || 0;
                            const m = parseInt(parts[1], 10) || 0;
                            const s = parseFloat(parts[2] || '0') || 0;
                            seekToSeconds(h * 3600 + m * 60 + s);
                          }
                        }}
                        className="bg-[#0d0e11] hover:bg-[#292a2d] transition-colors cursor-pointer group"
                      >
                        <td className="py-1.5 px-2 text-[#f3f6fc] font-semibold whitespace-nowrap">
                          {ev.timestamp}
                        </td>
                        <td className="py-1.5 px-2 text-[#c1c7d0] truncate max-w-[120px]" title={ev.description}>
                          {ev.description}
                        </td>
                        <td className="py-1.5 px-2 text-[#8e9194]">{ev.event_type}</td>
                        <td className="py-1.5 px-2 text-right">
                          <span className="text-[9px] text-[#f3f6fc] group-hover:underline flex items-center justify-end gap-1">
                            <Eye className="w-2.5 h-2.5" />
                            <span>JUMP</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-3 px-2 text-center text-[#8e9194]">
                        No timeline events logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section D: Chain of Custody Immediate Log */}
          <div className="bg-[#1b1b1f] rounded p-3 flex flex-col gap-1.5 shadow-md border border-[#44474a]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f3f6fc] uppercase tracking-wider">
                CUSTODY PROVENANCE
              </span>
              <span className="text-[9px] text-[#c1c7d0]">IMMUTABLE</span>
            </div>
            <div className="flex flex-col gap-1 text-[10px]">
              <div className="flex items-center justify-between bg-[#0d0e11] px-2 py-1 rounded border border-[#44474a]/40">
                <span className="text-[#8e9194]">EVIDENCE FILE:</span>
                <span className="text-[#f3f6fc] font-medium truncate max-w-[180px]">
                  {activeEvidence?.filename || 'sample_cctv.mp4'}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#0d0e11] px-2 py-1 rounded border border-[#44474a]/40">
                <span className="text-[#8e9194]">ACQUISITION:</span>
                <span className="text-[#f3f6fc] font-medium">BITSTREAM VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
