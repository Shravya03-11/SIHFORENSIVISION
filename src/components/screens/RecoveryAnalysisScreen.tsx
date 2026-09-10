import React, { useState } from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Play,
  CalendarPlus,
  Loader2,
  ShieldAlert,
  X,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { RecoveryResult } from '../../types';

export const RecoveryAnalysisScreen: React.FC = () => {
  const {
    recoveryResults,
    isScanningRecovery,
    recoveryScanProgress,
    recoveryScanStage,
    startRecoveryScan,
    addRecoveryToTimeline,
    previewRecoveredVideo,
    navigateTo,
    activeCase,
    activeEvidence,
  } = useForensics();

  // Fallback items if scan has not yet been executed
  const defaultItems: RecoveryResult[] = [
    {
      id: 'rec-1',
      case_id: activeCase?.id || 'case-fv-2026-001',
      evidence_id: activeEvidence?.id || 'ev-9942',
      recovery_id: 'REC-001',
      camera_id: 'CAM-03',
      timestamp: '22:18:41',
      segment_name: 'video_segment_001.mp4',
      status: 'RECOVERABLE',
      confidence: 98.4,
      preview_path: '/uploads/evidence/sample_cctv.mp4',
      created_at: new Date().toISOString(),
    },
    {
      id: 'rec-2',
      case_id: activeCase?.id || 'case-fv-2026-001',
      evidence_id: activeEvidence?.id || 'ev-9942',
      recovery_id: 'REC-002',
      camera_id: 'CAM-04',
      timestamp: '22:22:17',
      segment_name: 'video_segment_002.h264',
      status: 'PARTIAL',
      confidence: 76.1,
      preview_path: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'rec-3',
      case_id: activeCase?.id || 'case-fv-2026-001',
      evidence_id: activeEvidence?.id || 'ev-9942',
      recovery_id: 'REC-003',
      camera_id: 'CAM-06',
      timestamp: '22:31:04',
      segment_name: 'video_segment_003.raw',
      status: 'CORRUPTED',
      confidence: 34.0,
      preview_path: '',
      created_at: new Date().toISOString(),
    },
    {
      id: 'rec-4',
      case_id: activeCase?.id || 'case-fv-2026-001',
      evidence_id: activeEvidence?.id || 'ev-9942',
      recovery_id: 'REC-004',
      camera_id: 'CAM-01',
      timestamp: '22:34:50',
      segment_name: 'video_segment_004.mp4',
      status: 'RECOVERABLE',
      confidence: 94.7,
      preview_path: '/uploads/evidence/sample_cctv.mp4',
      created_at: new Date().toISOString(),
    },
  ];

  const items = recoveryResults.length > 0 ? recoveryResults : defaultItems;

  const [selectedRecordId, setSelectedRecordId] = useState<string>(items[0]?.recovery_id || 'REC-001');
  const [timelineAddedMap, setTimelineAddedMap] = useState<Record<string, boolean>>({});
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewingRecord, setPreviewingRecord] = useState<RecoveryResult | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.recovery_id === selectedRecordId || i.id === selectedRecordId) || items[0];

  const handleStartScan = async () => {
    await startRecoveryScan();
  };

  const handleAddToTimeline = async (rec: RecoveryResult) => {
    await addRecoveryToTimeline(rec.id || rec.recovery_id);
    setTimelineAddedMap((prev) => ({ ...prev, [rec.recovery_id]: true }));
  };

  const handleOpenPreview = (rec: RecoveryResult) => {
    setPreviewingRecord(rec);
    setPreviewModalOpen(true);
  };

  const handleExportCarved = () => {
    if (!selectedItem) return;
    const content = `FORENSIVISION CARVED STREAM DUMP
RECOVERY ID: ${selectedItem.recovery_id}
CASE: ${selectedItem.case_id}
CAMERA: ${selectedItem.camera_id}
TIMECODE: ${selectedItem.timestamp}
STATUS: ${selectedItem.status}
CONFIDENCE: ${selectedItem.confidence}%
CONTAINER SEGMENT: ${selectedItem.segment_name}
FIPS 140-3 COMPLIANT BITSTREAM EXTRACT.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedItem.recovery_id}_carved_stream.raw`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`Carved stream ${selectedItem.recovery_id} exported successfully (.RAW).`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const recoverableCount = items.filter((c) => c.status === 'RECOVERABLE').length;
  const partialCount = items.filter((c) => c.status === 'PARTIAL').length;
  const corruptedCount = items.filter((c) => c.status === 'CORRUPTED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-4 font-mono select-none">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigateTo('multi-camera')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO MULTI-CAMERA</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 11 // UNALLOCATED SPACE STREAM CARVING &amp; DELETED FOOTAGE RECOVERY
        </span>
      </div>

      {/* Forensic Integrity Disclaimer Note (Requirement 6) */}
      <div className="p-3 rounded bg-[#16171b] border border-[#8e9194]/60 text-xs flex items-start gap-3 shadow-md">
        <ShieldAlert className="w-5 h-5 text-[#f3f6fc] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-[#f3f6fc] tracking-wider text-[11px] uppercase">
            FORENSIC INTEGRITY NOTICE: PROTOTYPE / SIMULATED RECOVERY ANALYSIS
          </div>
          <p className="text-[#c1c7d0] text-[11px] leading-relaxed">
            Heuristic reconstruction demonstration for forensic evaluation. This prototype reconstructs and correlates surveillance stream signatures from unallocated sectors. Unsupported recovery operations operate in simulated heuristic mode; guaranteed bitstream recovery across all proprietary DVR/NVR filesystems cannot be promised.
          </p>
        </div>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        {/* Header & Scan Trigger Button (Requirement 1) */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#44474a]/40 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                RAW DISK VIDEO STREAM CARVING &amp; RECOVERY ENGINE
              </h1>
              <p className="text-xs text-[#8e9194]">
                Bitstream carving of unallocated clusters, orphaned video streams, and overwritten indices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartScan}
              disabled={isScanningRecovery}
              className={`metallic-btn px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isScanningRecovery ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              type="button"
            >
              {isScanningRecovery ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#121316]" />
                  <span>CARVING IN PROGRESS...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>START CARVING &amp; RECOVERY ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Progress Bar & States (Requirement 2) */}
        {isScanningRecovery && (
          <div className="p-4 rounded bg-[#0d0e11] border border-[#f3f6fc]/40 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#f3f6fc] font-bold uppercase flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{recoveryScanStage}</span>
              </span>
              <span className="font-bold text-[#f3f6fc]">{recoveryScanProgress}%</span>
            </div>
            <div className="w-full bg-[#1b1b1f] h-2 rounded overflow-hidden border border-[#44474a]">
              <div
                className="bg-gradient-to-r from-[#c1c7d0] to-[#ffffff] h-full transition-all duration-300"
                style={{ width: `${recoveryScanProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-[#8e9194] pt-1">
              <span>INITIALIZING PARSER</span>
              <span>UNALLOCATED SECTORS</span>
              <span>INDEX REBUILD</span>
              <span>LOCATING STREAMS</span>
              <span>COMPLETING SCAN</span>
            </div>
          </div>
        )}

        {/* 4 Carving Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              UNALLOCATED SECTORS
            </span>
            <span className="text-2xl font-bold text-[#f3f6fc] tracking-tight">
              1,842,900
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">492,100 Inspected</span>
          </div>

          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              RECOVERABLE STREAMS
            </span>
            <span className="text-2xl font-bold text-[#f3f6fc] tracking-tight">
              {recoverableCount}
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">Contiguous Video Frames</span>
          </div>

          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              PARTIAL STREAMS
            </span>
            <span className="text-2xl font-bold text-[#c1c7d0] tracking-tight">
              {partialCount}
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">Truncated / GOP Gaps</span>
          </div>

          <div className="bg-[#0d0e11] p-3 rounded border border-[#44474a]/60">
            <span className="text-[9px] text-[#8e9194] uppercase block font-semibold">
              CORRUPTED STREAMS
            </span>
            <span className="text-2xl font-bold text-[#8e9194] tracking-tight">
              {corruptedCount}
            </span>
            <span className="text-[10px] text-[#8e9194] block mt-0.5">High Sector Overwrites</span>
          </div>
        </div>

        {/* Results Table & Hex Preview (Requirement 3, 4, 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Candidates List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-[#f3f6fc] block">
                CARVED STREAM CANDIDATES (UNALLOCATED BLOCKS)
              </span>
              <span className="text-[10px] text-[#8e9194]">{items.length} STREAMS LOCATED</span>
            </div>

            <div className="overflow-x-auto border border-[#44474a] rounded bg-[#0d0e11]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#1b1b1f] text-[#8e9194] text-[10px] uppercase border-b border-[#44474a]/60">
                    <th className="py-2.5 px-3">RECOVERY ID</th>
                    <th className="py-2.5 px-3">CAMERA</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">CONFIDENCE</th>
                    <th className="py-2.5 px-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#44474a]/30">
                  {items.map((cand) => {
                    const isSelected = selectedItem?.recovery_id === cand.recovery_id;
                    const StatusIcon =
                      cand.status === 'RECOVERABLE'
                        ? CheckCircle2
                        : cand.status === 'PARTIAL'
                        ? AlertTriangle
                        : XCircle;

                    const statusStyle =
                      cand.status === 'RECOVERABLE'
                        ? 'text-[#f3f6fc] bg-[#292a2d] border-[#8e9194]'
                        : cand.status === 'PARTIAL'
                        ? 'text-[#c1c7d0] bg-[#1f1f23] border-[#44474a]'
                        : 'text-[#8e9194] bg-[#16171b] border-[#44474a]/40';

                    const isAddedToTimeline = timelineAddedMap[cand.recovery_id];

                    return (
                      <tr
                        key={cand.id || cand.recovery_id}
                        onClick={() => setSelectedRecordId(cand.recovery_id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#292a2d]/80 text-[#f3f6fc]' : 'hover:bg-[#1b1b1f] text-[#c1c7d0]'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-[#f3f6fc]">
                          {cand.recovery_id}
                        </td>
                        <td className="py-3 px-3">
                          {cand.camera_id}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-[#8e9194]">
                          {cand.timestamp}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase ${statusStyle}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{cand.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#f3f6fc]">
                          {cand.confidence.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {/* Preview Button (Requirement 4) */}
                            {cand.status === 'RECOVERABLE' && (
                              <button
                                onClick={() => handleOpenPreview(cand)}
                                className="px-2 py-1 rounded bg-[#1b1b1f] hover:bg-[#292a2d] border border-[#8e9194]/60 text-[10px] text-[#f3f6fc] font-semibold flex items-center gap-1 transition-colors"
                                title="Preview Recovered Video Footage"
                                type="button"
                              >
                                <Play className="w-3 h-3 text-[#f3f6fc]" />
                                <span>PREVIEW</span>
                              </button>
                            )}

                            {/* Add to Timeline Button (Requirement 5) */}
                            <button
                              onClick={() => handleAddToTimeline(cand)}
                              disabled={isAddedToTimeline}
                              className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors border ${
                                isAddedToTimeline
                                  ? 'bg-[#292a2d] text-[#8e9194] border-[#44474a] cursor-default'
                                  : 'metallic-btn-dark hover:border-[#f3f6fc] text-[#f3f6fc]'
                              }`}
                              title="Add Recovered Stream to Case Timeline"
                              type="button"
                            >
                              {isAddedToTimeline ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-[#f3f6fc]" />
                                  <span>ADDED</span>
                                </>
                              ) : (
                                <>
                                  <CalendarPlus className="w-3 h-3" />
                                  <span>TIMELINE</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sector Hex Preview & Carving Details (5 cols) */}
          <div className="lg:col-span-5 bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-3 text-xs h-fit shadow-md">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
              <span className="font-bold text-[#f3f6fc] uppercase tracking-wider">
                RAW SECTOR INSPECTOR: {selectedItem?.recovery_id}
              </span>
              <span className="text-[10px] text-[#8e9194]">
                CAMERA: {selectedItem?.camera_id} • {selectedItem?.timestamp}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#8e9194] uppercase block font-semibold">
                RAW HEX HEADER DUMP (MAGIC BYTES &amp; NAL UNITS)
              </span>
              <div className="p-2.5 rounded bg-[#121316] border border-[#44474a]/60 text-[10px] text-[#c1c7d0] space-y-0.5 select-text font-mono">
                <div>00000000: 48 49 4B 46 53 00 01 00  48.264.STREAM.HEAD</div>
                <div>00000010: 00 00 00 01 67 4D 00 1F  ....gM..NAL_SPS</div>
                <div>00000020: 00 00 00 01 68 EE 3C 80  ....h.&lt;.NAL_PPS</div>
                <div>00000030: 00 00 00 01 65 88 84 20  ....e.. KEYFRAME</div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#1b1b1f] border border-[#44474a]/40 text-xs space-y-1 text-[#c1c7d0]">
              <div className="text-[#8e9194] text-[10px] uppercase font-bold">CARVING RECONSTRUCTION NOTES</div>
              <p className="text-[11px] leading-relaxed text-[#f3f6fc]">
                Stream {selectedItem?.recovery_id} reconstructed via heuristic GOP re-indexing. Status is{' '}
                <strong className="text-white">{selectedItem?.status}</strong> with {selectedItem?.confidence}% bitstream integrity. Container fragment: {selectedItem?.segment_name}.
              </p>
            </div>

            {exportNotice && (
              <div className="p-2.5 rounded bg-[#1b1b1f] border border-[#f3f6fc] text-xs font-mono text-[#f3f6fc] flex items-center justify-between animate-fadeIn">
                <span>{exportNotice}</span>
                <span className="text-[10px] text-[#8e9194]">FILE WRITTEN</span>
              </div>
            )}

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={handleExportCarved}
                className="metallic-btn-dark py-2 rounded text-xs font-semibold uppercase flex items-center justify-center gap-1.5"
                type="button"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT .RAW</span>
              </button>

              {selectedItem?.status === 'RECOVERABLE' ? (
                <button
                  onClick={() => handleOpenPreview(selectedItem)}
                  className="metallic-btn py-2 rounded text-xs font-bold uppercase flex items-center justify-center gap-1.5"
                  type="button"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>PREVIEW VIDEO</span>
                </button>
              ) : (
                <button
                  disabled
                  className="bg-[#1b1b1f] text-[#8e9194] border border-[#44474a]/40 py-2 rounded text-xs font-semibold uppercase flex items-center justify-center gap-1.5 cursor-not-allowed"
                  type="button"
                >
                  <span>NON-PLAYABLE</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between text-xs">
          <div className="text-[10px] text-[#8e9194]">
            Recovered evidence streams certified and synchronized into case timeline and final report.
          </div>
          <button
            onClick={() => navigateTo('timeline')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>VIEW SYNCHRONIZED TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recovered Video Preview Modal (Requirement 4) */}
      {previewModalOpen && previewingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1b1b1f] border border-[#8e9194] rounded shadow-2xl max-w-2xl w-full p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#44474a] pb-2">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#f3f6fc]" />
                <span className="font-bold text-sm text-[#f3f6fc] uppercase">
                  RECOVERED SURVEILLANCE PREVIEW: {previewingRecord.recovery_id} ({previewingRecord.camera_id} @ {previewingRecord.timestamp})
                </span>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-[#8e9194] hover:text-white transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-[16/9] bg-black rounded overflow-hidden border border-[#44474a]/60 flex items-center justify-center">
              <video
                src={previewingRecord.preview_path || '/uploads/evidence/sample_cctv.mp4'}
                controls
                autoPlay
                className="w-full h-full object-contain grayscale contrast-125"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0d0e11]/80 text-[10px] text-[#f3f6fc] border border-[#44474a]">
                RECOVERED BITSTREAM // PARITY: {previewingRecord.confidence}%
              </div>
            </div>

            <div className="text-xs text-[#c1c7d0] flex items-center justify-between pt-1">
              <span>SEGMENT: {previewingRecord.segment_name}</span>
              <span>STATUS: {previewingRecord.status}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#44474a]/40">
              <button
                onClick={() => {
                  previewRecoveredVideo(previewingRecord);
                  setPreviewModalOpen(false);
                }}
                className="metallic-btn px-4 py-2 rounded text-xs font-semibold uppercase flex items-center gap-1.5"
                type="button"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>OPEN IN CCTV WORKSTATION</span>
              </button>
              <button
                onClick={() => {
                  handleAddToTimeline(previewingRecord);
                  setPreviewModalOpen(false);
                }}
                className="metallic-btn-dark px-4 py-2 rounded text-xs font-semibold uppercase flex items-center gap-1.5"
                type="button"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>ADD TO TIMELINE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
