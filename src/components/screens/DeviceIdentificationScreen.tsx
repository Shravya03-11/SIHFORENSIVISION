import React from 'react';
import { useForensics } from '../../context/ForensicContext';
import { VENDOR_PROFILES } from '../../data/sampleData';
import {
  Cpu,
  CheckCircle2,
  HardDrive,
  Video,
  Layers,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  FileCode,
  ShieldAlert,
} from 'lucide-react';

export const DeviceIdentificationScreen: React.FC = () => {
  const { activeVendor, selectVendor, activeEvidence, navigateTo } = useForensics();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between font-mono text-xs">
        <button
          onClick={() => navigateTo('evidence-upload')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO EVIDENCE UPLOAD</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 04 // MULTI-VENDOR DEVICE &amp; FILESYSTEM PROFILER
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="font-mono text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                MULTI-VENDOR DVR/NVR HARDWARE IDENTIFICATION
              </h1>
              <p className="font-mono text-xs text-[#8e9194]">
                Modular parser framework for proprietary DVR filesystem heuristics &amp; stream containers
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0d0e11] border border-[#8e9194]/40 font-mono text-xs text-[#f3f6fc]">
            PROFILED: <strong className="uppercase">{activeVendor.name.split(' ')[0]}</strong>
          </div>
        </div>

        {/* SIH Architectural Disclaimer Box */}
        <div className="p-3.5 rounded bg-[#0d0e11] border border-[#8e9194]/40 font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-[#f3f6fc] font-bold text-[11px] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-[#f3f6fc]" />
            <span>MODULAR FORENSIC PARSER ARCHITECTURE (SIH STATEMENT COMPLIANCE)</span>
          </div>
          <p className="text-[#8e9194] leading-relaxed text-[11px]">
            Commercial CCTV recorders utilize proprietary, non-standard filesystems (HIKFS, DHFS, CP-RAW) designed to prevent standard OS mounting. This ForensiVision prototype demonstrates vendor fingerprinting via sector magic signatures, metadata structures, and a pluggable parser architecture designed for SIH field deployment.
          </p>
        </div>

        {/* Active Detected Device Profile Card */}
        <div className="bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
            <span className="text-xs uppercase font-bold text-[#f3f6fc]">
              IDENTIFIED HARDWARE &amp; FILESYSTEM PROFILE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b1b1f] text-[#c1c7d0] border border-[#8e9194]/40 font-semibold">
              SIGNATURE MATCH: 100% CONFIDENT
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">MANUFACTURER</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeVendor.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-[#8e9194]">{activeVendor.marketShare}</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">MODEL FAMILY</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeEvidence?.device_model || 'Enterprise NVR'}
              </span>
              <span className="text-[9px] text-[#8e9194]">Embedded Linux HW</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">DEVICE TYPE</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                Stand-Alone NVR
              </span>
              <span className="text-[9px] text-[#8e9194]">Rackmount 2U Chassis</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">STORAGE CAPACITY</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeEvidence?.storage_size || '4.00 TB SATA'}
              </span>
              <span className="text-[9px] text-[#8e9194]">SATA-III 6Gb/s Interface</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">CAMERA CHANNELS</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeEvidence?.camera_channels || 8} Synchronous Feeds
              </span>
              <span className="text-[9px] text-[#8e9194]">Up to {activeVendor.maxChannels} max</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">VIDEO CODECS</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeVendor.defaultCodecs[0]}
              </span>
              <span className="text-[9px] text-[#8e9194]">Baseline &amp; Ultra</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">RECORDING FORMAT</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeEvidence?.recording_format || 'Raw Interleaved'}
              </span>
              <span className="text-[9px] text-[#8e9194]">Proprietary stream</span>
            </div>

            <div className="bg-[#1b1b1f] p-2.5 rounded border border-[#44474a]/40">
              <span className="text-[9px] text-[#8e9194] uppercase block">FILESYSTEM STRUCTURE</span>
              <span className="text-[#f3f6fc] font-bold text-sm truncate block mt-0.5">
                {activeVendor.defaultFilesystem.split(' ')[0]}
              </span>
              <span className="text-[9px] text-[#8e9194]">Big-Endian Index</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#1b1b1f] border border-[#44474a]/60 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#8e9194]" />
              <span className="text-[#8e9194]">SECTOR HEADER MAGIC SIGNATURE:</span>
              <span className="text-[#f3f6fc] font-bold">{activeVendor.signatureMagic}</span>
            </div>
            <span className="text-[10px] text-[#c1c7d0]">{activeVendor.description}</span>
          </div>
        </div>

        {/* Supported Vendor Switcher Matrix */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#f3f6fc]">
              SUPPORTED MULTI-VENDOR ARCHITECTURES (PROTOTYPE DATABASE)
            </span>
            <span className="text-[10px] text-[#8e9194]">Click any vendor to test parser profile</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VENDOR_PROFILES.map((vendor) => {
              const isSelected = activeVendor.id === vendor.id;
              return (
                <button
                  key={vendor.id}
                  onClick={() => selectVendor(vendor.id)}
                  className={`p-3 rounded text-left transition-all border ${
                    isSelected
                      ? 'bg-[#292a2d] border-[#f3f6fc] text-[#f3f6fc] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                      : 'bg-[#0d0e11] border-[#44474a]/60 text-[#8e9194] hover:bg-[#1b1b1f] hover:text-[#c1c7d0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#f3f6fc]">
                      {vendor.name.split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        vendor.compatibilityStatus === 'SUPPORTED'
                          ? 'bg-[#1b1b1f] text-[#f3f6fc] border-[#f3f6fc]/40'
                          : vendor.compatibilityStatus === 'PARTIAL'
                          ? 'bg-[#1b1b1f] text-[#c1c7d0] border-[#8e9194]/40'
                          : 'bg-[#121316] text-[#8e9194] border-[#44474a]/40'
                      }`}>
                        {vendor.compatibilityStatus || 'PROTOTYPE'}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#f3f6fc]" />}
                    </div>
                  </div>
                  <div className="text-[9px] text-[#8e9194] truncate">
                    {vendor.defaultFilesystem}
                  </div>
                  <div className="text-[9px] text-[#c1c7d0] mt-1 font-mono">
                    {vendor.signatureMagic}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between">
          <div className="font-mono text-[10px] text-[#8e9194]">
            Vendor-specific demuxing module mapped. Ready for bitstream acquisition.
          </div>
          <button
            onClick={() => navigateTo('forensic-acquisition')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>PROCEED TO FORENSIC ACQUISITION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
