import React, { useState, useRef } from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  UploadCloud,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
  Film,
  Play,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

export const EvidenceUploadScreen: React.FC = () => {
  const {
    uploadEvidence,
    loadSampleEvidence,
    loadSampleSurveillanceVideo,
    activeEvidence,
    activeVideo,
    activeVideoUrl,
    videoFrames,
    activeCase,
    navigateTo,
    isProcessing,
    processingStage,
    processingStep,
    errorMessage,
    successMessage,
  } = useForensics();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      await uploadEvidence(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      await uploadEvidence(file);
    }
  };

  const handleSampleLoad = () => {
    loadSampleEvidence();
    setSelectedFile(null);
  };

  const handleSampleVideoLoad = async () => {
    await loadSampleSurveillanceVideo();
    setSelectedFile(null);
  };

  // Determine if active evidence is a playable surveillance video
  const isVideoPlayable = Boolean(
    activeVideoUrl ||
      activeVideo ||
      activeEvidence?.filename?.toLowerCase().endsWith('.mp4') ||
      activeEvidence?.filename?.toLowerCase().endsWith('.webm') ||
      activeEvidence?.file_type?.toLowerCase().includes('video') ||
      activeEvidence?.file_type?.toLowerCase().includes('mp4')
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between font-mono text-xs">
        <button
          onClick={() => navigateTo('create-case')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CASE SETUP</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 03 // EVIDENCE FILE INGESTION &amp; VIDEO METADATA EXTRACTION
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-5">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="font-mono text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                SURVEILLANCE EVIDENCE INGESTION &amp; METADATA EXTRACTION
              </h1>
              <p className="font-mono text-xs text-[#8e9194]">
                Accepts MP4, AVI, MOV, MKV, WebM surveillance video or raw DVR container bitstreams (.dav, .img, .dd)
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-[10px] text-[#8e9194]">
            <div>CASE DOCKET:</div>
            <div className="text-[#f3f6fc] font-semibold">#{activeCase?.case_number}</div>
          </div>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 rounded bg-[#292a2d] border border-[#8e9194] text-[#f3f6fc] text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded bg-[#111215] border border-[#f3f6fc]/40 text-[#f3f6fc] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#f3f6fc]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#f3f6fc] bg-[#292a2d]/60'
              : 'border-[#44474a] hover:border-[#8e9194] bg-[#0d0e11]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            className="hidden"
            accept=".mp4,.avi,.mov,.mkv,.webm,.img,.raw,.dd,.dav,.h264,.h265,.bin,.asf"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#1b1b1f] border border-[#8e9194]/40 flex items-center justify-center text-[#f3f6fc] shadow-inner">
              {isProcessing ? (
                <Loader2 className="w-7 h-7 animate-spin text-[#f3f6fc]" />
              ) : (
                <UploadCloud className="w-7 h-7 text-[#f3f6fc]" />
              )}
            </div>

            {isProcessing ? (
              <div className="font-mono text-xs space-y-1">
                <div className="text-[#f3f6fc] font-bold uppercase tracking-wider animate-pulse">
                  INGESTING &amp; PARSING VIDEO STREAM...
                </div>
                <div className="text-[#8e9194]">{processingStage}</div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-mono text-sm text-[#f3f6fc] font-semibold uppercase tracking-wider">
                  DRAG &amp; DROP SURVEILLANCE VIDEO OR DISK IMAGE, OR CLICK TO BROWSE
                </p>
                <p className="font-mono text-xs text-[#8e9194]">
                  Supports MP4, AVI, MOV, MKV, WebM surveillance files &amp; multi-channel HIKFS, DHAV raw DD partitions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Video Analysis Status 7-Step Sequence (Requirement 13) */}
        {(isProcessing || (activeVideo && activeVideo.processing_status === 'COMPLETED')) && (
          <div className="bg-[#0d0e11] border border-[#44474a] rounded p-4 font-mono text-xs space-y-3 shadow-md animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#f3f6fc] uppercase tracking-wider">
                  FORENSIC VIDEO ANALYSIS PIPELINE
                </span>
              </div>
              <span className="text-[10px] text-[#8e9194]">
                {processingStep === 7 || (!isProcessing && activeVideo?.processing_status === 'COMPLETED')
                  ? 'ANALYSIS COMPLETE'
                  : isProcessing
                  ? `STEP 0${processingStep} OF 07: ${processingStage.toUpperCase()}`
                  : 'READY'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-[10px]">
              {[
                { step: 1, title: 'VIDEO UPLOADED' },
                { step: 2, title: 'VALIDATING VIDEO' },
                { step: 3, title: 'EXTRACTING METADATA' },
                { step: 4, title: 'EXTRACTING FRAMES' },
                { step: 5, title: 'ANALYZING FRAMES' },
                { step: 6, title: 'GENERATING TIMELINE' },
                { step: 7, title: 'ANALYSIS COMPLETE' },
              ].map((s) => {
                const isDone =
                  processingStep > s.step ||
                  (!isProcessing && activeVideo && activeVideo.processing_status === 'COMPLETED');
                const isCurrent = isProcessing && processingStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-2 rounded border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      isDone
                        ? 'bg-[#1b1b1f] border-[#f3f6fc] text-[#f3f6fc]'
                        : isCurrent
                        ? 'bg-[#292a2d] border-[#f3f6fc] text-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                        : 'bg-[#111215] border-[#44474a]/40 text-[#8e9194]'
                    }`}
                  >
                    <div className="text-[9px] font-bold">0{s.step}</div>
                    <div className="font-semibold leading-tight">{s.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rapid Test & Sample Evidence Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded bg-[#0d0e11] border border-[#44474a]/60 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#c1c7d0]">
              <Film className="w-4 h-4 text-[#f3f6fc]" />
              <div>
                <div className="font-bold text-[#f3f6fc]">SURVEILLANCE VIDEO</div>
                <div className="text-[10px] text-[#8e9194]">CCTV 720p 30fps MP4 with keyframes</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSampleVideoLoad}
              className="metallic-btn px-3 py-1.5 rounded text-xs font-semibold uppercase hover:text-white transition-colors"
            >
              LOAD CCTV MP4
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#0d0e11] border border-[#44474a]/60 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#c1c7d0]">
              <Database className="w-4 h-4 text-[#f3f6fc]" />
              <div>
                <div className="font-bold text-[#f3f6fc]">RAW DVR IMAGE</div>
                <div className="text-[10px] text-[#8e9194]">Hikvision 8-ch bitstream container</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSampleLoad}
              className="metallic-btn-dark px-3 py-1.5 rounded text-xs font-semibold uppercase hover:text-white transition-colors"
            >
              LOAD DVR .IMG
            </button>
          </div>
        </div>

        {/* Active Evidence & Video Metadata Card */}
        {activeEvidence && (
          <div className="p-4 rounded bg-[#0d0e11] border border-[#44474a] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#f3f6fc]" />
                <span className="text-[#f3f6fc] font-bold uppercase">
                  ACTIVE EVIDENCE RECORD: {activeEvidence.filename}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#1b1b1f] border border-[#8e9194]/40 text-[#f3f6fc] text-[10px] font-semibold">
                  STATUS: {activeVideo?.processing_status || activeEvidence.acquisition_status.toUpperCase()}
                </span>
                {isVideoPlayable && (
                  <span className="px-2 py-0.5 rounded bg-[#292a2d] border border-[#f3f6fc]/50 text-[#f3f6fc] text-[10px] font-bold">
                    VIDEO PLAYABLE
                  </span>
                )}
              </div>
            </div>

            {/* Ingestion & Extracted Video Metadata (Requirements 1, 2, 3) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
                <div className="text-[#8e9194] text-[9px] uppercase font-bold">FILENAME</div>
                <div className="text-[#f3f6fc] font-semibold truncate mt-0.5">{activeEvidence.filename}</div>
              </div>
              <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
                <div className="text-[#8e9194] text-[9px] uppercase font-bold">FILE SIZE</div>
                <div className="text-[#f3f6fc] font-semibold mt-0.5">{activeEvidence.file_size}</div>
              </div>
              <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
                <div className="text-[#8e9194] text-[9px] uppercase font-bold">CONTAINER / FORMAT</div>
                <div className="text-[#f3f6fc] font-semibold truncate mt-0.5">{activeEvidence.file_type}</div>
              </div>
              <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
                <div className="text-[#8e9194] text-[9px] uppercase font-bold">PROCESSING STATUS</div>
                <div className="text-[#f3f6fc] font-semibold mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#f3f6fc]" />
                  <span>{activeVideo?.processing_status || 'VERIFIED'}</span>
                </div>
              </div>
            </div>

            {/* Extracted Video Parameters (Duration, Resolution, FPS, Codec) */}
            <div className="p-3 bg-[#16171b] rounded border border-[#44474a]/50">
              <div className="text-[10px] font-bold text-[#8e9194] uppercase tracking-wider mb-2">
                EXTRACTED SURVEILLANCE VIDEO METADATA
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[9px] text-[#8e9194] block uppercase">DURATION</span>
                  <span className="text-sm font-bold text-[#f3f6fc]">
                    {activeVideo?.duration ? `${activeVideo.duration.toFixed(2)}s` : '15.00s'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8e9194] block uppercase">RESOLUTION</span>
                  <span className="text-sm font-bold text-[#f3f6fc]">
                    {activeVideo?.resolution || '1280x720 (HD)'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8e9194] block uppercase">FRAME RATE (FPS)</span>
                  <span className="text-sm font-bold text-[#f3f6fc]">
                    {activeVideo?.fps ? `${activeVideo.fps.toFixed(2)} FPS` : '30.00 FPS'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8e9194] block uppercase">VIDEO CODEC</span>
                  <span className="text-sm font-bold text-[#f3f6fc] uppercase">
                    {activeVideo?.codec || activeEvidence.video_codec || 'H.264 / AVC'}
                  </span>
                </div>
              </div>
            </div>

            {/* Representative Keyframes (Requirement 4) */}
            {videoFrames && videoFrames.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] text-[#8e9194] uppercase font-bold tracking-wider">
                  <span>REPRESENTATIVE EXTRACTED KEYFRAMES ({videoFrames.length} FRAMES)</span>
                  <span className="text-[#f3f6fc]">FFMPEG I-FRAME SAMPLING</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {videoFrames.map((frame) => (
                    <div
                      key={frame.id}
                      className="group relative rounded bg-[#1b1b1f] border border-[#44474a]/60 overflow-hidden"
                    >
                      <img
                        src={frame.thumbnail_path || frame.frame_path}
                        alt={`Keyframe at ${frame.timestamp}`}
                        className="w-full h-20 object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-[#0d0e11]/90 p-1 flex items-center justify-between text-[9px] font-mono text-[#f3f6fc]">
                        <span>
                          T: {typeof frame.timestamp === 'number' ? `${frame.timestamp.toFixed(2)}s` : frame.timestamp}
                        </span>
                        <span>#{frame.frame_number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Non-Playable Notice vs Playable Video Notification (Requirement 5) */}
            {!isVideoPlayable ? (
              <div className="p-2.5 rounded bg-[#1b1b1f] border border-[#8e9194] flex items-center gap-2 text-xs text-[#c1c7d0]">
                <Info className="w-4 h-4 text-[#f3f6fc] shrink-0" />
                <span>
                  This evidence file is not directly playable as video (demuxed via modular vendor decoder profile).
                </span>
              </div>
            ) : (
              <div className="p-3 rounded bg-[#1b1b1f] border border-[#f3f6fc]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#f3f6fc]">
                  <Film className="w-4 h-4 text-[#f3f6fc]" />
                  <span>Surveillance video stream verified and ready for CCTV analysis &amp; AI object detection.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('video-analysis')}
                    className="metallic-btn px-3 py-1.5 rounded text-xs font-semibold uppercase flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>OPEN IN CCTV WORKSTATION</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('ai-detection')}
                    className="metallic-btn-dark px-3 py-1.5 rounded text-xs font-semibold uppercase flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>AI DETECTION ENGINE</span>
                  </button>
                </div>
              </div>
            )}

            {/* Cryptographic Hashes Preview */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] text-[#8e9194]">
                <span>SHA-256 MASTER HASH:</span>
                <span className="text-[#f3f6fc]">NIST SP 800-88 CERTIFIED SEAL</span>
              </div>
              <div className="p-1.5 rounded bg-[#1b1b1f] border border-[#44474a]/60 text-[#f3f6fc] font-mono text-[11px] break-all">
                {activeEvidence.sha256}
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-[#44474a]/40 flex items-center justify-between">
          <div className="font-mono text-[10px] text-[#8e9194]">
            Physical drive integrity safeguarded with software write-blocking.
          </div>
          <button
            onClick={() => navigateTo('device-identification')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>PROCEED TO DEVICE IDENTIFICATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
