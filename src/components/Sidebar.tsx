import React from 'react';
import { useForensics } from '../context/ForensicContext';
import { ScreenId } from '../types';
import {
  LayoutDashboard,
  UploadCloud,
  Cpu,
  ShieldCheck,
  Film,
  Sparkles,
  Clock,
  Layers,
  FileSearch,
  FileCheck,
  FileSpreadsheet,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const { currentScreen, navigateTo, sidebarExpanded, toggleSidebar, setSidebarExpanded } =
    useForensics();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Investigation Command',
      sublabel: 'ACTIVE CASES & TELEMETRY',
      icon: LayoutDashboard,
    },
    {
      id: 'video-analysis',
      label: 'CCTV & Multi-Feed Analysis',
      sublabel: 'SYNCHRONOUS FEED MATRIX',
      icon: Film,
    },
    {
      id: 'ai-detection',
      label: 'Forensic AI Detection Layer',
      sublabel: 'PERSON / VEHICLE / OBJECT',
      icon: Sparkles,
    },
    {
      id: 'timeline',
      label: 'Synchronized Timeline Matrix',
      sublabel: 'SMPTE 60FPS TIME ENGINE',
      icon: Clock,
    },
    {
      id: 'multi-camera',
      label: 'Multi-Camera Correlation',
      sublabel: 'FACILITY FLOOR PLAN TRACKING',
      icon: Layers,
    },
    {
      id: 'recovery-analysis',
      label: 'Carving & Recovery Analysis',
      sublabel: 'DELETED STREAM HEURISTICS',
      icon: FileSearch,
    },
    {
      id: 'integrity-verification',
      label: 'Cryptographic Integrity Vault',
      sublabel: 'SHA-256 NIST SP 800-88',
      icon: ShieldCheck,
    },
    {
      id: 'device-identification',
      label: 'Device & Multi-Vendor Profiler',
      sublabel: 'HIK / DAHUA / CP PLUS / VIGI',
      icon: Cpu,
    },
    {
      id: 'forensic-acquisition',
      label: 'Forensic Acquisition Engine',
      sublabel: 'ORIGINAL VS WORKING COPY',
      icon: Lock,
    },
    {
      id: 'evidence-upload',
      label: 'Evidence File Ingestion',
      sublabel: 'RAW DD / IMG BITSTREAM',
      icon: UploadCloud,
    },
    {
      id: 'investigation-summary',
      label: 'Investigation Summary Dossier',
      sublabel: 'CORRELATED TRIAGE FINDINGS',
      icon: FileSpreadsheet,
    },
    {
      id: 'forensic-report',
      label: 'Official Forensic Dossier',
      sublabel: 'RULE 902(14) COURT EXPORT',
      icon: FileCheck,
    },
  ];

  return (
    <>
      {/* Click-outside backdrop when sidebar is expanded in overlay mode */}
      {sidebarExpanded && (
        <div
          onClick={() => setSidebarExpanded(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300 animate-page-enter"
          aria-hidden="true"
        />
      )}

      {/* Main Collapsible Forensic Modules Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-[#0d0e11] border-r border-[#44474a]/60 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-2xl ${
          sidebarExpanded
            ? 'w-72 translate-x-0'
            : 'w-0 md:w-14 -translate-x-full md:translate-x-0 overflow-hidden'
        }`}
      >
        {/* Navigation Items Area */}
        <div className="flex-1 overflow-y-auto py-2 px-1.5 scrollbar-thin">
          {/* Header Row when expanded vs collapsed */}
          {sidebarExpanded ? (
            <div className="flex items-center justify-between px-2 mb-2 pb-2 border-b border-[#44474a]/40 font-mono">
              <div className="flex items-center gap-1.5 text-[10px] text-[#8e9194] uppercase tracking-widest font-semibold">
                <span>FORENSIC MODULES</span>
                <span className="text-[9px] text-[#c1c7d0] px-1 py-0.5 rounded bg-[#1b1b1f] border border-[#44474a]/60">
                  FIPS-140-3
                </span>
              </div>
              <button
                onClick={() => setSidebarExpanded(false)}
                className="p-1 rounded hover:bg-[#292a2d] text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-2 pb-1 border-b border-[#44474a]/40">
              <button
                onClick={() => setSidebarExpanded(true)}
                className="p-1.5 rounded hover:bg-[#1f1f23] text-[#8e9194] hover:text-[#f3f6fc] transition-colors group"
                title="Expand Forensic Modules"
                aria-label="Expand Forensic Modules"
              >
                <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          {/* Module Nav Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                  }}
                  title={`${item.label} (${item.sublabel})`}
                  className={`group relative flex items-center rounded transition-all border ${
                    sidebarExpanded ? 'gap-3 px-3 py-2 text-left' : 'justify-center p-2'
                  } ${
                    isActive
                      ? 'bg-[#292a2d] border-[#8e9194] text-[#f3f6fc] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                      : 'border-transparent text-[#c4c7ca] hover:bg-[#1f1f23] hover:text-[#e3e2e6] hover:border-[#44474a]/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? 'text-[#f3f6fc] scale-110'
                        : 'text-[#8e9194] group-hover:text-[#c1c7d0] group-hover:scale-105'
                    }`}
                  />

                  {/* Text Labels shown only when expanded */}
                  {sidebarExpanded && (
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[12px] font-medium leading-tight truncate">
                        {item.label}
                      </span>
                      <span className="font-mono text-[9px] text-[#8e9194] tracking-tight uppercase truncate mt-0.5">
                        {item.sublabel}
                      </span>
                    </div>
                  )}

                  {/* Active Indicator bar on left */}
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-[#f3f6fc]"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Terminal Node & Cryptographic Status */}
        <div className="p-2 border-t border-[#44474a]/40 bg-[#0d0e11]">
          {sidebarExpanded ? (
            <div className="p-2.5 rounded bg-[#1b1b1f] border border-[#44474a]/60 flex flex-col gap-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[#8e9194] uppercase tracking-wider">TERMINAL NODE</span>
                <span className="text-[#f3f6fc] font-semibold">NODE-74A [VAULT]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e9194] uppercase tracking-wider">CRYPTOGRAPHIC ENGINE</span>
                <span className="text-[#c1c7d0]">FIPS-140-3 HW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e9194] uppercase tracking-wider">BITSTREAM INTEGRITY</span>
                <span className="text-[#f3f6fc] font-semibold">100% UNTAMPERED</span>
              </div>
              <div className="w-full bg-[#343538] h-1.5 rounded overflow-hidden mt-1">
                <div className="bg-[#d6dadf] h-full w-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center p-1.5 rounded bg-[#1b1b1f] border border-[#44474a]/60 cursor-pointer"
              onClick={() => setSidebarExpanded(true)}
              title="Terminal Node Active: FIPS-140-3 HW • Bitstream 100% Untampered"
            >
              <div className="w-2 h-2 rounded-full bg-[#f3f6fc] animate-pulse"></div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
