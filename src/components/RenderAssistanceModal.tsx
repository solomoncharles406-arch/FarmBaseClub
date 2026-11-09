import React, { useState } from 'react';
import { HandCoins, ArrowRight, X, Building2, CreditCard, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Investor, AssistanceOrder } from '../types';

interface RenderAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  investor: Investor;
  onSubmitOrder: (amount: number, note?: string) => void;
  activeOrder?: AssistanceOrder | null;
}

export const RenderAssistanceModal: React.FC<RenderAssistanceModalProps> = ({
  isOpen,
  onClose,
  investor,
  onSubmitOrder,
  activeOrder,
}) => {
  const [amount, setAmount] = useState('10000');
  const [proofNote, setProofNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val < 10000) {
      alert('The least amount for Assistance is ₦10,000.');
      return;
    }
    onSubmitOrder(val, proofNote);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  const presetAmounts = [10000, 30000, 50000, 100000, 250000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-md">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Render Assistance (Offer to Pay)
              </h3>
              <p className="text-xs text-neutral-400">
                Pledge financial sponsorship to farmers & community peers
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
          {activeOrder && activeOrder.status === 'MATCHED' && activeOrder.matchedWith ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/70 text-xs text-emerald-200">
                <span className="font-bold">Match Found by Admin!</span> You have been paired with an active member awaiting payout. Please transfer the funds using the banking coordinates below.
              </div>

              <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                    Assistance Recipient
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    Awaiting Payment
                  </span>
                </div>

                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5 text-xs"><User className="w-3.5 h-3.5 text-emerald-500" /> Beneficiary Name:</span>
                    <span className="font-bold text-white">{activeOrder.matchedWith.investorName}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5 text-xs"><Building2 className="w-3.5 h-3.5 text-emerald-500" /> Bank Name:</span>
                    <span className="font-semibold text-white">{activeOrder.matchedWith.bankDetails.bankName}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5 text-xs"><CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Account Number:</span>
                    <span className="font-mono text-base font-bold text-emerald-400 select-all">{activeOrder.matchedWith.bankDetails.accountNumber}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-neutral-400 text-xs">Pledged Amount:</span>
                    <span className="font-mono text-lg font-extrabold text-white">₦{activeOrder.amount.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Payment Reference / Transaction ID
                </label>
                <input
                  type="text"
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="e.g. Bank Transfer Ref TXN-781940"
                  className="w-full px-3.5 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('Proof of payment submitted to central admin desk for instant verification!');
                  onClose();
                }}
                className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                Submit Payment Confirmation <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          ) : submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Assistance Pledge Registered!</h4>
              <p className="text-xs text-neutral-400">
                Your pledge to Render Assistance of ₦{Number(amount || 0).toLocaleString()} has been submitted to the Admin Matching Desk. You will be matched with a recipient shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                <p className="font-semibold text-emerald-400">Definition: Render Assistance</p>
                <p>
                  In Farm Base Club, <strong className="text-white">Render Assistance</strong> is the terminology used when offering to financially sponsor a farming cooperative or pay a peer investor scheduled for payout. Your commitment yields up to 20% dividend in a disciplined 20 day cycle.
                </p>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                  Select Assistance Sponsorship Amount (₦)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className={`py-2 text-[11px] font-bold rounded-lg border transition ${
                        amount === val.toString()
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-black text-neutral-300 border-neutral-800 hover:border-emerald-500'
                      }`}
                    >
                      ₦{val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
                    </button>
                  ))}
                </div>

                <div className="relative mt-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₦</span>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-black border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-base font-mono focus:outline-none"
                    placeholder="Enter custom amount (least is 10,000)..."
                  />
                </div>
                <span className="text-[11px] text-neutral-400 block">
                  Least amount for Assistance is ₦10,000 (Maximum: ₦40,000,000).
                </span>
              </div>

              {/* Assistance Growth Projection */}
              <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Cycle Duration:</span>
                  <span className="text-white font-medium">20 Days Agricultural Cycle</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Projected Dividend Return:</span>
                  <span className="text-emerald-400 font-bold">+20% Dividend (20 Days)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm">
                  <span className="text-neutral-300 font-semibold">Total Estimated Payout:</span>
                  <span className="font-mono font-bold text-white">
                    ₦{(parseFloat(amount || '0') * 1.20).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  Once submitted, the central Admin Desk matches your pledge with a recipient demanding assistance (Get Assistance). You will then transfer funds directly to their bank account.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                Confirm & Render Assistance <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
