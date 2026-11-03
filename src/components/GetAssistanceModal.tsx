import React, { useState } from 'react';
import { Download, ArrowRight, X, Building2, CreditCard, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Investor, AdminControls } from '../types';

interface GetAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: Investor;
  adminControls: AdminControls;
  onRequestAssistance: (amount: number) => void;
}

export const GetAssistanceModal: React.FC<GetAssistanceModalProps> = ({
  isOpen,
  onClose,
  investor,
  adminControls,
  onRequestAssistance,
}) => {
  const [claimAmount, setClaimAmount] = useState(
    ((investor.activeAssistance * 0.25) + investor.activeAssistance).toString()
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isWithdrawalBlocked = investor.withdrawalLocked || adminControls.globalWithdrawalsLocked;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWithdrawalBlocked) return;
    const val = parseFloat(claimAmount);
    if (!val || val <= 0) return;
    onRequestAssistance(val);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Get Assistance (Demand Payment)
              </h3>
              <p className="text-xs text-neutral-400">
                Claim matured agricultural dividends & assistance payouts
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isWithdrawalBlocked ? (
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-center">
              <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-white">Withdrawals Temporarily Restricted</h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  The Central Administration has paused payout claims for routine harvest audits, seasonal assistance cycle reconciliation, or account verification.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/80 border border-neutral-800 text-xs text-neutral-400">
                <span className="text-amber-400 font-semibold">Admin Notice:</span>{' '}
                {adminControls.systemNotice || 'Withdrawal channel temporarily locked by Admin. Your capital and dividend percentage remain secure and active.'}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
              >
                Acknowledge & Return to Dashboard
              </button>
            </div>
          ) : submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Assistance Claim Queued!</h4>
              <p className="text-xs text-neutral-400">
                Your demand to "Get Assistance" for ₦{Number(claimAmount || 0).toLocaleString()} has been entered into the Admin Dispatch Queue. A matched peer investor will be assigned to pay directly into your registered bank account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                <p className="font-semibold text-emerald-400">Definition: "Get Assistance"</p>
                <p>
                  In Farm Base Club, <strong className="text-white">Get Assistance</strong> is the terminology used to demand payment from users upon the maturity of your agricultural dividend commitment cycle.
                </p>
              </div>

              {/* Investor Banking Coordinates */}
              <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                    Disbursement Coordinates
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">Verified Active</span>
                </div>
                <div className="text-xs space-y-1">
                  <p className="flex justify-between text-neutral-300">
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-red-500" /> Bank:</span>
                    <span className="font-semibold text-white">{investor.bankDetails.bankName}</span>
                  </p>
                  <p className="flex justify-between text-neutral-300">
                    <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-red-500" /> Account Number:</span>
                    <span className="font-mono text-emerald-400 font-bold">{investor.bankDetails.accountNumber}</span>
                  </p>
                  <p className="flex justify-between text-neutral-300">
                    <span>Beneficiary:</span>
                    <span className="font-medium text-white">{investor.bankDetails.accountName}</span>
                  </p>
                </div>
              </div>

              {/* Claim Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                  Amount to Demand / Claim (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₦</span>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-black border border-neutral-800 focus:border-red-500 rounded-xl text-white text-base font-mono focus:outline-none"
                    placeholder="Enter claim amount in Naira..."
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  Available harvest maturity balance: ₦{(investor.activeAssistance * 1.25).toLocaleString()}
                </p>
              </div>

              {investor.dividendPercent < 100 && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Your current harvest commitment progress is at {investor.dividendPercent}%. Payouts initiated before 100% maturity will distribute accumulated partial dividends.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                Submit Demand & Get Assistance <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
