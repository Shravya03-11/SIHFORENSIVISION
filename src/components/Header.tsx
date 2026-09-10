import React, { useState } from 'react';
import { useForensics } from '../context/ForensicContext';
import { ScreenId } from '../types';
import { Forensic3DLogo } from './Forensic3DLogo';
import { ProfileModal } from './modals/ProfileModal';
import { SettingsModal } from './modals/SettingsModal';
import {
  Shield,
  FileText,
  RotateCcw,
  User,
  ChevronDown,
  Lock,
  Compass,
  Menu,
  X,
  Settings,
  LogOut,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeCase,
    activeEvidence,
    currentUser,
    currentScreen,
    navigateTo,
    resetDemoData,
    sidebarExpanded,
    toggleSidebar,
    logout,
  } = useForensics();

  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const workflowSteps: { id: ScreenId; label: string; stage: string }[] = [
    { id: 'dashboard', label: '1. Operations Dashboard', stage: 'Overview' },
    { id: 'create-case', label: '2. Create Investigation Docket', stage: 'Case Setup' },
    { id: 'evidence-upload', label: '3. Evidence File Ingestion', stage: 'Upload' },
    { id: 'device-identification', label: '4. DVR/NVR Device Profile', stage: 'Vendor ID' },
    { id: 'forensic-acquisition', label: '5. Bitstream Acquisition', stage: 'Working Copy' },
    { id: 'integrity-verification', label: '6. Cryptographic Integrity', stage: 'MD5 / SHA-256' },
    { id: 'video-analysis', label: '7. CCTV Video Workstation', stage: 'Surveillance' },
    { id: 'ai-detection', label: '8. AI Detection Layer', stage: 'Object/Person' },
    { id: 'timeline', label: '9. Synchronized Timeline', stage: 'Matrix' },
    { id: 'multi-camera', label: '10. Multi-Camera Correlation', stage: 'Subject Tracking' },
    { id: 'recovery-analysis', label: '11. Stream Carving & Recovery', stage: 'Deleted Sectors' },
    { id: 'investigation-summary', label: '12. Investigation Summary', stage: 'Triage Dossier' },
    { id: 'forensic-report', label: '13. Official Forensic Report', stage: 'Court Export' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0d0e11] border-b border-[#44474a]/60 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="h-16 w-full px-4 flex items-center justify-between gap-3">
        {/* Brand & System Title & Collapsible Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger / Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded bg-[#1f1f23] hover:bg-[#292a2d] border border-[#44474a] text-[#f3f6fc] hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95 group"
            title={sidebarExpanded ? "Collapse Forensic Modules (Ctrl+B)" : "Expand Forensic Modules (Ctrl+B)"}
            aria-label="Toggle forensic modules menu"
          >
            {sidebarExpanded ? (
              <X className="w-4 h-4 text-[#f3f6fc]" />
            ) : (
              <Menu className="w-4 h-4 text-[#f3f6fc] group-hover:text-white" />
            )}
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="focus:outline-none"
            title="Return to Dashboard"
          >
            <Forensic3DLogo />
          </button>

          <div className="h-6 w-px bg-[#44474a]/60"></div>

          {/* Level IV Classification Badge */}
          <div className="hidden xl:flex items-center px-2 py-0.5 rounded bg-[#1b1b1f] border border-[#44474a]/80">
            <span className="font-mono text-[10px] text-[#c1c7d0] uppercase font-semibold tracking-wider">
              RESTRICTED ACCESS // LEVEL-IV FORENSIC LAB
            </span>
          </div>

          {/* Case Reference Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1b1b1f] border border-[#44474a]/60">
            <span className="font-mono text-[10px] text-[#8e9194] uppercase font-semibold">CASE:</span>
            <span className="font-mono text-[12px] text-[#f3f6fc] font-semibold tracking-tight">
              #{activeCase?.case_number || 'FS-2026-001'}
            </span>
            <span className="text-[11px] text-[#c4c7ca] truncate max-w-[140px]">
              ({activeCase?.case_name || 'Warehouse Theft'})
            </span>
          </div>
        </div>

        {/* System Telemetry & Status Badges */}
        <div className="hidden 2xl:flex items-center gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0d0e11] border border-[#44474a]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3f6fc] animate-pulse"></span>
            <span className="text-[#c1c7d0] uppercase font-semibold">SHA-256 HASH VERIFIED</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0d0e11] border border-[#44474a]/60">
            <span className="text-[#8e9194] uppercase">LATENCY:</span>
            <span className="text-[#f3f6fc] font-medium">1.2ms</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0d0e11] border border-[#44474a]/60">
            <span className="text-[#8e9194] uppercase">SRV:</span>
            <span className="text-[#f3f6fc] font-medium">APEX-SEC-01</span>
          </div>
        </div>

        {/* Actions, Rapid Workflow Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick SIH Workflow Navigator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setWorkflowOpen(!workflowOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1f1f23] hover:bg-[#292a2d] border border-[#44474a] text-[#e3e2e6] text-[11px] font-mono font-medium transition-colors"
              title="Navigate directly through SIH Evaluation workflow"
            >
              <Compass className="w-3.5 h-3.5 text-[#f3f6fc]" />
              <span className="hidden sm:inline">WORKFLOW STAGES</span>
              <ChevronDown className="w-3 h-3 text-[#8e9194]" />
            </button>

            {workflowOpen && (
              <div
                className="absolute right-0 mt-1 w-72 bg-[#121316] border border-[#8e9194]/40 rounded shadow-2xl p-1.5 z-50 divide-y divide-[#1f1f23]"
                onMouseLeave={() => setWorkflowOpen(false)}
              >
                <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-[#8e9194]">
                  SIH EVALUATION PIPELINE
                </div>
                <div className="py-1 max-h-80 overflow-y-auto">
                  {workflowSteps.map((step) => {
                    const isActive = currentScreen === step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          navigateTo(step.id);
                          setWorkflowOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-[11px] font-mono transition-colors ${
                          isActive
                            ? 'bg-[#292a2d] text-[#ffffff] font-semibold border-l-2 border-[#f3f6fc]'
                            : 'text-[#c1c7d0] hover:bg-[#1b1b1f] hover:text-[#ffffff]'
                        }`}
                      >
                        <span className="truncate">{step.label}</span>
                        <span className="text-[9px] text-[#8e9194] uppercase ml-1.5">{step.stage}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1 px-1">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setWorkflowOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 text-[10px] font-mono text-[#c1c7d0] hover:text-white flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Baseline Demo (FV-2026-001)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: Generate Forensic Report */}
          <button
            onClick={() => navigateTo('forensic-report')}
            className="metallic-btn flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold tracking-wide uppercase transition-all"
            type="button"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GENERATE FORENSIC REPORT</span>
            <span className="md:hidden">REPORT</span>
          </button>

          <div className="h-6 w-px bg-[#44474a]/60"></div>

          {/* User Profile Control */}
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#16171b] hover:bg-[#202227] border border-[#60646c] text-[#ffffff] transition-all cursor-pointer shadow-sm select-none"
              aria-label="User Profile Menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="w-4 h-4 rounded-full bg-[#2a2c32] border border-[#8e9194] flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff]"></span>
              </div>
              <span className="text-xs font-semibold text-[#ffffff] tracking-tight font-sans">
                {currentUser?.name || 'Forensic Investigator'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#a6adb7] transition-transform duration-150 ${
                  profileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-[#121316] border border-[#56595e] rounded shadow-2xl z-50 overflow-hidden font-sans animate-fadeIn">
                <div className="px-3.5 py-2.5 bg-[#17181c] border-b border-[#32353a]">
                  <div className="text-xs font-bold text-[#ffffff]">
                    {currentUser?.name || 'Forensic Investigator'}
                  </div>
                  <div className="text-[11px] text-[#8e9194] font-mono mt-0.5">
                    {currentUser?.role || 'Digital Forensics Analyst'}
                  </div>
                </div>
                <div className="p-1 space-y-0.5 font-mono text-xs">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-[#e3e6eb] hover:text-[#ffffff] hover:bg-[#202227] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#c4c7ca]" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-[#e3e6eb] hover:text-[#ffffff] hover:bg-[#202227] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#c4c7ca]" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Settings</span>
                  </button>
                  <div className="my-1 border-t border-[#32353a]"></div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded text-[#ffffff] hover:bg-[#282a30] flex items-center gap-2.5 transition-colors cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#c4c7ca]" />
                    <span className="text-[11px] uppercase tracking-wider">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </header>
  );
};
