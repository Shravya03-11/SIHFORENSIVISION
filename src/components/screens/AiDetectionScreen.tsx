import React, { useState, useEffect } from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  SlidersHorizontal,
  User,
  Car,
  Package,
  Activity,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Eye,
  RotateCcw,
  Sparkles,
  Scan,
} from 'lucide-react';

const AnimatedConfidence: React.FC<{ target: number }> = ({ target }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 650;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(target * ease);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const req = requestAnimationFrame(step);
    return () => cancelAnimationFrame(req);
  }, [target]);

  return <span>{value.toFixed(1)}%</span>;
};

export const AiDetectionScreen: React.FC = () => {
  const {
    analysisResults,
    activeVideo,
    videoFrames,
    runVideoAnalysis,
    navigateTo,
    seekToTimecode,
  } = useForensics();

  const [filterType, setFilterType] = useState<string>('all');
  const [minConfidence, setMinConfidence] = useState<number>(75);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [visibleItemsCount, setVisibleItemsCount] = useState(10);

  const detections = analysisResults.filter((item) => {
    if (filterType !== 'all' && item.detection_type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    return item.confidence >= minConfidence;
  });

  const triggerScan = async () => {
    setIsScanning(true);
    setVisibleItemsCount(0);
    if (activeVideo?.id && runVideoAnalysis) {
      try {
        await runVideoAnalysis(activeVideo.id);
      } catch (err) {
        console.error('AI scan error:', err);
      }
    }
    setTimeout(() => setVisibleItemsCount(1), 300);
    setTimeout(() => setVisibleItemsCount(2), 650);
    setTimeout(() => setVisibleItemsCount(3), 1000);
    setTimeout(() => {
      setVisibleItemsCount(detections.length);
      setIsScanning(false);
    }, 1400);
  };

  useEffect(() => {
    triggerScan();
  }, [filterType, minConfidence]);

  return (
    <div className="max-w-5xl mx-auto space-y-4 font-mono select-none">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigateTo('video-analysis')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CCTV WORKSTATION</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 08 // AI COMPUTER VISION DETECTION &amp; OBJECT CLASSIFICATION
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                FORENSIC COMPUTER VISION &amp; BIOMETRIC MODEL SUITE
              </h1>
              <p className="text-xs text-[#8e9194]">
                Low-light IR-enhanced detection models calibrated for surveillance evidentiary standards
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0d0e11] border border-[#8e9194]/40 text-xs text-[#f3f6fc]">
            MODELS: <strong className="text-[#f3f6fc]">TENSOR-RT 8.6 ACCELERATED</strong>
          </div>
        </div>

        {/* Judicial AI Disclosure Banner */}
        <div className="p-3 rounded bg-[#0d0e11] border border-[#8e9194]/40 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#f3f6fc] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#8e9194] leading-relaxed">
            <strong className="text-[#f3f6fc] uppercase tracking-wider">
              JUDICIAL DISCLOSURE // PROTOTYPE AI MODEL:
            </strong>{' '}
            AI detection outputs serve as investigative assistance tools under Federal Rules of Evidence. All bounding boxes, gait anomalies, and license plate readings require independent human verification by a certified digital video forensic analyst.
          </div>
        </div>

        {/* Live Forensic Scan Viewport with Thin Silver Scanning Line */}
        <div className="relative h-24 bg-[#0d0e11] rounded border border-[#44474a]/60 overflow-hidden flex items-center justify-between px-5 shadow-inner">
          {/* Ambient Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {/* Thin Silver Scanning Line Moving Smoothly Across Frame */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className={`w-full h-0.5 bg-gradient-to-r from-transparent via-[#ffffff] to-transparent shadow-[0_0_12px_#ffffff] ${
                isScanning ? 'animate-scan-line-h' : 'top-1/2 absolute opacity-30'
              }`}
            ></div>
          </div>

          <div className="relative z-10 flex items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded bg-[#1b1b1f] border flex items-center justify-center transition-all ${
                isScanning
                  ? 'border-[#ffffff] shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'border-[#44474a]'
              }`}
            >
              <Scan className={`w-5 h-5 ${isScanning ? 'text-[#ffffff] animate-spin' : 'text-[#8e9194]'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#f3f6fc] tracking-wider uppercase">
                  {isScanning ? 'NEURAL SCANNER IN PROGRESS...' : 'EVIDENTIARY MODEL PASS COMPLETE'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isScanning ? 'bg-[#ffffff] animate-ping' : 'bg-[#c1c7d0]'
                  }`}
                ></span>
              </div>
              <p className="text-[10px] text-[#8e9194]">
                {isScanning
                  ? 'ANALYZING FRAME BUFFER // EXTRACTING BOUNDING VECTORS'
                  : `${detections.length} CORRELATED EVIDENCE TARGETS INDEXED`}
              </p>
            </div>
          </div>

          <button
            onClick={triggerScan}
            disabled={isScanning}
            className="relative z-10 metallic-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[11px] font-bold uppercase disabled:opacity-50"
            type="button"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>RE-RUN SCAN</span>
          </button>
        </div>

        {/* Filtering & Threshold Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#0d0e11] p-4 rounded border border-[#44474a] text-xs">
          {/* Category Filters */}
          <div className="md:col-span-7 space-y-2">
            <span className="text-[10px] text-[#8e9194] uppercase block font-semibold">
              EVIDENTIARY CLASSIFICATION CATEGORY
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'ALL CLASSES' },
                { id: 'person', label: 'PERSON BIOMETRICS' },
                { id: 'vehicle', label: 'VEHICLES & PLATES' },
                { id: 'object', label: 'CONCEALED OBJECTS' },
                { id: 'motion', label: 'MOTION PERIMETER' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase transition-colors ${
                    filterType === tab.id
                      ? 'bg-[#f3f6fc] text-[#121316]'
                      : 'bg-[#1b1b1f] text-[#c1c7d0] hover:bg-[#292a2d]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#8e9194] uppercase font-semibold">MINIMUM CONFIDENCE THRESHOLD</span>
              <span className="text-[#f3f6fc] font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-[#f3f6fc] bg-[#1b1b1f] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#8e9194]">
              <span>50% (Loose)</span>
              <span>75% (Evidentiary)</span>
              <span>95% (High Precision)</span>
            </div>
          </div>
        </div>

        {/* Detection Results Grid */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-[#f3f6fc]">
              CORRELATED OBJECT DETECTIONS ({detections.length} IDENTIFIED)
            </span>
            <span className="text-[10px] text-[#8e9194]">
              SYNCHRONIZED WITH TIME ENGINE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detections.slice(0, visibleItemsCount).map((det, index) => {
              const Icon =
                det.detection_type === 'Person'
                  ? User
                  : det.detection_type === 'Vehicle'
                  ? Car
                  : det.detection_type === 'Object'
                  ? Package
                  : Activity;

              const isSelected = selectedDetectionId === det.id;

              return (
                <div
                  key={det.id}
                  onClick={() => setSelectedDetectionId(det.id)}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className={`p-3.5 rounded bg-[#0d0e11] border transition-all space-y-2 shadow-sm cursor-pointer animate-page-enter ${
                    isSelected
                      ? 'border-[#f3f6fc] ring-1 ring-[#f3f6fc]/50 bg-[#121316]'
                      : 'border-[#44474a]/60 hover:border-[#8e9194]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#1b1b1f] border border-[#44474a] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#f3f6fc]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#f3f6fc] uppercase block">
                          {det.detection_type} // {det.result}
                        </span>
                        <span className="text-[9px] text-[#8e9194]">CAM-04 (NORTH PERIMETER)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#f3f6fc]">
                        <AnimatedConfidence target={det.confidence} />
                      </span>
                      <span className="block text-[9px] text-[#8e9194]">CONFIDENCE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-[#8e9194] block">TIMECODE:</span>
                      <span className={`font-semibold ${isSelected ? 'text-[#f3f6fc] underline' : 'text-[#c1c7d0]'}`}>
                        {det.timestamp}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8e9194] block">BOUNDING COORDS:</span>
                      <span className="text-[#c1c7d0] font-semibold">
                        {det.bbox ? `[${det.bbox.x}%, ${det.bbox.y}%]` : 'GLOBAL PERIMETER'}
                      </span>
                    </div>
                  </div>

                  {det.details && (
                    <div className="p-2 rounded bg-[#1b1b1f] border border-[#44474a]/40 text-[10px] space-y-1">
                      {Object.entries(det.details).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-[#8e9194] uppercase">{key.replace('_', ' ')}: </span>
                          <span className="text-[#f3f6fc]">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-[#8e9194]">EVIDENTIARY STATUS: VERIFIED</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        seekToTimecode(det.timestamp);
                      }}
                      className="px-2.5 py-1 rounded bg-[#1f1f23] border border-[#8e9194] text-[#f3f6fc] hover:bg-[#292a2d] flex items-center gap-1 font-semibold"
                      type="button"
                    >
                      <Eye className="w-3 h-3" />
                      <span>JUMP TO WORKSTATION TIME</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between text-xs">
          <div className="text-[10px] text-[#8e9194]">
            AI detections indexed for cross-camera correlation.
          </div>
          <button
            onClick={() => navigateTo('timeline')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>PROCEED TO INVESTIGATION TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
