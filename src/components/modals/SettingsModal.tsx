import React, { useState } from 'react';
import { useForensics } from '../../context/ForensicContext';
import { X, User, Shield, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useForensics();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'preferences'>('account');
  const [autoLockTimeout, setAutoLockTimeout] = useState('30');
  const [gpuAcceleration, setGpuAcceleration] = useState(true);
  const [frameAccurateSync, setFrameAccurateSync] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-[#121316] border border-[#56595e] rounded-md shadow-2xl p-6 relative z-10 text-[#ffffff]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#32353a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1e2025] border border-[#60646c] flex items-center justify-center">
              <Sliders className="w-4 h-4 text-[#ffffff]" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono tracking-wider text-[#ffffff] uppercase">
                SETTINGS
              </h2>
              <p className="text-[10px] font-mono text-[#8e9194] uppercase tracking-wider">
                Forensic Workstation Configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#202227] text-[#8e9194] hover:text-[#ffffff] transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation: Account / Security / Application Preferences */}
        <div className="grid grid-cols-3 gap-1 my-4 p-1 rounded bg-[#090a0c] border border-[#32353a]">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-1.5 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'account'
                ? 'bg-[#25272d] text-[#ffffff] shadow-sm'
                : 'text-[#8e9194] hover:text-[#ffffff]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-1.5 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-[#25272d] text-[#ffffff] shadow-sm'
                : 'text-[#8e9194] hover:text-[#ffffff]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-1.5 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'preferences'
                ? 'bg-[#25272d] text-[#ffffff] shadow-sm'
                : 'text-[#8e9194] hover:text-[#ffffff]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[170px] font-mono text-xs">
          {activeTab === 'account' && (
            <div className="space-y-3 p-3.5 rounded bg-[#090a0c] border border-[#32353a]">
              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <span className="text-[#8e9194] uppercase text-[11px]">User Identity:</span>
                <span className="text-[#ffffff] font-semibold">
                  {currentUser?.name || 'Forensic Investigator'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <span className="text-[#8e9194] uppercase text-[11px]">Primary Email:</span>
                <span className="text-[#ffffff]">
                  {currentUser?.email || 'investigator@forensivision.demo'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <span className="text-[#8e9194] uppercase text-[11px]">Role Classification:</span>
                <span className="text-[#ffffff]">
                  {currentUser?.role || 'Digital Forensics Analyst'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e9194] uppercase text-[11px]">Authentication Mode:</span>
                <span className="text-[#c4c7ca]">Institutional Certificate</span>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-3 p-3.5 rounded bg-[#090a0c] border border-[#32353a]">
              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <div>
                  <div className="text-[#ffffff] font-semibold">FIPS 140-3 Validation</div>
                  <div className="text-[10px] text-[#8e9194]">Cryptographic enforcement level</div>
                </div>
                <div className="flex items-center gap-1 text-[#ffffff] font-bold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-[#ffffff]" />
                  <span>ENFORCED</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <div>
                  <div className="text-[#ffffff] font-semibold">Cryptographic Hash Verification</div>
                  <div className="text-[10px] text-[#8e9194]">Bitstream SHA-256 &amp; MD5 checks</div>
                </div>
                <span className="text-[#ffffff] text-[11px] font-bold">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#ffffff] font-semibold">Inactivity Auto-Lock</div>
                  <div className="text-[10px] text-[#8e9194]">Automatic terminal session lock</div>
                </div>
                <select
                  value={autoLockTimeout}
                  onChange={(e) => setAutoLockTimeout(e.target.value)}
                  className="bg-[#17181c] border border-[#44474c] rounded px-2 py-1 text-xs text-[#ffffff] focus:outline-none"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-3 p-3.5 rounded bg-[#090a0c] border border-[#32353a]">
              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <div>
                  <div className="text-[#ffffff] font-semibold">Workspace Theme</div>
                  <div className="text-[10px] text-[#8e9194]">Lab display contrast profile</div>
                </div>
                <span className="text-[#c4c7ca] text-[11px] font-bold">MONOCHROME DARK</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#202226] pb-2">
                <div>
                  <div className="text-[#ffffff] font-semibold">Frame Accurate Synchronization</div>
                  <div className="text-[10px] text-[#8e9194]">Synchronize video frames with timeline</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFrameAccurateSync(!frameAccurateSync)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    frameAccurateSync ? 'bg-[#ffffff]' : 'bg-[#32353a]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[#090a0c] transition-transform ${
                      frameAccurateSync ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#ffffff] font-semibold">Hardware Acceleration</div>
                  <div className="text-[10px] text-[#8e9194]">GPU-accelerated video decoding</div>
                </div>
                <button
                  type="button"
                  onClick={() => setGpuAcceleration(!gpuAcceleration)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    gpuAcceleration ? 'bg-[#ffffff]' : 'bg-[#32353a]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[#090a0c] transition-transform ${
                      gpuAcceleration ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-[#32353a]">
          <button
            onClick={onClose}
            className="w-full py-2 rounded bg-gradient-to-b from-[#e8ebf0] via-[#c6cbd1] to-[#9da1a7] text-[#090a0c] text-xs font-mono font-bold tracking-wider uppercase hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-md"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
