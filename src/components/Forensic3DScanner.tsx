import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface Forensic3DScannerProps {
  isProcessing: boolean;
  stage?: string;
  isVerified?: boolean;
  className?: string;
}

export const Forensic3DScanner: React.FC<Forensic3DScannerProps> = ({
  isProcessing,
  stage = 'ANALYZING BITSTREAM SECTORS...',
  isVerified = false,
  className = '',
}) => {
  if (!isProcessing && !isVerified) return null;

  return (
    <div
      className={`relative p-6 rounded bg-[#0d0e11] border border-[#44474a]/70 flex flex-col items-center justify-center overflow-hidden shadow-2xl ${className}`}
      style={{ perspective: '800px' }}
    >
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f3f6fc_1px,transparent_1px),linear-gradient(to_bottom,#f3f6fc_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      {isProcessing ? (
        <div className="relative flex flex-col items-center gap-4 py-2">
          {/* 3D Rotating Circular Forensic Scanner */}
          <div
            className="relative w-36 h-36 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(18deg)' }}
          >
            {/* Outer Slow Rotating Dashed Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#8e9194]/60 animate-spin-slow"></div>

            {/* Middle Thin Silver Ring with Particle Nodes */}
            <div className="absolute inset-3 rounded-full border border-[#c1c7d0]/40 animate-spin-reverse-slow">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#f3f6fc] shadow-[0_0_8px_#ffffff]"></div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8e9194]"></div>
            </div>

            {/* Inner Precision Crosshair Ring */}
            <div className="absolute inset-7 rounded-full border border-[#44474a] flex items-center justify-center">
              <div className="w-full h-px bg-[#44474a]/60"></div>
              <div className="h-full w-px bg-[#44474a]/60 absolute"></div>
            </div>

            {/* Center Core Scanner Node */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-[#1b1b1f] border border-[#f3f6fc]/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <Cpu className="w-6 h-6 text-[#f3f6fc] animate-pulse" />
            </div>

            {/* Moving Silver Scan Line across the scanner */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#f3f6fc] to-transparent opacity-70 animate-scan-line-h"></div>
            </div>
          </div>

          {/* Real-time Status Readout */}
          <div className="text-center space-y-1 font-mono">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f3f6fc] animate-ping"></span>
              <span className="text-xs uppercase font-bold text-[#f3f6fc] tracking-wider">
                {stage}
              </span>
            </div>
            <div className="text-[10px] text-[#8e9194] uppercase tracking-widest">
              PARSING CHUNKS • FIPS-140-3 CRYPTO CORE ACTIVE
            </div>
          </div>
        </div>
      ) : isVerified ? (
        /* Smooth Verified Transition State */
        <div className="flex flex-col items-center gap-3 py-2 text-center font-mono animate-page-enter">
          <div className="w-16 h-16 rounded-full bg-[#1b1b1f] border-2 border-[#f3f6fc] flex items-center justify-center shadow-[0_0_20px_rgba(243,246,252,0.25)] animate-silver-pulse">
            <ShieldCheck className="w-8 h-8 text-[#f3f6fc]" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#f3f6fc] uppercase tracking-wider">
              ✓ SHA-256 HASH VERIFIED
            </div>
            <div className="text-[10px] text-[#8e9194] uppercase tracking-wider mt-0.5">
              NIST SP 800-88 ZERO BIT-DRIFT CERTIFIED
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
