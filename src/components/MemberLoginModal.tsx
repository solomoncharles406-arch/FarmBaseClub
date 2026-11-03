import React, { useState } from 'react';
import { LogIn, Mail, Phone, Lock, Eye, EyeOff, X, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Investor } from '../types';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  investors: Investor[];
  currentInvestor: Investor;
  onSelectInvestor: (investor: Investor) => void;
  onGoToDashboard: () => void;
  onOpenRegister: () => void;
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  investors,
  currentInvestor,
  onSelectInvestor,
  onGoToDashboard,
  onOpenRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      // If empty, log in as current investor directly
      onGoToDashboard();
      onClose();
      return;
    }

    // Try to match by email, phone, referral code, or full name
    const found = investors.find(
      (inv) =>
        inv.email.toLowerCase() === cleanId ||
        inv.phone.replace(/\D/g, '').includes(cleanId.replace(/\D/g, '')) ||
        inv.referralCode.toLowerCase() === cleanId ||
        inv.fullName.toLowerCase().includes(cleanId)
    );

    if (found) {
      onSelectInvestor(found);
      setSuccessMsg(`Welcome back, ${found.fullName}!`);
      setTimeout(() => {
        onGoToDashboard();
        onClose();
      }, 500);
    } else {
      // If not strictly matched, still authenticate with current investor or first investor
      setErrorMsg('Account not found with provided credentials. Please check your email or phone, or select an active account below.');
    }
  };

  const handleQuickLogin = (inv: Investor) => {
    onSelectInvestor(inv);
    setSuccessMsg(`Logged in as ${inv.fullName}`);
    setTimeout(() => {
      onGoToDashboard();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-md">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Member Portal Login
              </h3>
              <p className="text-xs text-neutral-400">
                Farm Base Club Assistance Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close Login Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {successMsg ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/80 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-base font-bold text-white">{successMsg}</p>
              <p className="text-xs text-emerald-400">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email, Phone Number, or Referral Code
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="e.g. musa@farmbase.ng or 08031234567"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Password / Member PIN
                  </label>
                  <span className="text-[11px] text-neutral-500">Optional for demo</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password or PIN"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-950/60 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Profiles */}
          {!successMsg && (
            <div className="pt-3 border-t border-neutral-800/80">
              <p className="text-[11px] font-semibold text-neutral-400 mb-2">
                Or Quick Switch / Log in as Active Member:
              </p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {investors.slice(0, 3).map((inv) => (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => handleQuickLogin(inv)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition cursor-pointer border ${
                      currentInvestor.id === inv.id
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                        : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {inv.fullName.charAt(0)}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold block truncate">{inv.fullName}</span>
                        <span className="text-[10px] text-neutral-400">{inv.phone}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 shrink-0 font-mono">
                      ₦{inv.activeAssistance.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          {!successMsg && (
            <div className="pt-3 border-t border-neutral-800 text-center flex items-center justify-between text-xs text-neutral-400">
              <span>Don't have an account?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
