import React, { useState, useEffect } from 'react';
import { LogIn, Lock, Eye, EyeOff, X, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Investor } from '../types';

import { normalizeEmail, normalizePhoneDigits } from '../utils/registrationValidation';

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  investors: Investor[];
  onSelectInvestor: (investor: Investor) => void;
  onGoToDashboard: () => void;
  onOpenRegister: () => void;
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  investors,
  onSelectInvestor,
  onGoToDashboard,
  onOpenRegister,
}) => {
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('farmbase_remember_user') === 'true';
  });
  const [identifier, setIdentifier] = useState(() => {
    const isRemembered = localStorage.getItem('farmbase_remember_user') === 'true';
    return isRemembered ? (localStorage.getItem('farmbase_remember_email') || '') : '';
  });
  const [password, setPassword] = useState(() => {
    const isRemembered = localStorage.getItem('farmbase_remember_user') === 'true';
    return isRemembered ? (localStorage.getItem('farmbase_remember_password') || '') : '';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const isRemembered = localStorage.getItem('farmbase_remember_user') === 'true';
      setRememberMe(isRemembered);
      if (isRemembered) {
        setIdentifier(localStorage.getItem('farmbase_remember_email') || '');
        setPassword(localStorage.getItem('farmbase_remember_password') || '');
      } else {
        setIdentifier('');
        setPassword('');
      }
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      setErrorMsg('Please enter your Email Address or Phone Number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    const cleanIdPhone = normalizePhoneDigits(cleanId);
    const matchesUser = (inv: Investor) => {
      if (normalizeEmail(inv.email) === cleanId) return true;
      if (inv.referralCode?.toLowerCase() === cleanId) return true;
      if (cleanIdPhone && cleanIdPhone.length >= 7) {
        const invPhone = normalizePhoneDigits(inv.phone);
        if (invPhone && invPhone === cleanIdPhone) return true;
      }
      return false;
    };

    // Match by email, normalized phone, or referral code from props or cached registered accounts
    let found = investors.find(matchesUser);

    // Fallback: Check local storage for newly registered users if props haven't synced
    if (!found) {
      try {
        const cached = localStorage.getItem('farmbase_all_investors');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            found = parsed.find(matchesUser);
          }
        }
      } catch (err) {
        console.warn('Failed reading cached investors in login modal:', err);
      }
    }

    if (!found) {
      setErrorMsg('No registered account found with these credentials. Please check your details or create a new account.');
      return;
    }

    // Verify password if set on the account or in the account password map
    const storedPassword = found.password || (() => {
      try {
        const pwdMap = JSON.parse(localStorage.getItem('farmbase_account_passwords') || '{}');
        return pwdMap[found.email.toLowerCase()] || pwdMap[found.phone.replace(/\D/g, '')] || pwdMap[found.referralCode.toLowerCase()];
      } catch {
        return undefined;
      }
    })();

    if (storedPassword && storedPassword !== password) {
      setErrorMsg('Incorrect password. Please try again.');
      return;
    }

    // Save or clear remember me in localStorage (remembers email, password, and member account)
    if (rememberMe) {
      localStorage.setItem('farmbase_remember_user', 'true');
      localStorage.setItem('farmbase_remember_email', identifier.trim());
      localStorage.setItem('farmbase_remember_password', password);
      localStorage.setItem('farmbase_remembered_investor_id', found.id);
    } else {
      localStorage.removeItem('farmbase_remember_user');
      localStorage.removeItem('farmbase_remember_email');
      localStorage.removeItem('farmbase_remember_password');
      localStorage.removeItem('farmbase_remembered_investor_id');
    }

    onSelectInvestor(found);
    setSuccessMsg(`Welcome back, ${found.fullName}!`);
    setTimeout(() => {
      onGoToDashboard();
      onClose();
    }, 450);
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
              <p className="text-xs text-emerald-400">Opening your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="e.g. investor@gmail.com or 08031234567"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Account Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter your account password"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                  />
                  <span className="font-medium">Remember me</span>
                </label>
                <span className="text-[11px] text-neutral-500">Encrypted P2P Session</span>
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
