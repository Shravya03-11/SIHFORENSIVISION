import React, { useState } from 'react';
import { useForensics } from '../../context/ForensicContext';
import { FolderPlus, Shield, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CreateCaseScreen: React.FC = () => {
  const { createCase, navigateTo, currentUser, errorMessage, clearMessages } = useForensics();

  const [caseName, setCaseName] = useState('');
  const [caseNumber, setCaseNumber] = useState(
    `FV-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
  );
  const [investigator, setInvestigator] = useState(
    currentUser?.name || 'Investigator M. Vance, D-ABFDE',
  );
  const [evidenceSource, setEvidenceSource] = useState(
    'Hikvision DS-7732NI-I4 NVR Internal HDD (4TB SATA)',
  );
  const [location, setLocation] = useState('Metro North Distribution Center, Sector 4');
  const [incidentDate, setIncidentDate] = useState('2026-08-14 22:30:00 UTC');
  const [description, setDescription] = useState(
    'CCTV surveillance bitstream recovery following reported unauthorized intrusion and freight inventory deviation. Physical drive extracted with write-blocker isolation.',
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCase({
        case_name: caseName,
        case_number: caseNumber,
        investigator,
        evidence_source: evidenceSource,
        location,
        incident_date: incidentDate,
        description,
      });
      // Prompt says: After creation: -> Evidence Acquisition (or Upload)
      navigateTo('evidence-upload');
    } catch (err) {
      // Handled in context
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-1.5 text-xs font-mono text-[#8e9194] hover:text-[#f3f6fc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO DASHBOARD</span>
        </button>
        <span className="font-mono text-[10px] text-[#c1c7d0] uppercase">
          STAGE 02 // DOCKET CREATION
        </span>
      </div>

      <div className="bg-[#1b1b1f] border border-[#44474a]/60 rounded p-6 shadow-xl metallic-border">
        <div className="flex items-center gap-3 border-b border-[#44474a]/40 pb-4 mb-5">
          <div className="w-10 h-10 rounded bg-[#0d0e11] border border-[#8e9194]/40 flex items-center justify-center">
            <FolderPlus className="w-5 h-5 text-[#f3f6fc]" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold text-[#f3f6fc] uppercase tracking-wider">
              ESTABLISH NEW INVESTIGATION DOCKET
            </h1>
            <p className="font-mono text-xs text-[#8e9194]">
              Mandatory judicial evidentiary metadata and chain of custody initiation
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-[#292a2d] border border-[#8e9194] text-[#f3f6fc] text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
                CASE IDENTIFIER (DOCKET NUMBER) *
              </label>
              <input
                type="text"
                required
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
                placeholder="e.g. FV-2026-002"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
                INVESTIGATION NAME *
              </label>
              <input
                type="text"
                required
                value={caseName}
                onChange={(e) => {
                  clearMessages();
                  setCaseName(e.target.value);
                }}
                className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
                placeholder="e.g. Warehouse Theft Investigation"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
                LEAD FORENSIC INVESTIGATOR
              </label>
              <input
                type="text"
                required
                value={investigator}
                onChange={(e) => setInvestigator(e.target.value)}
                className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
                PHYSICAL EVIDENCE SOURCE
              </label>
              <input
                type="text"
                required
                value={evidenceSource}
                onChange={(e) => setEvidenceSource(e.target.value)}
                className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
                placeholder="e.g. Hikvision NVR DS-7732 / 4TB SATA HDD"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
                INCIDENT GEOGRAPHIC LOCATION
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
                placeholder="e.g. Metro North Distribution Center, Sector 4"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
                INCIDENT DATE &amp; TIMECODE (UTC)
              </label>
              <input
                type="text"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
                placeholder="YYYY-MM-DD HH:MM:SS UTC"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#8e9194] mb-1 font-semibold">
              EVIDENTIARY DESCRIPTION &amp; SCOPE
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0d0e11] border border-[#44474a] rounded px-3 py-2 text-[#f3f6fc] focus:outline-none focus:border-[#e2e5ea]"
              placeholder="Detail the circumstances of recovery and recording scope..."
            ></textarea>
          </div>

          <div className="pt-3 border-t border-[#44474a]/40 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setCaseName('Warehouse Theft Investigation');
                setCaseNumber('FV-2026-001');
                setLocation('Metro North Distribution Center, Sector 4');
              }}
              className="text-[#8e9194] hover:text-[#f3f6fc] text-[11px] underline"
            >
              Fill Sample Case Details (FV-2026-001)
            </button>

            <button
              type="submit"
              className="metallic-btn px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <span>CREATE CASE &amp; PROCEED TO EVIDENCE INGESTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
