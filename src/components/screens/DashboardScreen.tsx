import React from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  FolderPlus,
  Film,
  ShieldCheck,
  FileText,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { cases, evidenceList, navigateTo, activeCase } = useForensics();

  const stats = [
    {
      label: 'ACTIVE CASES',
      value: String(cases.length),
      subtext: 'Federal & Jurisdictional',
      icon: FolderPlus,
    },
    {
      label: 'EVIDENCE ITEMS',
      value: String(evidenceList.length * 14 + 14),
      subtext: '100% Hash Verified',
      icon: HardDrive,
    },
    {
      label: 'UNDER ANALYSIS',
      value: '4 FEEDS',
      subtext: 'Synchronous 60 FPS Engine',
      icon: Film,
    },
    {
      label: 'REPORTS GENERATED',
      value: '18 DOSSIERS',
      subtext: 'Rule 902(14) Certified',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
        <div>
          <h1 className="text-base font-bold font-mono text-[#f3f6fc] uppercase tracking-wider flex items-center gap-2">
            <span>OPERATIONS COMMAND</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b1b1f] text-[#c1c7d0] border border-[#44474a]/60">
              TERMINAL NODE-74A
            </span>
          </h1>
          <p className="text-xs text-[#8e9194] font-mono mt-0.5">
            Multi-Vendor DVR/NVR Digital Video Forensic Acquisition, Carving &amp; Analysis Suite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('create-case')}
            className="metallic-btn px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ NEW INVESTIGATION</span>
          </button>

          <button
            onClick={() => navigateTo('video-analysis')}
            className="metallic-btn-dark px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5" />
            <span>LAUNCH CCTV WORKSTATION</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards with 3D Micro-interactions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-3.5 flex flex-col justify-between shadow-sm relative overflow-hidden forensic-card-depth cursor-default group"
              style={{ perspective: '600px' }}
            >
              {/* Subtle metallic corner highlight */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

              <div className="flex items-center justify-between transition-transform duration-200 group-hover:translate-x-0.5">
                <span className="font-mono text-[10px] uppercase text-[#8e9194] tracking-wider font-semibold">
                  {stat.label}
                </span>
                <Icon className="w-4 h-4 text-[#c1c7d0] group-hover:text-white transition-colors" />
              </div>
              <div className="my-2 transition-transform duration-200 group-hover:translate-x-1">
                <span className="font-mono text-2xl font-bold text-[#f3f6fc] tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className="font-mono text-[10px] text-[#8e9194] flex items-center gap-1 transition-transform duration-200 group-hover:translate-x-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#f3f6fc]" />
                <span>{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Active Investigations & Rapid Workflow Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Active Investigations Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#1b1b1f] border border-[#44474a]/60 rounded p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase text-[#f3f6fc] font-bold tracking-wider">
                ACTIVE FORENSIC INVESTIGATIONS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0d0e11] text-[#c1c7d0]">
                {cases.length} DOCKETS
              </span>
            </div>
            <button
              onClick={() => navigateTo('create-case')}
              className="text-[11px] font-mono text-[#c1c7d0] hover:text-white flex items-center gap-1"
            >
              <span>ADD DOCKET</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#0d0e11] text-[#8e9194] text-[10px] uppercase border-b border-[#44474a]/60">
                  <th className="py-2 px-3">CASE ID</th>
                  <th className="py-2 px-3">INVESTIGATION TITLE</th>
                  <th className="py-2 px-3">HARDWARE SOURCE</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#44474a]/30">
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#292a2d] transition-colors group cursor-pointer"
                    onClick={() => navigateTo('video-analysis')}
                  >
                    <td className="py-3 px-3 font-semibold text-[#f3f6fc]">
                      #{c.case_number}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#f3f6fc] font-medium leading-tight">
                        {c.case_name}
                      </div>
                      <div className="text-[10px] text-[#8e9194] truncate max-w-xs">
                        {c.location}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#c1c7d0]">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#8e9194]" />
                        <span>Hikvision NVR (DS-7732)</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#0d0e11] border border-[#8e9194]/40 text-[10px] font-semibold text-[#f3f6fc]">
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('video-analysis');
                        }}
                        className="px-2 py-1 rounded bg-[#292a2d] group-hover:bg-[#f3f6fc] group-hover:text-[#121316] text-[#c1c7d0] text-[10px] font-semibold transition-colors uppercase"
                      >
                        OPEN VAULT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick SIH Demonstration Banner */}
          <div className="p-3 rounded bg-[#0d0e11] border border-[#44474a]/60 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f3f6fc]" />
              <span className="text-[#c1c7d0]">
                Preloaded SIH Prototype Case: <strong className="text-[#f3f6fc]">FV-2026-001 (Warehouse Theft Investigation)</strong>
              </span>
            </div>
            <button
              onClick={() => navigateTo('video-analysis')}
              className="text-[#f3f6fc] underline hover:no-underline font-semibold"
            >
              Analyze Synchronous 8-CH Stream →
            </button>
          </div>
        </div>

        {/* Right: Forensic Pipeline Quick Access with Animated Traveling Silver Light (4 cols) */}
        <div className="lg:col-span-4 bg-[#1b1b1f] border border-[#44474a]/60 rounded p-4 space-y-3 shadow-md flex flex-col justify-between forensic-card-depth">
          <div>
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2 mb-3">
              <span className="font-mono text-xs uppercase text-[#f3f6fc] font-bold tracking-wider">
                FORENSIC PIPELINE WORKFLOW
              </span>
              <span className="flex items-center gap-1 font-mono text-[9px] text-[#c1c7d0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f3f6fc] animate-pulse"></span>
                <span>STREAM ACTIVE</span>
              </span>
            </div>

            {/* Pipeline Container with animated traveling light rail */}
            <div className="relative pl-6 space-y-2 font-mono text-xs">
              {/* Continuous vertical pipeline rail */}
              <div className="absolute left-2.5 top-3 bottom-3 w-[2px] bg-[#292a2d]">
                {/* Subtle Moving Silver Light traveling through stages */}
                <div className="absolute w-[2px] h-12 bg-gradient-to-b from-transparent via-[#ffffff] to-transparent shadow-[0_0_8px_#ffffff] animate-pipeline-light"></div>
              </div>

              {/* Stage 1: Evidence Ingestion */}
              <button
                onClick={() => navigateTo('evidence-upload')}
                className="relative w-full text-left p-2.5 rounded bg-[#0d0e11] hover:bg-[#292a2d] border border-[#44474a]/40 hover:border-[#8e9194] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b1b1f] border border-[#44474a] group-hover:border-[#f3f6fc] flex items-center justify-center text-[10px] font-bold text-[#f3f6fc] shrink-0 z-10 transition-colors">
                    1
                  </span>
                  <div>
                    <div className="text-[#f3f6fc] font-medium leading-tight">Evidence Ingestion</div>
                    <div className="text-[9px] text-[#8e9194]">Bitstream file drag-and-drop</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8e9194] group-hover:text-[#f3f6fc] transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Stage 2: Multi-Vendor ID */}
              <button
                onClick={() => navigateTo('device-identification')}
                className="relative w-full text-left p-2.5 rounded bg-[#0d0e11] hover:bg-[#292a2d] border border-[#44474a]/40 hover:border-[#8e9194] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b1b1f] border border-[#44474a] group-hover:border-[#f3f6fc] flex items-center justify-center text-[10px] font-bold text-[#f3f6fc] shrink-0 z-10 transition-colors">
                    2
                  </span>
                  <div>
                    <div className="text-[#f3f6fc] font-medium leading-tight">Multi-Vendor ID</div>
                    <div className="text-[9px] text-[#8e9194]">Hikvision, Dahua, CP Plus &amp; more</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8e9194] group-hover:text-[#f3f6fc] transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Stage 3: Cryptographic Hashes */}
              <button
                onClick={() => navigateTo('integrity-verification')}
                className="relative w-full text-left p-2.5 rounded bg-[#0d0e11] hover:bg-[#292a2d] border border-[#44474a]/40 hover:border-[#8e9194] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b1b1f] border border-[#44474a] group-hover:border-[#f3f6fc] flex items-center justify-center text-[10px] font-bold text-[#f3f6fc] shrink-0 z-10 transition-colors">
                    3
                  </span>
                  <div>
                    <div className="text-[#f3f6fc] font-medium leading-tight">Cryptographic Hashes</div>
                    <div className="text-[9px] text-[#8e9194]">Live MD5 &amp; SHA-256 calculation</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8e9194] group-hover:text-[#f3f6fc] transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Stage 4: Video Analysis */}
              <button
                onClick={() => navigateTo('video-analysis')}
                className="relative w-full text-left p-2.5 rounded bg-[#0d0e11] hover:bg-[#292a2d] border border-[#44474a]/40 hover:border-[#8e9194] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b1b1f] border border-[#44474a] group-hover:border-[#f3f6fc] flex items-center justify-center text-[10px] font-bold text-[#f3f6fc] shrink-0 z-10 transition-colors">
                    4
                  </span>
                  <div>
                    <div className="text-[#f3f6fc] font-medium leading-tight">Video Analysis</div>
                    <div className="text-[9px] text-[#8e9194]">Multi-feed CCTV workstation</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8e9194] group-hover:text-[#f3f6fc] transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Stage 5: Timeline Matrix */}
              <button
                onClick={() => navigateTo('timeline')}
                className="relative w-full text-left p-2.5 rounded bg-[#0d0e11] hover:bg-[#292a2d] border border-[#44474a]/40 hover:border-[#8e9194] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b1b1f] border border-[#44474a] group-hover:border-[#f3f6fc] flex items-center justify-center text-[10px] font-bold text-[#f3f6fc] shrink-0 z-10 transition-colors">
                    5
                  </span>
                  <div>
                    <div className="text-[#f3f6fc] font-medium leading-tight">Timeline Matrix</div>
                    <div className="text-[9px] text-[#8e9194]">SMPTE synchronized cross-event map</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8e9194] group-hover:text-[#f3f6fc] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#44474a]/40">
            <button
              onClick={() => navigateTo('forensic-report')}
              className="w-full metallic-btn py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group"
            >
              <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>OFFICIAL FORENSIC DOSSIER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
