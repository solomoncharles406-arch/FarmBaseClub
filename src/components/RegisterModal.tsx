import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Building2, CreditCard, User, X, CheckCircle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Investor } from '../types';
import { TermsModal } from './TermsModal';
import { NIGERIAN_BANKS } from '../data/banks';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (investor: Omit<Investor, 'id' | 'referralCode' | 'referralCount' | 'referralEarnings' | 'totalAssisted' | 'status'>) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('Zenith Bank Plc');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !phone || !accountNumber || !accountName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg('You must read and tick the box to accept the Terms and Conditions to proceed.');
      return;
    }

    const today = new Date();
    const withdrawal = new Date(today);
    withdrawal.setDate(today.getDate() + 20);

    onRegister({
      fullName,
      email,
      phone,
      bankDetails: {
        bankName,
        accountNumber,
        accountName,
      },
      referredByCode: referralCode ? referralCode.trim() : undefined,
      activeAssistance: 0,
      dividendPercent: 0,
      assistanceDate: today.toISOString().split('T')[0],
      withdrawalDate: withdrawal.toISOString().split('T')[0],
      dividendPaused: false,
      withdrawalLocked: false,
      directMessage: {
        id: 'welcome-' + Date.now(),
        title: 'Registration Submitted - Pending Admin Approval',
        message: 'Welcome to Farm Base Club! Your registration is complete and currently queued for review. Central Admin will approve your account shortly so your sponsorship cycle can begin.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBroadcast: false,
        type: 'info',
      },
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create Account</h3>
                <p className="text-xs text-neutral-400">Register as a Farm Base Club Investor</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white">Registration Submitted!</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Your account is pending administrative verification. Opening your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300">
                  <span className="font-semibold text-emerald-400">Account KYC Coordinates:</span> Enter your exact legal name, active email, phone, and beneficiary banking details.
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-emerald-500" /> Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alhaji Mustapha Sanusi"
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-emerald-500" /> Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="investor@example.com"
                        className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 mb-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Details Section */}
                <div className="pt-2 border-t border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Banking & Payout Coordinates
                    </span>
                    <span className="text-[11px] text-neutral-500">For Receiving Assistance</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" /> Bank Institution
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none"
                    >
                      {NIGERIAN_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1 block">
                        Account Number (10-Digit NUBAN)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. 0123456789"
                        className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1 block">
                        Beneficiary Account Name
                      </label>
                      <input
                        type="text"
                        required
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Matches legal name"
                        className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Referral Code (Optional) */}
                <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                    <span>Referral Code (Optional)</span>
                    <span className="text-[10px] text-neutral-500 font-normal">If invited by a member</span>
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="e.g. FBC-2055"
                    className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 leading-snug">
                    <strong className="text-neutral-300">Policy Note:</strong> Referral bonus is only credited and added when you render support to another person.
                  </p>
                </div>

                {/* Terms and Conditions Acceptance Link & Checkbox */}
                <div className="pt-3 border-t border-neutral-800 space-y-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <input
                      type="checkbox"
                      id="acceptTermsCheckbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-black border border-neutral-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0 accent-emerald-500"
                    />
                    <label htmlFor="acceptTermsCheckbox" className="text-xs text-neutral-300 leading-relaxed select-none cursor-pointer">
                      I have read, understood, and accept the{' '}
                      <button
                        type="button"
                        onClick={() => setIsTermsOpen(true)}
                        className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Farm Base Club Terms and Conditions</span>
                      </button>
                      . I understand that account activation requires admin approval.
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!acceptedTerms}
                    className={`w-full py-3 text-sm font-bold text-white rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${
                      acceptedTerms
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50 cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                    }`}
                  >
                    <span>Create Account & Submit for Approval</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {!acceptedTerms && (
                    <p className="text-[11px] text-neutral-500 text-center mt-1.5">
                      Please tick the accept box above to enable account registration.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Pinned Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => setAcceptedTerms(true)}
      />
    </>
  );
};
