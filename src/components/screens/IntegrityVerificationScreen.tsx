import React, { useState, useEffect } from 'react';
import { useForensics } from '../../context/ForensicContext';
import { Forensic3DScanner } from '../Forensic3DScanner';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Loader2,
  Clock,
  User,
  FileCheck,
  Binary,
} from 'lucide-react';

export const IntegrityVerificationScreen: React.FC = () => {
  const {
    activeEvidence,
    chainOfCustody,
    verifyEvidenceIntegrity,
    isProcessing,
    processingStage,
    navigateTo,
  } = useForensics();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [justVerified, setJustVerified] = useState(false);
  const [cyclingHex, setCyclingHex] = useState('7f9a2b8e3c1d4a0f');

  // Simulated live hash cycling during calculation
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        const hex = Array.from({ length: 16 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        setCyclingHex(hex);
      }, 80);
    } else {
      setJustVerified(true);
      const timer = setTimeout(() => setJustVerified(false), 2000);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between font-mono text-xs">
        <button
          onClick={() => navigateTo('forensic-acquisition')}
          className="flex items-center gap-1.5 text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO ACQUISITION</span>
        </button>
        <span className="text-[10px] text-[#c1c7d0] uppercase">
          STAGE 06 // CRYPTOGRAPHIC INTEGRITY &amp; PROVENANCE LEDGER
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border space-y-6">
        <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#f3f6fc]" />
            </div>
            <div>
              <h1 className="font-mono text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
                CRYPTOGRAPHIC INTEGRITY &amp; HASH VERIFICATION VAULT
              </h1>
              <p className="font-mono text-xs text-[#8e9194]">
                FIPS 140-3 &amp; NIST SP 800-88 compliant digital bitstream validation
              </p>
            </div>
          </div>

          {/* Glowing Status Badge with Brief Silver Pulse on Verification */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded bg-[#0d0e11] border transition-all duration-300 ${
              isProcessing
                ? 'border-[#8e9194] text-[#c1c7d0]'
                : justVerified
                ? 'border-[#f3f6fc] text-[#f3f6fc] animate-silver-pulse shadow-[0_0_16px_rgba(243,246,252,0.3)]'
                : 'border-[#f3f6fc]/60 text-[#f3f6fc] shadow-[0_0_10px_rgba(243,246,252,0.1)]'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 text-[#8e9194] animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#f3f6fc] animate-pulse-once" />
            )}
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {isProcessing ? 'COMPUTING PARITY...' : 'INTEGRITY VERIFIED'}
            </span>
          </div>
        </div>

        {/* 3D Scanning Visualization during processing */}
        {isProcessing && (
          <div className="animate-page-enter">
            <Forensic3DScanner
              isProcessing={true}
              stage={`CALCULATING HASH BLOCKS... [SEED: 0x${cyclingHex}]`}
            />
          </div>
        )}

        {/* Cryptographic Hashes Primary Display */}
        <div className="bg-[#0d0e11] border border-[#44474a] rounded p-5 space-y-4 font-mono forensic-card-depth">
          <div className="flex items-center justify-between border-b border-[#44474a]/40 pb-2">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-[#c1c7d0]" />
              <span className="text-xs uppercase font-bold text-[#f3f6fc]">
                CRYPTOGRAPHIC FINGERPRINT RECONCILIATION
              </span>
            </div>
            <button
              onClick={() => verifyEvidenceIntegrity()}
              disabled={isProcessing}
              className="flex items-center gap-1.5 text-[11px] text-[#c1c7d0] hover:text-[#f3f6fc] transition-colors metallic-btn px-2.5 py-1 rounded"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>RE-AUDIT BITSTREAM PARITY</span>
            </button>
          </div>

          {/* SHA-256 Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9194] font-semibold">SHA-256 MASTER EVIDENCE HASH:</span>
              <button
                onClick={() => copyToClipboard(activeEvidence?.sha256 || '', 'sha256')}
                className="flex items-center gap-1 text-[11px] text-[#c1c7d0] hover:text-white"
              >
                {copiedField === 'sha256' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#f3f6fc]" />
                    <span className="text-[#f3f6fc]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY HASH</span>
                  </>
                )}
              </button>
            </div>
            <div className={`p-3 rounded bg-[#1b1b1f] border text-[#f3f6fc] text-xs break-all leading-relaxed font-bold shadow-inner transition-all duration-300 ${
              isProcessing
                ? 'border-[#8e9194] animate-pulse'
                : 'border-[#8e9194]/40'
            }`}>
              {isProcessing ? (
                <span className="text-[#c1c7d0] font-mono tracking-wider">
                  0x{cyclingHex}d9e72b4f8c1a5e3... [STREAMING BITSTREAM]
                </span>
              ) : (
                activeEvidence?.sha256
              )}
            </div>
          </div>

          {/* MD5 Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e9194] font-semibold">MD5 BITSTREAM CHECKSUM:</span>
              <button
                onClick={() => copyToClipboard(activeEvidence?.md5 || '', 'md5')}
                className="flex items-center gap-1 text-[11px] text-[#c1c7d0] hover:text-white"
              >
                {copiedField === 'md5' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#f3f6fc]" />
                    <span className="text-[#f3f6fc]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY HASH</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded bg-[#1b1b1f] border border-[#44474a]/60 text-[#c1c7d0] text-xs font-semibold">
              {activeEvidence?.md5}
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-[11px]">
            <div className="bg-[#1b1b1f] p-2.5 rounded">
              <span className="text-[#8e9194] text-[9px] uppercase block">PARITY ACCURACY</span>
              <span className="text-[#f3f6fc] font-bold text-sm">100.0000%</span>
              <span className="text-[9px] text-[#8e9194]">Zero byte drift</span>
            </div>
            <div className="bg-[#1b1b1f] p-2.5 rounded">
              <span className="text-[#8e9194] text-[9px] uppercase block">HMAC SIGNATURE</span>
              <span className="text-[#c1c7d0] font-bold text-xs truncate block">7c9f81a4b92d...</span>
              <span className="text-[9px] text-[#8e9194]">SHA256-HMAC Keyed</span>
            </div>
            <div className="bg-[#1b1b1f] p-2.5 rounded">
              <span className="text-[#8e9194] text-[9px] uppercase block">BLOCK ANCHOR</span>
              <span className="text-[#c1c7d0] font-bold text-xs">#ETH-FED-99210</span>
              <span className="text-[9px] text-[#8e9194]">Ledger sealed</span>
            </div>
            <div className="bg-[#1b1b1f] p-2.5 rounded">
              <span className="text-[#8e9194] text-[9px] uppercase block">JUDICIAL STATUS</span>
              <span className="text-[#f3f6fc] font-bold text-xs">RULE 902(14)</span>
              <span className="text-[9px] text-[#8e9194]">Court-Admissible</span>
            </div>
          </div>
        </div>

        {/* Chain of Custody Immutable Provenance Table */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#f3f6fc]" />
              <span className="text-xs uppercase font-bold text-[#f3f6fc]">
                CHAIN OF CUSTODY IMMUTABLE AUDIT LOG
              </span>
            </div>
            <span className="text-[10px] text-[#8e9194]">{chainOfCustody.length} AUDIT ENTRIES</span>
          </div>

          <div className="overflow-x-auto border border-[#44474a] rounded bg-[#0d0e11]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1b1b1f] text-[#8e9194] text-[10px] uppercase border-b border-[#44474a]/60">
                  <th className="py-2.5 px-3">TIMESTAMP (UTC)</th>
                  <th className="py-2.5 px-3">EVIDENTIARY ACTION</th>
                  <th className="py-2.5 px-3">OFFICER / AGENT</th>
                  <th className="py-2.5 px-3">ROLE &amp; DETAILS</th>
                  <th className="py-2.5 px-3 text-right">HASH SEAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#44474a]/30">
                {chainOfCustody.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#1b1b1f] transition-colors">
                    <td className="py-2.5 px-3 text-[#8e9194] text-[11px] whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-2.5 px-3 text-[#f3f6fc] font-semibold">
                      {entry.action}
                    </td>
                    <td className="py-2.5 px-3 text-[#c1c7d0]">
                      {entry.user}
                    </td>
                    <td className="py-2.5 px-3 text-[#8e9194] text-[10px]">
                      <div>{entry.role}</div>
                      <div className="text-[9px] text-[#c1c7d0] truncate max-w-xs">{entry.notes}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#f3f6fc] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-[#f3f6fc]" />
                        <span>MATCH</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#44474a]/40 flex items-center justify-between">
          <div className="font-mono text-[10px] text-[#8e9194]">
            Chain of custody bitstream seal locked with judicial timestamp token.
          </div>
          <button
            onClick={() => navigateTo('video-analysis')}
            className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>ENTER VIDEO ANALYSIS WORKSTATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
