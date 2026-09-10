import React from 'react';
import { useForensics } from '../../context/ForensicContext';
import { X, ShieldCheck, User as UserIcon, Mail, Shield, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useForensics();

  if (!isOpen) return null;

  const displayName = currentUser?.name || 'Forensic Investigator';
  const displayEmail = currentUser?.email || 'investigator@forensivision.demo';
  const displayRole = currentUser?.role || 'Digital Forensics Analyst';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="w-full max-w-md bg-[#121316] border border-[#56595e] rounded-md shadow-2xl p-6 relative z-10 text-[#ffffff]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#32353a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1e2025] border border-[#60646c] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffffff]"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono tracking-wider text-[#ffffff] uppercase">
                USER PROFILE
              </h2>
              <p className="text-[10px] font-mono text-[#8e9194] uppercase tracking-wider">
                Digital Forensics Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#202227] text-[#8e9194] hover:text-[#ffffff] transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="py-5 space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded bg-[#090a0c] border border-[#32353a] space-y-3">
            <div className="flex items-start justify-between border-b border-[#202226] pb-2.5">
              <div className="flex items-center gap-2 text-[#8e9194]">
                <UserIcon className="w-3.5 h-3.5 text-[#c4c7ca]" />
                <span className="text-[11px] uppercase tracking-wider">Name:</span>
              </div>
              <span className="text-[#ffffff] font-semibold">{displayName}</span>
            </div>

            <div className="flex items-start justify-between border-b border-[#202226] pb-2.5">
              <div className="flex items-center gap-2 text-[#8e9194]">
                <Mail className="w-3.5 h-3.5 text-[#c4c7ca]" />
                <span className="text-[11px] uppercase tracking-wider">Email:</span>
              </div>
              <span className="text-[#ffffff] font-semibold">{displayEmail}</span>
            </div>

            <div className="flex items-start justify-between border-b border-[#202226] pb-2.5">
              <div className="flex items-center gap-2 text-[#8e9194]">
                <Shield className="w-3.5 h-3.5 text-[#c4c7ca]" />
                <span className="text-[11px] uppercase tracking-wider">Role:</span>
              </div>
              <span className="text-[#ffffff] font-semibold">{displayRole}</span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-2 text-[#8e9194]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c4c7ca]" />
                <span className="text-[11px] uppercase tracking-wider">Status:</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1e2025] border border-[#60646c]">
                <CheckCircle2 className="w-3 h-3 text-[#ffffff]" />
                <span className="text-[11px] text-[#ffffff] font-bold tracking-wider uppercase">
                  Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
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
