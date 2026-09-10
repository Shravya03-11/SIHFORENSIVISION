import React, { useState } from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  Clock,
  User,
  Car,
  Activity,
  Camera,
  ArrowRight,
  ArrowLeft,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const TimelineScreen: React.FC = () => {
  const { timelineEvents, navigateTo, seekToTimecode } = useForensics();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cameraFilter, setCameraFilter] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>(timelineEvents[0]?.id || '');

  const filteredEvents = timelineEvents.filter((ev) => {
    if (typeFilter !== 'all' && ev.event_type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    if (cameraFilter !== 'all' && ev.camera_id !== cameraFilter) {
      return false;
    }
    return true;
  });

  const selectedEvent = timelineEvents.find((ev) => ev.id === selectedEventId) || timelineEvents[0];

  return (
    <div className="max-w-6xl mx-auto space-y-4 font-mono select-none">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigateTo('ai-detection')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO AI DETECTION</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 09 // CHRONOLOGICAL INVESTIGATION TIMELINE
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                SYNCHRONIZED MULTI-CHANNEL SURVEILLANCE TIMELINE
              </h1>
              <p className="text-xs text-[#8e9194]">
                Sub-second chronological event log across all facility surveillance vantage points
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded bg-[#0d0e11] border border-[#8e9194]/40 text-xs text-[#f3f6fc]">
            EVENTS LOGGED: <strong className="text-[#f3f6fc]">{timelineEvents.length}</strong>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0d0e11] p-3.5 rounded border border-[#44474a] text-xs">
          <div>
            <span className="text-[10px] text-[#8e9194] uppercase block font-semibold mb-1.5">
              FILTER BY OBJECT / CLASSIFICATION
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Motion', 'Person', 'Vehicle', 'Anomaly'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase transition-colors ${
                    typeFilter === t
                      ? 'bg-[#f3f6fc] text-[#121316]'
                      : 'bg-[#1b1b1f] text-[#c1c7d0] hover:bg-[#292a2d]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#8e9194] uppercase block font-semibold mb-1.5">
              FILTER BY CAMERA VANTAGE POINT
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'CAM-01', 'CAM-02', 'CAM-03', 'CAM-04', 'CAM-06'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCameraFilter(c)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase transition-colors ${
                    cameraFilter === c
                      ? 'bg-[#f3f6fc] text-[#121316]'
                      : 'bg-[#1b1b1f] text-[#c1c7d0] hover:bg-[#292a2d]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Split View: Chronological Timeline Spine & Selected Event Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Interactive Timeline Spine (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs uppercase font-bold text-[#f3f6fc] block">
              CHRONOLOGICAL RECONSTRUCTION (2026-08-14)
            </span>

            <div className="relative pl-6 border-l-2 border-[#44474a] space-y-4">
              {filteredEvents.map((ev) => {
                const isSelected = selectedEvent?.id === ev.id;
                const Icon =
                  ev.event_type === 'Person'
                    ? User
                    : ev.event_type === 'Vehicle'
                    ? Car
                    : Activity;

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`relative p-3.5 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#292a2d] border-[#f3f6fc] shadow-[0_0_15px_rgba(243,246,252,0.1)]'
                        : 'bg-[#0d0e11] border-[#44474a]/60 hover:border-[#8e9194] hover:bg-[#1b1b1f]'
                    }`}
                  >
                    {/* Spine Node Dot */}
                    <div
                      className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'bg-[#f3f6fc] border-[#f3f6fc] scale-125'
                          : 'bg-[#121316] border-[#8e9194]'
                      }`}
                    ></div>

                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#f3f6fc]" />
                        <span className="font-bold text-[#f3f6fc] text-sm tracking-tight">
                          {ev.timestamp}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#1b1b1f] text-[10px] text-[#c1c7d0] border border-[#44474a]/40">
                          {ev.camera_id}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8e9194]">FRAME #{ev.frame_number}</span>
                    </div>

                    <p className="text-xs text-[#c1c7d0] leading-snug">{ev.description}</p>

                    <div className="mt-2 pt-2 border-t border-[#44474a]/30 flex items-center justify-between text-[10px] text-[#8e9194]">
                      <span>{ev.camera_name}</span>
                      <span className="text-[#f3f6fc] font-semibold">VIEW DETAILS →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Event Dossier Inspection (5 cols) */}
          <div className="lg:col-span-5 bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-4 text-xs h-fit shadow-md">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <span className="font-bold text-[#f3f6fc] uppercase tracking-wider">
                EVIDENTIARY DETAIL INSPECTION
              </span>
              <span className="text-[10px] text-[#8e9194]">
                KEYFRAME SYNCED
              </span>
            </div>

            {selectedEvent ? (
              <div className="space-y-3">
                <div className="p-3 rounded bg-[#1b1b1f] border border-[#44474a]/60 space-y-2">
                  <div className="text-[10px] text-[#8e9194] uppercase">TIME CODE STAMP</div>
                  <div className="text-xl font-bold text-[#f3f6fc]">
                    2026-08-14 {selectedEvent.timestamp} UTC
                  </div>
                  <div className="text-[11px] text-[#c1c7d0]">
                    Camera Channel: <strong className="text-[#f3f6fc]">{selectedEvent.camera_id} ({selectedEvent.camera_name})</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8e9194] uppercase block">ANALYSIS SUMMARY</span>
                  <div className="p-3 rounded bg-[#1b1b1f] border border-[#44474a]/40 text-xs text-[#f3f6fc] leading-relaxed">
                    {selectedEvent.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-[#1b1b1f] p-2 rounded">
                    <span className="text-[#8e9194] block uppercase">EVENT TYPE</span>
                    <span className="text-[#f3f6fc] font-bold">{selectedEvent.event_type}</span>
                  </div>
                  <div className="bg-[#1b1b1f] p-2 rounded">
                    <span className="text-[#8e9194] block uppercase">FRAME OFFSET</span>
                    <span className="text-[#f3f6fc] font-bold">#{selectedEvent.frame_number}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => seekToTimecode(selectedEvent.timestamp)}
                    className="w-full metallic-btn py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>JUMP TO WORKSTATION TIME STAMP</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#8e9194]">
                Select an event from the timeline to inspect metadata.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between text-xs">
          <div className="text-[10px] text-[#8e9194]">
            Timeline keyframes mapped to facility multi-camera corridors.
          </div>
          <button
            onClick={() => navigateTo('multi-camera')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>PROCEED TO MULTI-CAMERA CORRELATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
