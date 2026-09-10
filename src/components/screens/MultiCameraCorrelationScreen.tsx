import React, { useState } from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const MultiCameraCorrelationScreen: React.FC = () => {
  const { correlationData, navigateTo } = useForensics();
  const [activeStep, setActiveStep] = useState<number>(2); // Highlight Loading Area step

  return (
    <div className="max-w-6xl mx-auto space-y-4 font-mono select-none">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigateTo('timeline')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO TIMELINE</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 10 // MULTI-CAMERA SPATIAL &amp; TEMPORAL CORRELATION
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                SUBJECT TRAJECTORY &amp; MULTI-CAMERA RE-IDENTIFICATION
              </h1>
              <p className="text-xs text-[#8e9194]">
                Automated biometric &amp; visual re-identification across non-overlapping surveillance camera fields of view
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0d0e11] border border-[#8e9194]/40 text-xs text-[#f3f6fc]">
            TARGET: <strong className="text-[#f3f6fc]">{correlationData.subject_id}</strong>
          </div>
        </div>

        {/* Top Metric Cards matching user requirements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              CORRELATED EVENTS
            </span>
            <span className="text-2xl font-bold text-[#f3f6fc] tracking-tight">
              {correlationData.events_count}
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">Consecutive Sightings</span>
          </div>

          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              CAMERAS INVOLVED
            </span>
            <span className="text-2xl font-bold text-[#f3f6fc] tracking-tight">
              {correlationData.cameras_count} FEEDS
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">CAM-01 through CAM-06</span>
          </div>

          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              TIME WINDOW
            </span>
            <span className="text-2xl font-bold text-[#f3f6fc] tracking-tight text-sm md:text-lg">
              {correlationData.time_window.split(' ')[0]}
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">22:31:12 to 22:44:08 UTC</span>
          </div>

          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              RE-ID CONFIDENCE
            </span>
            <span className="text-2xl font-bold text-[#f3f6fc] tracking-tight">
              {correlationData.confidence.toFixed(0)}%
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">Biometric Gait Parity</span>
          </div>
        </div>

        {/* Spatial Facility Floor Plan Diagram */}
        <div className="bg-[#0d0e11] border border-[#44474a] rounded p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
            <span className="text-xs uppercase font-bold text-[#f3f6fc]">
              WAREHOUSE SECTOR 4 // SPATIAL SENSOR CORRELATION MAP
            </span>
            <span className="text-[10px] text-[#8e9194]">ORTHOGRAPHIC ARCHITECTURAL PROJECTION</span>
          </div>

          {/* SVG Map Layout */}
          <div className="relative w-full h-64 bg-[#121316] rounded border border-[#44474a]/40 overflow-hidden flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#f3f6fc_1px,transparent_1px),linear-gradient(to_bottom,#f3f6fc_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <svg className="w-full h-full p-4" viewBox="0 0 800 240">
              {/* Facility Perimeter Walls */}
              <rect x="50" y="20" width="700" height="200" fill="none" stroke="#44474a" strokeWidth="2" />
              {/* Interior partitions */}
              <line x1="220" y1="20" x2="220" y2="170" stroke="#44474a" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="400" y1="70" x2="400" y2="220" stroke="#44474a" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="580" y1="20" x2="580" y2="180" stroke="#44474a" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Room Labels */}
              <text x="70" y="45" fill="#8e9194" fontSize="10" fontFamily="monospace">MAIN GATE ENTRANCE</text>
              <text x="240" y="45" fill="#8e9194" fontSize="10" fontFamily="monospace">PARKING &amp; VEHICLE BAY</text>
              <text x="420" y="95" fill="#8e9194" fontSize="10" fontFamily="monospace">LOADING DOCK 3B</text>
              <text x="600" y="45" fill="#8e9194" fontSize="10" fontFamily="monospace">EAST CORRIDOR &amp; EGRESS</text>

              {/* Interpolated Trajectory Vector */}
              <path
                d="M 120,130 C 180,110 260,150 310,120 C 370,80 440,160 500,140 C 560,120 630,140 680,100"
                fill="none"
                stroke="#f3f6fc"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />

              {/* Camera Nodes */}
              {correlationData.route_steps.map((point, idx) => {
                const coords = [
                  { x: 120, y: 130 },
                  { x: 310, y: 120 },
                  { x: 500, y: 140 },
                  { x: 580, y: 170 },
                  { x: 680, y: 100 },
                ][idx];

                const isCurrent = activeStep === idx;

                return (
                  <g
                    key={idx}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer"
                    onClick={() => setActiveStep(idx)}
                  >
                    <circle
                      r={isCurrent ? 14 : 9}
                      fill={isCurrent ? '#f3f6fc' : '#1b1b1f'}
                      stroke={isCurrent ? '#f3f6fc' : '#8e9194'}
                      strokeWidth="2"
                    />
                    <circle
                      r={isCurrent ? 20 : 0}
                      fill="none"
                      stroke="#f3f6fc"
                      strokeWidth="1"
                      className="animate-ping opacity-50"
                    />
                    <text
                      y={isCurrent ? 4 : 3}
                      textAnchor="middle"
                      fill={isCurrent ? '#121316' : '#f3f6fc'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {idx + 1}
                    </text>
                    <text
                      y={-18}
                      textAnchor="middle"
                      fill="#f3f6fc"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {point.camera}
                    </text>
                    <text
                      y={26}
                      textAnchor="middle"
                      fill="#8e9194"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {point.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Step-by-Step Trajectory Pathway */}
        <div className="space-y-3">
          <span className="text-xs uppercase font-bold text-[#f3f6fc] block">
            CHRONOLOGICAL RE-IDENTIFICATION TRAJECTORY STOPS
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {correlationData.route_steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#292a2d] border-[#f3f6fc] shadow-md'
                      : 'bg-[#0d0e11] border-[#44474a]/60 hover:border-[#8e9194]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#8e9194] mb-1">
                    <span className="font-bold text-[#f3f6fc]">STOP 0{idx + 1}</span>
                    <span>{step.time}</span>
                  </div>
                  <div className="font-bold text-sm text-[#f3f6fc] truncate">
                    {step.camera}
                  </div>
                  <div className="text-[10px] text-[#c1c7d0] mt-0.5 truncate">
                    {step.name}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-[#44474a]/40 flex items-center justify-between text-[9px]">
                    <span className="text-[#8e9194]">RE-ID:</span>
                    <span className="text-[#f3f6fc] font-bold">
                      94% MATCH
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between text-xs">
          <div className="text-[10px] text-[#8e9194]">
            Trajectory sequence verified against surveillance clock drift matrix.
          </div>
          <button
            onClick={() => navigateTo('recovery-analysis')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>PROCEED TO RECOVERY ANALYSIS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
