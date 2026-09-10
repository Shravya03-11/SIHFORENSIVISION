import React from 'react';
import { useForensics } from '../../context/ForensicContext';
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Cpu,
  User,
  Car,
  FileSearch,
  FileText,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const InvestigationSummaryScreen: React.FC = () => {
  const {
    activeCase,
    activeEvidence,
    activeVendor,
    analysisResults,
    chainOfCustody,
    correlationData,
    navigateTo,
  } = useForensics();

  return (
    <div className="max-w-5xl mx-auto space-y-4 font-mono select-none">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigateTo('recovery-analysis')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO RECOVERY ANALYSIS</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 12 // INVESTIGATION FINDINGS CONSOLIDATION
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                COMPREHENSIVE FORENSIC INVESTIGATION SUMMARY
              </h1>
              <p className="text-xs text-[#8e9194]">
                Automated judicial dossier pre-flight audit for Case #{activeCase?.case_number}
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded bg-[#0d0e11] border border-[#f3f6fc]/60 text-xs text-[#f3f6fc] font-bold">
            AUDIT: <span className="text-[#f3f6fc]">READY FOR CERTIFICATION</span>
          </div>
        </div>

        {/* 4 Summary Quad Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: Case & Device Identification */}
          <div className="bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-1.5">
              <span className="font-bold text-[#f3f6fc] uppercase">DOCKET &amp; HARDWARE DATA</span>
              <Cpu className="w-3.5 h-3.5 text-[#8e9194]" />
            </div>
            <div className="space-y-1 text-[#c1c7d0] text-[11px]">
              <div>Docket Number: <strong className="text-[#f3f6fc]">#{activeCase?.case_number}</strong></div>
              <div>Title: <span className="text-[#f3f6fc]">{activeCase?.case_name}</span></div>
              <div>Investigator: {activeCase?.investigator}</div>
              <div>Device Profile: {activeVendor.name} ({activeEvidence?.device_model})</div>
              <div>Filesystem: {activeVendor.defaultFilesystem} (Sector Magic: {activeVendor.signatureMagic})</div>
            </div>
          </div>

          {/* Box 2: Cryptographic Integrity */}
          <div className="bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-1.5">
              <span className="font-bold text-[#f3f6fc] uppercase">CRYPTOGRAPHIC SEAL</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#f3f6fc]" />
            </div>
            <div className="space-y-1 text-[#c1c7d0] text-[11px]">
              <div>Integrity Status: <strong className="text-[#f3f6fc]">100% Bitstream Match</strong></div>
              <div>SHA-256: <span className="text-[#8e9194] break-all">{activeEvidence?.sha256.substring(0, 36)}...</span></div>
              <div>MD5: <span className="text-[#8e9194]">{activeEvidence?.md5}</span></div>
              <div>Audit Entries: {chainOfCustody.length} Immutable Chain of Custody Records</div>
              <div>Judicial Standard: NIST SP 800-88 / FRE Rule 902(14) Compliant</div>
            </div>
          </div>
        </div>

        {/* Core Evidentiary Findings (Prompt Highlights) */}
        <div className="bg-[#0d0e11] border border-[#44474a] rounded p-4 space-y-3 text-xs">
          <span className="font-bold text-[#f3f6fc] uppercase tracking-wider block border-b border-[#44474a]/40 pb-2">
            CRITICAL EVIDENTIARY FINDINGS &amp; CORRELATIONS
          </span>

          <div className="space-y-2.5">
            {/* Finding 1: Subject */}
            <div className="p-3 rounded bg-[#1b1b1f] border border-[#44474a]/40 flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#f3f6fc]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[#f3f6fc] font-bold">
                  PRIMARY TARGET IDENTIFIED: {correlationData.subject_id} (94.2% Re-ID Match)
                </div>
                <p className="text-[11px] text-[#c1c7d0] leading-relaxed">
                  Subject tracked sequentially through 5 distinct cameras (CAM-01 Main Gate → CAM-02 Parking → CAM-03 Loading Dock → CAM-04 Corridor → CAM-06 Exit) across a 13-minute duration. Gait anomaly ANOM-02 verified with temporal consistency.
                </p>
              </div>
            </div>

            {/* Finding 2: Vehicle */}
            <div className="p-3 rounded bg-[#1b1b1f] border border-[#44474a]/40 flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4 text-[#f3f6fc]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[#f3f6fc] font-bold">
                  VEHICLE CORRELATED: SEDAN [EX-8820-NY] (89.1% Optical Match)
                </div>
                <p className="text-[11px] text-[#c1c7d0] leading-relaxed">
                  Dark sedan parked in Loading Bay 3 perimeter at 22:38:21 UTC. License plate OCR confirmed against jurisdictional database. Egress timestamp correlated with subject egress at CAM-06.
                </p>
              </div>
            </div>

            {/* Finding 3: Carving */}
            <div className="p-3 rounded bg-[#1b1b1f] border border-[#44474a]/40 flex items-start gap-3">
              <div className="w-7 h-7 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center shrink-0">
                <FileSearch className="w-4 h-4 text-[#f3f6fc]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[#f3f6fc] font-bold">
                  DELETED VIDEO CARVED: REC-001 (Camera 03, 98.6% Parity)
                </div>
                <p className="text-[11px] text-[#c1c7d0] leading-relaxed">
                  Identified 1 unallocated cluster containing deleted surveillance stream for Camera 03 (22:18:41 UTC), recovering footage deliberately cleared prior to manual system shutdown.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA: Generate Official Report */}
        <div className="pt-3 border-t border-[#44474a]/40 flex items-center justify-between">
          <div className="text-[10px] text-[#8e9194]">
            Summary compiled from cryptographic working ledger.
          </div>
          <button
            onClick={() => navigateTo('forensic-report')}
            className="metallic-btn px-6 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>GENERATE OFFICIAL FORENSIC REPORT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
