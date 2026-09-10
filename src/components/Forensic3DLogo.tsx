import React, { useState } from 'react';
import { Shield, Eye } from 'lucide-react';

interface Forensic3DLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Forensic3DLogo: React.FC<Forensic3DLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Moderate subtle tilt angle (max 10 degrees)
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const boxSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div
      className={`flex items-center gap-2.5 text-left group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '800px' }}
    >
      {/* 3D Metallic Shield / Eye Emblem */}
      <div
        className={`${boxSize} rounded-md bg-gradient-to-b from-[#292a2d] to-[#121316] border border-[#8e9194]/50 flex items-center justify-center relative shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)] forensic-logo-sheen transition-transform duration-300 ease-out`}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(6px) scale(1.04)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle metallic inner rim */}
        <div className="absolute inset-0.5 rounded-[4px] border border-[#f3f6fc]/20 pointer-events-none"></div>

        {/* Shield Icon with metallic silver depth */}
        <div className="relative z-10 flex items-center justify-center" style={{ transform: 'translateZ(4px)' }}>
          <Shield className={`${iconSize} text-[#f3f6fc] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`} />
          <Eye className="w-2.5 h-2.5 text-[#f3f6fc] absolute inset-0 m-auto opacity-90" />
        </div>

        {/* Ambient Silver Reflection Beam */}
        <div
          className={`absolute inset-0 rounded-md bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-[15px] uppercase tracking-wider text-[#f3f6fc] font-bold leading-none font-mono group-hover:text-white transition-colors">
            FORENSIVISION
          </span>
          <span className="text-[9px] font-mono text-[#8e9194] tracking-widest uppercase mt-0.5 group-hover:text-[#c1c7d0] transition-colors">
            APEX FORENSICS OS v4.8
          </span>
        </div>
      )}
    </div>
  );
};
