import React, { useState, useMemo } from 'react';
import { UserPlus, Mail, Phone, Building2, CreditCard, User, X, CheckCircle, ArrowRight, Lock, Eye, EyeOff, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Investor } from '../types';
import { TermsModal } from './TermsModal';
import { NIGERIAN_BANKS } from '../data/banks';
import {
  checkDuplicateRegistration,
  normalizeEmail,
  normalizePhoneDigits,
  normalizeAccountNumber,
  normalizeNameForComparison,
  getAllRegisteredInvestors,
} from '../utils/registrationValidation';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  investors?: Investor[];
  onRegister: (
    investor: Omit<Investor, 'id' | 'referralCode' | 'referralCount' | 'referralEarnings' | 'totalAssisted' | 'status'>
  ) => Promise<{ success: boolean; error?: string } | void> | void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  investors = [],
  onRegister,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bankName, setBankName] = useState('Zenith Bank Plc');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cached pool of all registered investors (in-memory + localStorage)
  const allExistingInvestors = useMemo(() => {
    return getAllRegisteredInvestors(investors);
  }, [investors, isOpen]);

  // Real-time conflict detection for individual fields
  const emailConflict = useMemo(() => {
    const clean = normalizeEmail(email);
    if (!clean || clean.length < 5 || !clean.includes('@')) return false;
    return allExistingInvestors.some((i) => normalizeEmail(i.email) === clean);
  }, [email, allExistingInvestors]);

  const phoneConflict = useMemo(() => {
    const clean = normalizePhoneDigits(phone);
    if (!clean || clean.length < 7) return false;
    return allExistingInvestors.some((i) => {
      const invP = normalizePhoneDigits(i.phone);
      return invP && invP === clean;
    });
  }, [phone, allExistingInvestors]);

  const accNumConflict = useMemo(() => {
    const clean = normalizeAccountNumber(accountNumber);
    if (!clean || clean.length < 7) return false;
    return allExistingInvestors.some((i) => {
      const invAcc = normalizeAccountNumber(i.bankDetails?.accountNumber);
      return invAcc && invAcc === clean;
    });
  }, [accountNumber, allExistingInvestors]);

  const accNameConflict = useMemo(() => {
    const clean = normalizeNameForComparison(accountName);
    if (!clean || clean.length < 4) return false;
    return allExistingInvestors.some((i) => {
      const invAccName = normalizeNameForComparison(i.bankDetails?.accountName);
      const invFullName = normalizeNameForComparison(i.fullName);
      return (invAccName && invAccName === clean) || (invFullName && invFullName === clean);
    });
  }, [accountName, allExistingInvestors]);

  const fullNameConflict = useMemo(() => {
    const clean = normalizeNameForComparison(fullName);
    if (!clean || clean.length < 4) return false;
    return allExistingInvestors.some((i) => {
      const invFullName = normalizeNameForComparison(i.fullName);
      const invAccName = normalizeNameForComparison(i.bankDetails?.accountName);
      return (invFullName && invFullName === clean) || (invAccName && invAccName === clean);
    });
  }, [fullName, allExistingInvestors]);

  const hasAnyConflict = emailConflict || phoneConflict || accNumConflict || accNameConflict || fullNameConflict;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !phone || !password || !accountNumber || !accountName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg('You must read and tick the box to accept the Terms and Conditions to proceed.');
      return;
    }

    // STRICT CHECK: Verify that email, phone, account number, account name, and legal name are not already in use
    const dupCheck = checkDuplicateRegistration(
      {
        fullName,
        email,
        phone,
        accountNumber,
        accountName,
      },
      allExistingInvestors
    );

    if (dupCheck.isDuplicate) {
      setErrorMsg(dupCheck.message || 'Duplicate registration details detected. These details belong to an existing account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onRegister({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        bankDetails: {
          bankName,
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim(),
        },
        activeAssistance: 0,
        dividendPercent: 20,
        assistanceDate: '',
        withdrawalDate: '',
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

      if (result && typeof result === 'object' && result.success === false) {
        setErrorMsg(result.error || 'Registration was rejected due to duplicate account credentials.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsSubmitting(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during registration. Please try again.');
      setIsSubmitting(false);
    }
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
              aria-label="Close"
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
                  <div className="p-3.5 bg-red-950/70 border border-red-700/80 rounded-xl text-xs text-red-200 flex items-start gap-2 shadow-lg animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="font-medium leading-relaxed">{errorMsg}</div>
                  </div>
                )}

                <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-neutral-300 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold text-emerald-400">Strict Single-Account Policy:</span> Every investor must register unique identity coordinates. Re-using an existing <span className="text-white font-semibold">email, phone number, account number, or account name</span> will be automatically rejected.
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-500" /> Full Legal Name
                      </span>
                      {fullNameConflict && (
                        <span className="text-[11px] text-red-400 font-normal flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Already registered
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alhaji Mustapha Sanusi"
                      className={`w-full px-3.5 py-2.5 bg-black border rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none transition ${
                        fullNameConflict
                          ? 'border-red-500/80 focus:border-red-500 bg-red-950/20'
                          : 'border-neutral-800 focus:border-emerald-500'
                      }`}
                    />
                    {fullNameConflict && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" /> An account under this legal name already exists. Duplicate accounts are not permitted.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-emerald-500" /> Email Address
                        </span>
                        {emailConflict && (
                          <span className="text-[11px] text-red-400 font-normal flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Taken
                          </span>
                        )}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="investor@example.com"
                        className={`w-full px-3.5 py-2.5 bg-black border rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none transition ${
                          emailConflict
                            ? 'border-red-500/80 focus:border-red-500 bg-red-950/20'
                            : 'border-neutral-800 focus:border-emerald-500'
                        }`}
                      />
                      {emailConflict && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> Email is already registered to another account.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" /> Phone Number
                        </span>
                        {phoneConflict && (
                          <span className="text-[11px] text-red-400 font-normal flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Taken
                          </span>
                        )}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className={`w-full px-3.5 py-2.5 bg-black border rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none transition ${
                          phoneConflict
                            ? 'border-red-500/80 focus:border-red-500 bg-red-950/20'
                            : 'border-neutral-800 focus:border-emerald-500'
                        }`}
                      />
                      {phoneConflict && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> Phone number is already registered to an existing account.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-500" /> Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-3.5 pr-9 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 mb-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" /> Confirm Password
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
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
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1 flex items-center justify-between">
                        <span>Account Number (10-Digit NUBAN)</span>
                        {accNumConflict && (
                          <span className="text-[11px] text-red-400 font-normal flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Taken
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. 0123456789"
                        className={`w-full px-3.5 py-2.5 bg-black border rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none font-mono transition ${
                          accNumConflict
                            ? 'border-red-500/80 focus:border-red-500 bg-red-950/20'
                            : 'border-neutral-800 focus:border-emerald-500'
                        }`}
                      />
                      {accNumConflict && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> Account number is already registered to another account.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1 flex items-center justify-between">
                        <span>Beneficiary Account Name</span>
                        {accNameConflict && (
                          <span className="text-[11px] text-red-400 font-normal flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Taken
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Matches legal name"
                        className={`w-full px-3.5 py-2.5 bg-black border rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none transition ${
                          accNameConflict
                            ? 'border-red-500/80 focus:border-red-500 bg-red-950/20'
                            : 'border-neutral-800 focus:border-emerald-500'
                        }`}
                      />
                      {accNameConflict && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> Beneficiary account name is already registered to another member.
                        </p>
                      )}
                    </div>
                  </div>
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
                    disabled={!acceptedTerms || isSubmitting || hasAnyConflict}
                    className={`w-full py-3 text-sm font-bold text-white rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${
                      acceptedTerms && !hasAnyConflict && !isSubmitting
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50 cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Verifying Coordinates & Submitting...</span>
                    ) : hasAnyConflict ? (
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        Duplicate Details Detected (Fix Above)
                      </span>
                    ) : (
                      <>
                        <span>Create Account & Submit for Approval</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {hasAnyConflict ? (
                    <p className="text-[11px] text-red-400 text-center mt-1.5 font-medium">
                      One or more fields match an existing account. Please provide unique information.
                    </p>
                  ) : !acceptedTerms ? (
                    <p className="text-[11px] text-neutral-500 text-center mt-1.5">
                      Please tick the accept box above to enable account registration.
                    </p>
                  ) : null}
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
