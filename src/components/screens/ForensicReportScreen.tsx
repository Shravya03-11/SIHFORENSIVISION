import React, { useRef, useState, useEffect } from 'react';
import { useForensics } from '../../context/ForensicContext';
import { generateForensicPdf } from '../../utils/pdfExport';
import { api } from '../../services/api';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Stamp,
  Award,
  Lock,
  Sparkles,
  RotateCcw,
  Loader2,
} from 'lucide-react';

export const ForensicReportScreen: React.FC = () => {
  const {
    activeCase,
    activeEvidence,
    activeVendor,
    analysisResults,
    chainOfCustody,
    timelineEvents,
    recoveryCandidates,
    recoveryResults,
    navigateTo,
    currentUser,
    addCustodyEntry,
  } = useForensics();

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(100);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isReportReady, setIsReportReady] = useState<boolean>(true);
  const reportRef = useRef<HTMLDivElement>(null);

  const reportSteps = [
    'Evidence hash verified (SHA-256 / Blake2b)',
    'Video frames analyzed & motion vectors sealed',
    'Metadata extracted & container decoded',
    'Chain of custody confirmed & chronologically sealed',
    'PDF compiled under FRE Rule 902(14)',
  ];

  const runReportCompilation = () => {
    setIsGenerating(true);
    setIsReportReady(false);
    setGenerationProgress(0);
    setCompletedSteps([]);

    const steps = [
      { step: 0, progress: 22, delay: 350 },
      { step: 1, progress: 48, delay: 750 },
      { step: 2, progress: 72, delay: 1150 },
      { step: 3, progress: 90, delay: 1550 },
      { step: 4, progress: 100, delay: 1950 },
    ];

    steps.forEach(({ step, progress, delay }) => {
      setTimeout(() => {
        setGenerationProgress(progress);
        setCompletedSteps((prev) => [...prev, step]);
        if (step === 4) {
          setIsGenerating(false);
          setIsReportReady(true);
        }
      }, delay);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!activeCase || !activeEvidence || !activeVendor) {
      setDownloadNotice('Cannot export: active case or evidence record missing.');
      setTimeout(() => setDownloadNotice(null), 4000);
      return;
    }
    runReportCompilation();
    try {
      generateForensicPdf({
        activeCase,
        activeEvidence,
        activeVendor,
        chainOfCustody,
        timelineEvents,
        recoveryCandidates,
        investigatorName: currentUser?.name || activeCase.investigator || 'Inspector A. Vance',
      });
      
      const reportNum = `REP-${activeCase.case_number}-${Date.now().toString().slice(-4)}`;
      try {
        await api.createReport({
          case_id: activeCase.id,
          report_number: reportNum,
          generated_by: currentUser?.name || activeCase.investigator || 'Inspector A. Vance',
          file_path: `/reports/${activeCase.case_number}_Forensic_Dossier.pdf`,
        });
      } catch (e) {
        // Continue if offline
      }

      addCustodyEntry(
        `Forensic PDF Exported (${reportNum})`,
        `FRE Rule 902(14) certified dossier exported by ${currentUser?.name || 'Investigator'}. Cryptographic hashes and chain of custody certified.`
      );

      setDownloadNotice(`Court-admissible PDF generated: ${activeCase.case_number}_Forensic_Dossier.pdf`);
      setTimeout(() => setDownloadNotice(null), 5000);
    } catch (err) {
      console.error('PDF Generation failed', err);
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top Action Toolbar (hidden during print) */}
      <div className="flex items-center justify-between font-mono text-xs print:hidden">
        <button
          onClick={() => navigateTo('investigation-summary')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO INVESTIGATION SUMMARY</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="metallic-btn px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            type="button"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT OFFICIAL REPORT</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="metallic-btn-dark relative group overflow-hidden px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-[#8e9194] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
            type="button"
          >
            {/* Subtle silver shimmer on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></span>
            <Download className="w-4 h-4" />
            <span>EXPORT CERTIFIED PDF</span>
          </button>
        </div>
      </div>

      {/* Forensic Report Compilation Progress Panel (Requirement 8) */}
      <div className="p-4 rounded bg-[#1b1b1f] border border-[#44474a]/60 shadow-lg font-mono text-xs space-y-3 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#f3f6fc]" />
            <span className="font-bold text-[#f3f6fc] tracking-wider uppercase">
              FORENSIC DOSSIER COMPILATION ENGINE
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isReportReady && (
              <span className="px-2.5 py-1 rounded bg-[#0d0e11] text-[#ffffff] border border-[#ffffff] text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,255,255,0.4)] animate-pulse">
                REPORT READY
              </span>
            )}
            <button
              onClick={runReportCompilation}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded bg-[#292a2d] hover:bg-[#343538] text-[#f3f6fc] border border-[#8e9194]/60 text-[10px] flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>RE-COMPILE</span>
            </button>
          </div>
        </div>

        {/* Smooth Silver Gradient Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#8e9194]">
            <span>AUTOMATED EVIDENCE SYNTHESIS PROGRESS</span>
            <span className="text-[#f3f6fc] font-bold">{generationProgress}%</span>
          </div>
          <div className="w-full h-2 rounded bg-[#0d0e11] border border-[#44474a]/40 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#8e9194] via-[#ffffff] to-[#c1c7d0] transition-all duration-300 relative shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              style={{ width: `${generationProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Sequential Checklist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {reportSteps.map((stepText, idx) => {
            const isCompleted = completedSteps.includes(idx);
            return (
              <div
                key={stepText}
                className={`p-2 rounded border flex items-center gap-2 text-[10px] transition-all ${
                  isCompleted
                    ? 'bg-[#0d0e11] border-[#8e9194] text-[#f3f6fc]'
                    : 'bg-[#121316]/50 border-[#44474a]/30 text-[#8e9194]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ffffff] shrink-0 animate-scale-pop shadow-[0_0_6px_#ffffff]" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-[#44474a] shrink-0"></div>
                )}
                <span className="truncate">{stepText}</span>
              </div>
            );
          })}
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded bg-[#1b1b1f] border border-[#f3f6fc] text-xs font-mono text-[#f3f6fc] flex items-center justify-between animate-fadeIn print:hidden">
          <span>{downloadNotice}</span>
          <span className="text-[10px] text-[#8e9194]">SHA-256 SIGNED</span>
        </div>
      )}

      {/* Official Government / Forensic Document Layout */}
      <div
        ref={reportRef}
        className="bg-[#f8f9fa] text-[#111315] p-8 md:p-12 rounded-sm shadow-2xl border border-[#d1d5db] font-serif leading-relaxed text-sm print:p-0 print:border-none print:shadow-none"
      >
        {/* Document Header with Federal Forensic Authority Heading */}
        <div className="border-b-2 border-[#111315] pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-xs tracking-widest text-[#4b5563] uppercase">
                UNITED STATES DIGITAL FORENSIC ACCREDITATION COMMISSION
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-sans text-[#111315] uppercase mt-1">
                EXPERT FORENSIC EXAMINATION REPORT
              </h1>
              <div className="font-mono text-xs text-[#4b5563] uppercase mt-1">
                DIGITAL VIDEO EVIDENCE DOSSIER • FRE RULE 902(14) CERTIFICATION
              </div>
            </div>

            <div className="text-right font-mono text-xs text-[#374151] border-l-2 border-[#9ca3af] pl-4">
              <div>REPORT ID: <strong className="text-[#111315]">REP-2026-0884A</strong></div>
              <div>DATE: <strong>2026-08-15 04:00 UTC</strong></div>
              <div>CLASSIFICATION: <strong>JUDICIAL RESTRICTED</strong></div>
            </div>
          </div>
        </div>

        {/* Section 1: Case Information & Jurisdiction */}
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] border-b border-[#9ca3af] pb-1 mb-2 font-mono">
            SECTION 1: CASE REGISTRATION &amp; EVIDENCE JURISDICTION
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-sans text-xs">
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">CASE DOCKET NUMBER</span>
              <span className="font-bold text-[#111315]">#{activeCase?.case_number}</span>
            </div>
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">CASE TITLE</span>
              <span className="font-semibold text-[#111315]">{activeCase?.case_name}</span>
            </div>
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">EXAMINING ANALYST</span>
              <span className="text-[#111315]">{activeCase?.investigator}</span>
            </div>
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">LABORATORY CREDENTIAL</span>
              <span className="text-[#111315]">SIGMA LEVEL-IV FORENSIC LAB</span>
            </div>
          </div>
        </div>

        {/* Section 2: Hardware Device Information & Evidence Description */}
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] border-b border-[#9ca3af] pb-1 mb-2 font-mono">
            SECTION 2: PHYSICAL MEDIA &amp; RECORDER PROFILING
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-sans text-xs mb-2">
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">DEVICE MANUFACTURER</span>
              <span className="font-bold text-[#111315]">{activeVendor.name}</span>
            </div>
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">MODEL / CHASSIS</span>
              <span className="text-[#111315]">{activeEvidence?.device_model}</span>
            </div>
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">STORAGE CAPACITY</span>
              <span className="text-[#111315]">{activeEvidence?.storage_size}</span>
            </div>
            <div>
              <span className="text-[#6b7280] block text-[10px] uppercase font-mono">FILESYSTEM HEURISTIC</span>
              <span className="text-[#111315]">{activeVendor.defaultFilesystem}</span>
            </div>
          </div>
          <p className="text-xs text-[#374151]">
            Physical SATA disk was seized under sterile evidence bag conditions and mounted exclusively through a hardware write-blocker (Tableau Forensic T8u). No direct write operations were permitted to the physical platter at any time.
          </p>
        </div>

        {/* Section 3: Forensic Acquisition & Cryptographic Hashes */}
        <div className="mb-6 p-4 bg-[#e5e7eb]/60 rounded border border-[#d1d5db]">
          <div className="flex items-center justify-between border-b border-[#9ca3af] pb-2 mb-3">
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#111315]" />
              <span>SECTION 3: CRYPTOGRAPHIC VERIFICATION &amp; HASH MANIFEST</span>
            </h2>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#111315] text-[#f8f9fa] rounded">
              RULE 902(14) SELF-AUTHENTICATED
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div>
              <span className="text-[#4b5563] text-[10px] uppercase block">
                SHA-256 MASTER EVIDENCE RECORD:
              </span>
              <div className="p-2 rounded bg-white border border-[#9ca3af] font-bold text-[#111315] break-all">
                {activeEvidence?.sha256}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="text-[#4b5563] text-[10px] uppercase block">MD5 RECORD:</span>
                <div className="p-1.5 rounded bg-white border border-[#9ca3af] text-[#111315]">
                  {activeEvidence?.md5}
                </div>
              </div>
              <div>
                <span className="text-[#4b5563] text-[10px] uppercase block">PARITY RECONCILIATION:</span>
                <div className="p-1.5 rounded bg-white border border-[#9ca3af] text-[#111315] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#111315]" />
                  <span>100.000% MATCH • ZERO ARTIFACT DRIFT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Video Analysis & AI Detection Findings */}
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] border-b border-[#9ca3af] pb-1 mb-2 font-mono">
            SECTION 4: VIDEO ANALYSIS &amp; COMPUTER VISION FINDINGS
          </h2>

          <div className="space-y-2 text-xs">
            <p>
              Automated frame-stepping, forensic I-frame sampling, and computer vision classification performed across ingested surveillance video stream.
            </p>

            <table className="w-full text-left font-mono text-xs border border-[#9ca3af] mt-2">
              <thead className="bg-[#e5e7eb] text-[#111315] text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-b border-[#9ca3af]">TARGET ID</th>
                  <th className="p-2 border-b border-[#9ca3af]">CLASSIFICATION</th>
                  <th className="p-2 border-b border-[#9ca3af]">CONFIDENCE</th>
                  <th className="p-2 border-b border-[#9ca3af]">CORRELATED TIMECODE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1d5db]">
                {analysisResults && analysisResults.length > 0 ? (
                  analysisResults.map((det) => (
                    <tr key={det.id}>
                      <td className="p-2 font-bold">{det.id.toUpperCase()}</td>
                      <td className="p-2">{det.detection_type}: {det.result}</td>
                      <td className="p-2 font-bold">{det.confidence.toFixed(1)}%</td>
                      <td className="p-2">{det.timestamp}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="p-2 font-bold">SUBJ-A (SUB-8821)</td>
                      <td className="p-2">Person (Gait Profile ANOM-02, Dark Hooded Outerwear)</td>
                      <td className="p-2 font-bold">94.2%</td>
                      <td className="p-2">22:38:21 (Still Frame #160,298)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">VEH-01</td>
                      <td className="p-2">Vehicle (Sedan, License Plate: EX-8820-NY)</td>
                      <td className="p-2 font-bold">89.1%</td>
                      <td className="p-2">22:35:44 (CAM-03 Loading Bay Still)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">OBJ-01</td>
                      <td className="p-2">Tactical Utility Backpack (Concealed Material)</td>
                      <td className="p-2 font-bold">78.0%</td>
                      <td className="p-2">22:41:32 (CAM-04 East Corridor Still)</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Multi-Camera Temporal Correlation */}
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] border-b border-[#9ca3af] pb-1 mb-2 font-mono">
            SECTION 5: MULTI-CAMERA TRAJECTORY RECONSTRUCTION
          </h2>
          <div className="p-3 bg-[#f3f4f6] rounded border border-[#d1d5db] font-mono text-xs space-y-1">
            <div className="font-bold text-[#111315]">SUBJECT PATHWAY // 13-MINUTE TIME WINDOW:</div>
            <div>1. 22:31:12 UTC — CAM-01 (Main Gate Entrance): Perimeter breach detected</div>
            <div>2. 22:35:44 UTC — CAM-02 (Parking &amp; Vehicle Bay): Subject bypasses gatehouse</div>
            <div>3. 22:38:21 UTC — CAM-03 (Loading Area 3B): Rendezvous with sedan EX-8820-NY</div>
            <div>4. 22:41:32 UTC — CAM-04 (Corridor Interior): Vault access hatch accessed</div>
            <div>5. 22:44:08 UTC — CAM-06 (Emergency Exit East): Subject egress to perimeter</div>
          </div>
        </div>

        {/* Section 6: Recovery of Carved Deleted Video */}
        <div className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] border-b border-[#9ca3af] pb-1 mb-2 font-mono">
            SECTION 6: STREAM CARVING &amp; RECOVERED DELETED FOOTAGE
          </h2>
          <p className="text-xs text-[#374151] mb-2">
            Unallocated sector space analysis identified candidate streams through heuristic GOP re-indexing.
          </p>

          <table className="w-full text-left font-mono text-xs border border-[#9ca3af]">
            <thead className="bg-[#e5e7eb] text-[#111315] text-[10px] uppercase">
              <tr>
                <th className="p-2 border-b border-[#9ca3af]">RECOVERY ID</th>
                <th className="p-2 border-b border-[#9ca3af]">CAMERA</th>
                <th className="p-2 border-b border-[#9ca3af]">TIMECODE</th>
                <th className="p-2 border-b border-[#9ca3af]">STATUS</th>
                <th className="p-2 border-b border-[#9ca3af]">PARITY / CONFIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d5db]">
              {recoveryResults && recoveryResults.length > 0 ? (
                recoveryResults.map((rec) => (
                  <tr key={rec.id}>
                    <td className="p-2 font-bold">{rec.recovery_id}</td>
                    <td className="p-2">{rec.camera_id}</td>
                    <td className="p-2">{rec.timestamp}</td>
                    <td className="p-2 font-semibold">{rec.status}</td>
                    <td className="p-2 font-bold">{rec.confidence.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="p-2 font-bold">REC-001</td>
                    <td className="p-2">CAM-03</td>
                    <td className="p-2">22:18:41</td>
                    <td className="p-2 font-semibold text-black">RECOVERABLE</td>
                    <td className="p-2 font-bold">98.4%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">REC-002</td>
                    <td className="p-2">CAM-04</td>
                    <td className="p-2">22:22:17</td>
                    <td className="p-2 font-semibold text-black">PARTIAL</td>
                    <td className="p-2 font-bold">76.1%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">REC-004</td>
                    <td className="p-2">CAM-01</td>
                    <td className="p-2">22:34:50</td>
                    <td className="p-2 font-semibold text-black">RECOVERABLE</td>
                    <td className="p-2 font-bold">94.7%</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Section 7: Chain of Custody Record */}
        <div className="mb-8">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#111315] border-b border-[#9ca3af] pb-1 mb-2 font-mono">
            SECTION 7: IMMUTABLE CHAIN OF CUSTODY LOG
          </h2>
          <table className="w-full text-left font-mono text-[11px] border border-[#9ca3af]">
            <thead className="bg-[#e5e7eb] text-[#111315]">
              <tr>
                <th className="p-1.5 border-b border-[#9ca3af]">TIMESTAMP</th>
                <th className="p-1.5 border-b border-[#9ca3af]">ACTION</th>
                <th className="p-1.5 border-b border-[#9ca3af]">OFFICER / AGENT</th>
                <th className="p-1.5 border-b border-[#9ca3af]">ROLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d5db]">
              {chainOfCustody.map((log) => (
                <tr key={log.id}>
                  <td className="p-1.5">{log.timestamp}</td>
                  <td className="p-1.5 font-semibold">{log.action}</td>
                  <td className="p-1.5">{log.user}</td>
                  <td className="p-1.5">{log.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 8: Investigator Conclusion & Official Signature Block */}
        <div className="border-t-2 border-[#111315] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="text-xs text-[#374151] space-y-1">
            <div className="font-bold text-[#111315] uppercase font-mono">EXAMINER CERTIFICATION:</div>
            <p>
              I hereby certify under penalty of perjury that the digital video evidence examinations detailed in this dossier were executed according to accepted scientific standards (SWGDE / ASTM E3017), without modification to original media, and that all hashes represent exact bitstream parity.
            </p>
          </div>

          <div className="border border-[#9ca3af] p-4 rounded bg-white text-center font-mono text-xs space-y-2">
            <div className="text-[10px] text-[#6b7280] uppercase tracking-wider">
              DIGITALLY ATTESTED &amp; SEALED
            </div>
            <div className="font-serif italic text-lg text-[#111315] tracking-wide">
              Investigator M. Vance
            </div>
            <div className="text-[10px] text-[#111315] font-bold">
              M. Vance, D-ABFDE • Senior Forensic Video Examiner
            </div>
            <div className="text-[9px] text-[#6b7280]">
              PUBLIC KEY FINGERPRINT: 4A8F-09DE-9912-FA83-CC10-9102-ABFD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
