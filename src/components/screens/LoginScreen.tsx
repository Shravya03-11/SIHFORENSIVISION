import React, { useState } from 'react';
import { useForensics } from '../../context/ForensicContext';
import { Shield, Lock, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, errorMessage, clearMessages } = useForensics();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    try {
      await login(email, password);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleApplyDemoCredentials = () => {
    clearMessages();
    setEmail('investigator@forensivision.demo');
    setPassword('Forensic@123');
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#ffffff] flex flex-col justify-center items-center px-4 py-8 select-none relative">
      {/* Background Reticle Pattern in pure subtle monochrome */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden">
        <div className="w-[700px] h-[700px] rounded-full border border-[#ffffff] flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-[#ffffff] flex items-center justify-center">
            <div className="w-[300px] h-[300px] rounded-full border border-[#ffffff]"></div>
          </div>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-[#121316] border border-[#44474c] rounded-md p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05)] relative z-10">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-13 h-13 rounded-lg bg-[#1a1c21] border border-[#60646c] flex items-center justify-center mb-3.5 shadow-md">
            <Shield className="w-7 h-7 text-[#ffffff]" />
          </div>

          <h1 className="text-xl font-bold font-mono tracking-widest text-[#ffffff] uppercase">
            FORENSIVISION
          </h1>
          <p className="font-mono text-[10px] text-[#c4c7ca] tracking-widest uppercase mt-1">
            Digital Video Forensic Analysis Platform
          </p>

          <div className="mt-3.5 px-3 py-1 rounded bg-[#17181c] border border-[#44474c] flex items-center gap-1.5 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c4c7ca]" />
            <span className="font-mono text-[9px] text-[#e3e6eb] uppercase tracking-wider font-semibold">
              SECURE FORENSIC ACCESS
            </span>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded bg-[#1f2024] border border-[#6b6f76] text-[#ffffff] text-xs font-mono flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ffffff]" />
            <span className="font-bold tracking-wide">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase text-[#c4c7ca] mb-1.5 font-semibold tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => {
                clearMessages();
                setEmail(e.target.value);
              }}
              placeholder="investigator@forensivision.demo"
              className="w-full bg-[#08090b] border border-[#44474c] focus:border-[#ffffff] rounded px-3.5 py-2.5 text-xs font-mono text-[#ffffff] placeholder-[#5a5f66] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase text-[#c4c7ca] mb-1.5 font-semibold tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                clearMessages();
                setPassword(e.target.value);
              }}
              placeholder="••••••••••••"
              className="w-full bg-[#08090b] border border-[#44474c] focus:border-[#ffffff] rounded px-3.5 py-2.5 text-xs font-mono text-[#ffffff] placeholder-[#5a5f66] focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 rounded bg-gradient-to-b from-[#e8ebf0] via-[#c6cbd1] to-[#9da1a7] text-[#090a0c] text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md"
            >
              <Lock className="w-3.5 h-3.5 text-[#090a0c]" />
              <span>{isAuthenticating ? 'VERIFYING...' : 'SIGN IN'}</span>
            </button>
          </div>
        </form>

        {/* Prototype Demo Credentials Helper */}
        <div className="mt-6 pt-4 border-t border-[#31343a] text-center">
          <div className="text-[10px] font-mono text-[#8e9194] uppercase tracking-wider mb-2">
            DEMO CREDENTIALS: <span className="text-[#ffffff]">investigator@forensivision.demo</span> / <span className="text-[#ffffff]">Forensic@123</span>
          </div>
          <button
            type="button"
            onClick={handleApplyDemoCredentials}
            className="text-[11px] font-mono text-[#c4c7ca] hover:text-[#ffffff] underline underline-offset-4 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3 h-3 text-[#c4c7ca]" />
            <span>Fill Demo Credentials</span>
          </button>
        </div>

        {/* Compliance Footer */}
        <div className="mt-5 text-center font-mono text-[9px] text-[#60646c] uppercase tracking-wider">
          NIST SP 800-88 &amp; FIPS 140-3 COMPLIANT FORENSIC TERMINAL
        </div>
      </div>
    </div>
  );
};
