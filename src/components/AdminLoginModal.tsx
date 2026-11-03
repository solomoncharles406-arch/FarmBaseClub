import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, Eye, EyeOff, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ADMIN_PASSWORD = 'BaseClube2026';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Admin Authentication
              </h3>
              <p className="text-xs text-neutral-400">
                Farm Base Club Central Control Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-600/60 flex items-center justify-center text-emerald-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-sm text-neutral-300">
              Enter the authorized administrative access key to manage dividends, withdrawals, and user assist matching.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-red-500" /> Administrative Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter admin password..."
                className={`w-full px-4 py-3 pr-11 bg-black border ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-800 focus:border-red-500'
                } rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none transition font-mono`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Invalid password. Access denied.
              </p>
            )}
          </div>

          {/* Quick preset hint */}
          <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Required Key:</span>
            <button
              type="button"
              onClick={() => {
                setPassword(ADMIN_PASSWORD);
                setError(false);
              }}
              className="text-emerald-400 font-mono font-medium hover:underline hover:text-emerald-300"
            >
              Fill "{ADMIN_PASSWORD}"
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/50"
            >
              Access Dashboard
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
