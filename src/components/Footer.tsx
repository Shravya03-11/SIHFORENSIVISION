import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-8 bg-[#0d0e11] border-t border-[#44474a]/60 px-4 flex items-center justify-between shadow-[0_-1px_0_rgba(255,255,255,0.04)] font-mono text-[10px] select-none">
      <div className="flex items-center gap-3 md:gap-4 truncate">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f3f6fc] animate-pulse"></span>
          <span className="text-[#c4c7ca] uppercase">FRAME ACCURACY RATE:</span>
          <span className="text-[#f3f6fc] font-semibold">99.98%</span>
        </div>
        <span className="text-[#44474a] hidden sm:inline">•</span>
        <div className="hidden sm:flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#f3f6fc]" />
          <span className="text-[#c1c7d0] uppercase tracking-tight font-medium">
            EVIDENTIARY HASH MATCH
          </span>
        </div>
        <span className="text-[#44474a] hidden md:inline">•</span>
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-[#c4c7ca] uppercase">TAMPER DETECTION:</span>
          <span className="text-[#f3f6fc] font-semibold uppercase">CLEAN</span>
        </div>
        <span className="text-[#44474a] hidden lg:inline">•</span>
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-[#c4c7ca] uppercase">TIME ENGINE:</span>
          <span className="text-[#f3f6fc] font-semibold">60.00 FPS SYNCED</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[#8e9194] uppercase tracking-wider hidden sm:inline">
          BLOCK: #9884210.AA
        </span>
        <span className="px-1.5 py-0.5 rounded bg-[#1b1b1f] border border-[#44474a]/40 text-[#c1c7d0] text-[9px] tracking-widest uppercase font-semibold">
          DOJ-NIST COMPLIANT
        </span>
      </div>
    </footer>
  );
};
