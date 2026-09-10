import React from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  Lock,
  HardDrive,
  Copy,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const ForensicAcquisitionScreen: React.FC = () => {
  const {
    activeEvidence,
    activeVendor,
    executeAcquisition,
    isProcessing,
    processingStage,
    navigateTo,
    successMessage,
  } = useForensics();

  const stages = [
    { name: 'Evidence Validation', desc: 'Write-blocker verification & bus parity', done: true },
    { name: 'Device Identification', desc: `${activeVendor.name.split(' ')[0]} filesystem signature mapped`, done: true },
    { name: 'Storage Analysis', desc: 'Partition sector geometry & bad block scanning', done: true },
    { name: 'Forensic Image Creation', desc: 'Bit-for-bit RAW DD working image generation', done: activeEvidence?.is_working_copy },
    { name: 'Metadata Extraction', desc: 'SMPTE timestamp index & audio bus synchronization', done: activeEvidence?.is_working_copy },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between font-mono text-xs">
        <button
          onClick={() => navigateTo('device-identification')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO DEVICE ID</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 05 // FORENSIC ACQUISITION &amp; WORKING COPY VAULT
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="font-mono text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                BIT-STREAM FORENSIC ACQUISITION ENGINE
              </h1>
              <p className="font-mono text-xs text-[#8e9194]">
                Strict forensic write-blocking compliance ensuring zero modification to original physical media
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0d0e11] border border-[#8e9194]/40 font-mono text-xs text-[#f3f6fc]">
            WRITE-BLOCKER: <strong className="text-[#f3f6fc]">HARDWARE ACTIVE</strong>
          </div>
        </div>

        {/* Essential Rule: Original vs Working Copy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Original Evidence Container */}
          <div className="p-4 rounded bg-[#0d0e11] border border-[#44474a] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#8e9194]" />
                <span className="font-bold uppercase text-[#8e9194]">ORIGINAL EVIDENCE</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#1b1b1f] text-[9px] font-semibold text-[#c1c7d0] border border-[#44474a]">
                PHYSICALLY SEALED
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-[#8e9194]">
              <div>Status: <strong className="text-[#f3f6fc]">Write-Locked (Read Only)</strong></div>
              <div>Source: {activeEvidence?.device_vendor} ({activeEvidence?.device_model})</div>
              <div>Master Hash: <span className="text-[#c1c7d0]">{activeEvidence?.sha256.substring(0, 20)}...</span></div>
              <div className="p-2 rounded bg-[#1b1b1f] text-[10px] text-[#c1c7d0] mt-2 border border-[#44474a]/40">
                CRITICAL DIRECTIVE: The original uploaded evidence drive is never mounted directly. All analytical operations run strictly on the bitstream working image.
              </div>
            </div>
          </div>

          {/* Forensic Working Copy Container */}
          <div className="p-4 rounded bg-[#121316] border border-[#8e9194] space-y-3 relative shadow-md">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-[#f3f6fc]" />
                <span className="font-bold uppercase text-[#f3f6fc]">FORENSIC WORKING COPY</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#292a2d] text-[9px] font-semibold text-[#f3f6fc] border border-[#8e9194]">
                ACTIVE FOR ANALYSIS
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-[#8e9194]">
              <div>Image Type: <strong className="text-[#f3f6fc]">Bit-for-Bit Raw DD Image (.img)</strong></div>
              <div>Parity State: <strong className="text-[#f3f6fc]">100% Cryptographic Match</strong></div>
              <div>Mount Mode: Loopback Virtual Block Device (Node-74A)</div>
              <div className="p-2 rounded bg-[#1b1b1f] text-[10px] text-[#f3f6fc] mt-2 border border-[#8e9194]/40">
                AUDITED WORKING COPY: Analysts execute carving, timeline reconstruction, and AI object tracking on this isolated replica.
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Acquisition Pipeline */}
        <div className="bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
            <span className="font-bold text-[#f3f6fc] uppercase tracking-wider">
              ACQUISITION WORKFLOW STAGES
            </span>
            <span className="text-[10px] text-[#8e9194]">
              {isProcessing ? 'STAGE PROCESSING IN PROGRESS' : 'READY TO ACQUIRE'}
            </span>
          </div>

          <div className="space-y-2">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded flex items-center justify-between border transition-all ${
                  stage.done
                    ? 'bg-[#1b1b1f] border-[#8e9194]/40 text-[#f3f6fc]'
                    : 'bg-[#121316] border-[#44474a]/40 text-[#8e9194]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded bg-[#0d0e11] flex items-center justify-center text-[10px] font-bold text-[#c1c7d0]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold">{stage.name}</div>
                    <div className="text-[10px] text-[#8e9194]">{stage.desc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {stage.done ? (
                    <span className="flex items-center gap-1 text-[10px] text-[#f3f6fc] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#f3f6fc]" />
                      <span>COMPLETE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8e9194]">PENDING</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Acquisition Progress Notification */}
          {isProcessing && (
            <div className="p-3 rounded bg-[#1b1b1f] border border-[#f3f6fc] text-xs font-mono text-[#f3f6fc] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#f3f6fc]" />
              <span className="font-semibold">{processingStage}</span>
            </div>
          )}

          {successMessage && !isProcessing && (
            <div className="p-3 rounded bg-[#1b1b1f] border border-[#8e9194] text-xs font-mono text-[#f3f6fc] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#f3f6fc]" />
              <span>{successMessage}</span>
            </div>
          )}

          {!activeEvidence?.is_working_copy && (
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={executeAcquisition}
                className="w-full metallic-btn py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>EXECUTE FORENSIC ACQUISITION &amp; CLONE WORKING COPY</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between">
          <div className="font-mono text-[10px] text-[#8e9194]">
            Forensic working copy verified bit-for-bit against hardware parity check.
          </div>
          <button
            onClick={() => navigateTo('integrity-verification')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>PROCEED TO INTEGRITY VERIFICATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
