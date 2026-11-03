import React, { useState } from 'react';
import { Investor, BankDetails, AssistanceHistoryItem, AssistanceOrder, AdminControls, ReferralBonusRecord, LiveAssistanceActivity } from '../types';
import { NIGERIAN_BANKS } from '../data/banks';
import { Logo } from './Logo';
import { LiveAssistanceTicker } from './LiveAssistanceTicker';
import {
  User,
  Copy,
  Check,
  Clock,
  Activity,
  AlertCircle,
  Building2,
  CreditCard,
  Phone,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  UploadCloud,
  Send,
  Lock,
  Smartphone,
  History,
  Trash2,
  MessageCircle,
  SendHorizontal,
  PhoneCall,
  Megaphone,
  Bell,
  Eye,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  FileCheck2,
  Download
} from 'lucide-react';

interface InvestorDashboardProps {
  investor: Investor;
  assistanceHistory: AssistanceHistoryItem[];
  assistanceOrders: AssistanceOrder[];
  adminControls: AdminControls;
  onOpenRenderAssistance: () => void;
  onOpenGetAssistance: () => void;
  onOpenRegisterOrSwitch: () => void;
  isAdminLoggedIn?: boolean;
  onApproveInvestor?: (investorId: string) => void;
  onReturnToAdmin?: () => void;
  onWithdrawReferralBonus?: (investorId: string, amount: number) => void;
  onUpdateBankDetails?: (bankDetails: BankDetails, phone: string) => void;
  onDepositWallet?: (amount: number) => void;
  onConfirmReceivedPayment?: (orderId: string) => void;
  onSendInquiry?: (data: { name: string; email: string; phone?: string; subject: string; message: string }) => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  investor,
  assistanceHistory,
  assistanceOrders,
  adminControls,
  onOpenRenderAssistance,
  onOpenGetAssistance,
  onOpenRegisterOrSwitch,
  isAdminLoggedIn = false,
  onApproveInvestor,
  onReturnToAdmin,
  onWithdrawReferralBonus,
  onUpdateBankDetails,
  onDepositWallet,
  onConfirmReceivedPayment,
  onSendInquiry,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Interactive Modals State
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isMessageAdminOpen, setIsMessageAdminOpen] = useState(false);
  const [isViewPayAccountOpen, setIsViewPayAccountOpen] = useState(false);
  const [isViewPayerPhoneOpen, setIsViewPayerPhoneOpen] = useState(false);
  const [selectedMatchedOrder, setSelectedMatchedOrder] = useState<AssistanceOrder | null>(null);

  // Direct Messaging to Recipient's Dashboard & WhatsApp
  const [recipientDirectMessage, setRecipientDirectMessage] = useState('');
  const [sentRecipientMessages, setSentRecipientMessages] = useState<Array<{ id: string; text: string; time: string; recipient: string }>>([]);

  // Edit Account Form State
  const [editBankName, setEditBankName] = useState(investor.bankDetails.bankName || '');
  const [editAccountNumber, setEditAccountNumber] = useState(investor.bankDetails.accountNumber || '');
  const [editAccountName, setEditAccountName] = useState(investor.bankDetails.accountName || investor.fullName);
  const [editPhone, setEditPhone] = useState(investor.phone || '');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('10000');

  // Contact Admin Form State
  const [adminSubject, setAdminSubject] = useState('Support Inquiry / Proof of Payment');
  const [adminMessage, setAdminMessage] = useState('');

  // Payment Proof Upload & Responsive Receipt Attachment State
  const [proofNote, setProofNote] = useState('');
  const [proofFileUploaded, setProofFileUploaded] = useState(false);
  const [attachedReceiptFile, setAttachedReceiptFile] = useState<{
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
    uploadedAt: string;
  } | null>(null);
  const [isDraggingReceipt, setIsDraggingReceipt] = useState(false);
  const [isReceiptPreviewOpen, setIsReceiptPreviewOpen] = useState(false);
  const receiptFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const referralUrl = `https://www.daposi.com/ref/${investor.referralCode || '2055'}`;

  // Referral Bonus Withdrawal & History Wipe State
  const [isWithdrawBonusModalOpen, setIsWithdrawBonusModalOpen] = useState(false);
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);

  const [bonusHistory, setBonusHistory] = useState<ReferralBonusRecord[]>(
    investor.referralBonusHistory && investor.referralBonusHistory.length > 0
      ? investor.referralBonusHistory
      : (investor.referralEarnings || 0) > 0
      ? [
          {
            id: 'bon-rec-1',
            refereeName: 'Chukwudi Nnamdi',
            amount: 4000,
            date: '2026-10-25',
            status: 'ACCRUED',
            supportRendered: true,
            supportAmount: 150000,
          },
          {
            id: 'bon-rec-2',
            refereeName: 'Amina Yusuf',
            amount: 4000,
            date: '2026-10-26',
            status: 'ACCRUED',
            supportRendered: true,
            supportAmount: 100000,
          },
          {
            id: 'bon-rec-3',
            refereeName: 'Babatunde Adeleke',
            amount: 4000,
            date: '2026-10-27',
            status: 'ACCRUED',
            supportRendered: true,
            supportAmount: 120000,
          },
        ]
      : []
  );
  const [bonusHistoryWiped, setBonusHistoryWiped] = useState(
    (investor.referralEarnings || 0) === 0 && (!investor.referralBonusHistory || investor.referralBonusHistory.length === 0)
  );

  // Business Rule: Referral bonus (₦4,000) is ONLY added when the referred person has rendered support to another person
  const qualifiedReferrals = bonusHistory.filter((b) => b.status === 'ACCRUED' && b.amount > 0).length;
  const pendingReferrals = bonusHistory.filter((b) => b.status === 'PENDING_SUPPORT').length;
  const totalReferrals = Math.max(investor.referralCount || 0, qualifiedReferrals + pendingReferrals);

  const calculatedAccruedBonus = bonusHistory
    .filter((b) => b.status === 'ACCRUED')
    .reduce((sum, b) => sum + b.amount, 0);

  const availableBonus = bonusHistoryWiped
    ? 0
    : investor.referralEarnings !== undefined && investor.referralEarnings > calculatedAccruedBonus
    ? investor.referralEarnings
    : calculatedAccruedBonus;

  // Referral Requirement: Exactly 3 referrals who have rendered support to another person
  const requiredReferrals = 3;
  const isReferralUnlocked = qualifiedReferrals >= requiredReferrals;

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3800);
  };

  const handleConfirmWithdrawBonus = () => {
    if (qualifiedReferrals < requiredReferrals) {
      showToast(`Withdrawal locked: You need at least ${requiredReferrals} referrals who rendered support to withdraw your bonus (${qualifiedReferrals}/${requiredReferrals} completed).`);
      return;
    }

    const amt = availableBonus > 0 ? availableBonus : qualifiedReferrals * 4000;
    if (amt <= 0) {
      showToast('No accrued referral bonus available to withdraw.');
      return;
    }

    if (onWithdrawReferralBonus) {
      onWithdrawReferralBonus(investor.id, amt);
    }
    // Wipe bonus history immediately
    setBonusHistory([]);
    setBonusHistoryWiped(true);
    setWithdrawnTotal((prev) => prev + amt);
    setIsWithdrawBonusModalOpen(false);
    showToast(`Referral bonus of ₦${amt.toLocaleString()} withdrawn to your bank account! Bonus history has been wiped clean.`);
  };

  const handleSimulateRefereeRenderSupport = (refereeName: string, supportAmt: number = 100000) => {
    setBonusHistory((prev) => {
      const existing = prev.find((b) => b.refereeName === refereeName);
      if (existing) {
        return prev.map((b) =>
          b.refereeName === refereeName
            ? {
                ...b,
                amount: 4000,
                status: 'ACCRUED' as const,
                supportRendered: true,
                supportAmount: supportAmt,
                date: new Date().toISOString().slice(0, 10),
              }
            : b
        );
      } else {
        return [
          {
            id: `bon-acc-${Date.now()}`,
            refereeName,
            amount: 4000,
            date: new Date().toISOString().slice(0, 10),
            status: 'ACCRUED' as const,
            supportRendered: true,
            supportAmount: supportAmt,
          },
          ...prev,
        ];
      }
    });
    setBonusHistoryWiped(false);
    showToast(`Support verified! ${refereeName} rendered ₦${supportAmt.toLocaleString()} support to a member. ₦4,000 referral bonus added!`);
  };

  const handleSimulateNewPendingReferee = (newRefereeName: string) => {
    setBonusHistory((prev) => [
      {
        id: `bon-pend-${Date.now()}`,
        refereeName: newRefereeName,
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        status: 'PENDING_SUPPORT' as const,
        supportRendered: false,
      },
      ...prev,
    ]);
    showToast(`New referral registered (${newRefereeName}). Note: ₦4,000 bonus will only add when ${newRefereeName} renders support to another member.`);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveAccountDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateBankDetails) {
      onUpdateBankDetails(
        {
          bankName: editBankName,
          accountNumber: editAccountNumber,
          accountName: editAccountName,
        },
        editPhone
      );
    }
    setIsEditAccountOpen(false);
    showToast('Account details (Bank & Phone) updated successfully!');
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;
    if (onDepositWallet) {
      onDepositWallet(amt);
    }
    setIsDepositOpen(false);
    showToast(`₦${amt.toLocaleString()} added to your wallet successfully!`);
  };

  const handleSendMessageToAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessage.trim()) return;
    if (onSendInquiry) {
      onSendInquiry({
        name: investor.fullName,
        email: investor.email,
        phone: investor.phone,
        subject: adminSubject,
        message: adminMessage,
      });
    }
    setAdminMessage('');
    setIsMessageAdminOpen(false);
    showToast('Your message has been sent to the Admin Desk!');
  };

  const handleConfirmReceived = (orderId: string) => {
    if (onConfirmReceivedPayment) {
      onConfirmReceivedPayment(orderId);
    }
    showToast('Payment receipt confirmed! Admin has been notified.');
  };

  // WhatsApp and Direct Dashboard Messaging Helper for Recipient
  const handleOpenWhatsApp = (phone: string, recipientName: string, amount: number) => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const intlPhone = cleanPhone.startsWith('0')
      ? '234' + cleanPhone.slice(1)
      : cleanPhone.startsWith('234')
      ? cleanPhone
      : '234' + cleanPhone;
    const text = encodeURIComponent(
      `Hello ${recipientName}, I am contacting you from Farm Base Club regarding my agricultural support payment of ₦${amount.toLocaleString()}. Please confirm your account details or acknowledge receipt.`
    );
    window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
  };

  const handleSendDirectToRecipientDashboard = (recipientName: string) => {
    if (!recipientDirectMessage.trim()) return;
    const newMsg = {
      id: 'msg-' + Date.now(),
      text: recipientDirectMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipient: recipientName,
    };
    setSentRecipientMessages((prev) => [newMsg, ...prev]);
    setRecipientDirectMessage('');
    showToast(`Direct message sent to ${recipientName}'s dashboard!`);
  };

  // Responsive Payment Receipt File Handlers
  const handleReceiptFile = (file: File) => {
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    setAttachedReceiptFile({
      name: file.name,
      size: sizeStr,
      type: file.type || 'image/png',
      previewUrl,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setProofFileUploaded(true);
    showToast(`Payment receipt "${file.name}" attached successfully!`);
  };

  const handleReceiptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleReceiptFile(e.target.files[0]);
    }
  };

  const handleReceiptDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingReceipt(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearReceipt = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProofFileUploaded(false);
    setAttachedReceiptFile(null);
    if (receiptFileInputRef.current) {
      receiptFileInputRef.current.value = '';
    }
    showToast('Payment receipt removed.');
  };

  const handleUseSampleReceipt = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAttachedReceiptFile({
      name: 'transfer_receipt.png',
      size: '384 KB',
      type: 'image/png',
      previewUrl: undefined,
      uploadedAt: 'Just now',
    });
    setProofFileUploaded(true);
    showToast('Payment receipt attached (transfer_receipt.png)!');
  };

  // Find matched orders for this investor
  const renderOrders = assistanceOrders.filter(
    (o) => o.investorId === investor.id && o.type === 'RENDER' && o.status === 'MATCHED'
  );
  const getOrders = assistanceOrders.filter(
    (o) => o.investorId === investor.id && o.type === 'GET' && o.status === 'MATCHED'
  );

  // Fallback active matched display matching the exact screenshots if no dynamic match exists
  const activePayMatch = renderOrders[0] || {
    id: 'ORD-R-205',
    type: 'RENDER' as const,
    investorId: investor.id,
    investorName: investor.fullName,
    phone: investor.phone,
    amount: investor.activeAssistance || 150000,
    bankDetails: investor.bankDetails,
    status: 'MATCHED' as const,
    matchedWith: {
      orderId: 'ORD-G-301',
      investorId: 'inv-301',
      investorName: 'Ugwuode Chukwuebuka Michael',
      phone: '08062675560',
      bankDetails: {
        bankName: 'OPay',
        accountNumber: '8062675560',
        accountName: 'Ugwuode Chukwuebuka Michael',
      },
      matchedAt: '2026-10-27 12:00',
    },
    createdAt: '2026-10-26 14:15',
  };

  const activePayoutMatch = getOrders[0] || {
    id: 'ORD-G-205',
    type: 'GET' as const,
    investorId: investor.id,
    investorName: investor.fullName,
    phone: investor.phone,
    amount: 100000,
    bankDetails: investor.bankDetails,
    status: 'MATCHED' as const,
    matchedWith: {
      orderId: 'ORD-R-206',
      investorId: 'inv-206',
      investorName: 'OKORO CALISTUS KELECHI',
      phone: '08132662948',
      bankDetails: {
        bankName: 'First Bank of Nigeria',
        accountNumber: '3012345678',
        accountName: 'OKORO CALISTUS KELECHI',
      },
      matchedAt: '2026-10-27 14:30',
    },
    createdAt: '2026-10-26 16:20',
  };

  // Recent activity list
  const userHistory = assistanceHistory.filter((item) => item.investorId === investor.id);

  const supportedCapital = investor.activeAssistance || 150000;
  const expectedProfit = Math.round(supportedCapital * 0.20);
  const accruedProfit = Math.round(expectedProfit * ((investor.dividendPercent || 0) / 100));

  const currentPayMatch = selectedMatchedOrder || activePayMatch;
  const recipientName = currentPayMatch.matchedWith?.investorName || 'Ugwuode Chukwuebuka Michael';
  const recipientPhone = currentPayMatch.matchedWith?.phone || '08062675560';
  const recipientBank = currentPayMatch.matchedWith?.bankDetails.bankName || 'OPay';
  const recipientAccountNo = currentPayMatch.matchedWith?.bankDetails.accountNumber || '8062675560';
  const matchAmount = currentPayMatch.amount || 150000;

  return (
    <div className="space-y-6 py-4 pb-24 text-neutral-100 font-sans bg-black">
      
      {/* Toast Alert Notice */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#111111] border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Super-Admin Inspection Mode Bar */}
      {isAdminLoggedIn && (
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-amber-600/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Super-Admin Inspection Mode
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  investor.status === 'ACTIVE'
                    ? 'bg-neutral-900 text-emerald-400 border border-neutral-700'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  Status: {investor.status}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Viewing live dashboard for <strong className="text-white">{investor.fullName}</strong> ({investor.email})
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
            {investor.status === 'PENDING' && onApproveInvestor && (
              <button
                type="button"
                onClick={() => onApproveInvestor(investor.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Activate Account</span>
              </button>
            )}

            {onReturnToAdmin && (
              <button
                type="button"
                onClick={onReturnToAdmin}
                className="px-4 py-2 text-xs font-bold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Return to Admin Console</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Global Dashboard Notice / Bulletin Broadcast Banner */}
      {adminControls?.systemNotice && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#111111] via-[#0a0a0a] to-black border border-emerald-700/80 shadow-2xl shadow-black flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
              <Megaphone className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">
                  GLOBAL DASHBOARD NOTICE
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {adminControls.lastUpdated ? `Live Bulletin · Updated ${adminControls.lastUpdated}` : 'Live Central Broadcast'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {adminControls.systemNotice}
              </p>
            </div>
          </div>
          <div className="shrink-0 self-start sm:self-auto flex items-center gap-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-neutral-900 text-emerald-300 border border-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              Live Announcement
            </span>
          </div>
        </div>
      )}

      {/* Global Admin Status Warnings (Paused or Locked) */}
      {(adminControls?.globalDividendPaused || adminControls?.globalWithdrawalsLocked) && (
        <div className="space-y-2">
          {adminControls.globalDividendPaused && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>System Notice:</strong> Central Administration has temporarily paused global dividend cycles for scheduled agro-audit. Your capital remains safe.
              </span>
            </div>
          )}
          {adminControls.globalWithdrawalsLocked && (
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-red-300 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Payout Warning:</strong> Payout withdrawals are temporarily queued by Central Operations during harvest settlement dispatch.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Two-Column Dashboard Layout (Pure Pitch Black Theme) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: User Profile, Wallet, Referrals, Actions     */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: User Profile & Pending Admin Approval Status */}
          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-inner shrink-0">
                {investor.fullName ? investor.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white truncate">
                  {investor.fullName}
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  {investor.email}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-emerald-400 text-[11px] font-medium flex items-center gap-1 hover:border-emerald-500 transition cursor-pointer"
                  >
                    <span>Referral Link</span>
                    <Copy className="w-3 h-3 text-emerald-400" />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-[11px] font-medium font-mono-nums">
                    {qualifiedReferrals}/{totalReferrals} Paid Support (₦{availableBonus.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Status Alert Box */}
            {investor.status === 'PENDING' ? (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Account Pending Admin Approval</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  You have rendered support. Admin will verify and activate your approved account.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-emerald-900 text-emerald-400 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Account Active & Verified</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Your 20-day agricultural dividend cycle is officially running.
                </p>
              </div>
            )}

            {/* USER WALLET */}
            <div className="pt-2 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  USER WALLET
                </span>
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                >
                  + Deposit NGN
                </button>
              </div>

              <div className="text-3xl font-extrabold text-white font-mono-nums tracking-tight">
                ₦{(investor.walletBalance || 0).toLocaleString()}
              </div>

              <button
                type="button"
                onClick={() => setIsEditAccountOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Edit Account Details (Bank & Phone)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Referral Program Card (Requires 3 Referrals with Support Rendered) */}
          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">
                  Referral Program (₦4,000 / Farmer)
                </h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold font-mono-nums ${
                isReferralUnlocked
                  ? 'bg-neutral-900 border-neutral-700 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-800 text-amber-400'
              }`}>
                {qualifiedReferrals}/{requiredReferrals} Rendered Support
              </span>
            </div>

            {/* 2-column metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="text-[11px] text-neutral-400 block">Total Accrued Bonus</span>
                <span className="text-sm font-black text-white font-mono-nums">
                  ₦{availableBonus.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  {qualifiedReferrals} of {totalReferrals} rendered support
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Available to Withdraw</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-emerald-400 font-mono-nums">
                    ₦{availableBonus.toLocaleString()}
                  </span>
                  {availableBonus > 0 && isReferralUnlocked && (
                    <button
                      type="button"
                      onClick={() => setIsWithdrawBonusModalOpen(true)}
                      className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow transition cursor-pointer"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Withdrawn: ₦{withdrawnTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="p-3.5 rounded-xl bg-black border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>YOUR REFERRAL LINK</span>
                </div>
                <span className="text-emerald-400 text-[11px]">
                  Share with friends & earn ₦4,000
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  className="w-full bg-[#0e0e0e] border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition flex items-center gap-1 shrink-0 cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Strict Business Rule Banner */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300 leading-snug">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Referral Bonus Policy:</span>
                  <span>
                    Referral bonus (₦4,000) is <strong className="text-emerald-400 font-bold">only added when your referred person renders support to another member</strong>. Mere registration will not add the bonus until support is provided.
                  </span>
                </div>
              </div>

              {/* Requirement Section: Exactly 3 Referrals who rendered support needed */}
              <div className="space-y-2 pt-2 border-t border-neutral-900 text-[11px]">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Withdrawal Unlock Requirement:</span>
                  <span className={`font-bold font-mono-nums ${isReferralUnlocked ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {qualifiedReferrals} of {requiredReferrals} Rendered Support
                  </span>
                </div>

                <div className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-1.5 ${
                  isReferralUnlocked
                    ? 'bg-neutral-900 border-neutral-700 text-emerald-300'
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-300/90'
                }`}>
                  {isReferralUnlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>
                    {isReferralUnlocked
                      ? 'Congratulations! You have fulfilled the 3 referrals requirement (with support rendered). Your bonus withdrawal is unlocked.'
                      : `User must get 3 referrals who have rendered support to another member before bonus withdrawal unlocks (${Math.max(0, requiredReferrals - qualifiedReferrals)} more needed).`}
                  </span>
                </div>

                {/* Main Referral Bonus Withdrawal Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isReferralUnlocked) {
                      showToast(`You must get 3 referrals who rendered support before withdrawing your bonus (${qualifiedReferrals}/3 qualified).`);
                    } else {
                      setIsWithdrawBonusModalOpen(true);
                    }
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isReferralUnlocked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {isReferralUnlocked ? (
                    <>
                      <Gift className="w-4 h-4" />
                      <span>Withdraw Referral Bonus {availableBonus > 0 ? `(₦${availableBonus.toLocaleString()})` : ''}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Withdraw Referral Bonus (Needs 3 Qualified Referrals)</span>
                    </>
                  )}
                </button>

                {/* Referral Bonus History Section */}
                <div className="pt-2 border-t border-neutral-900/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300 flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-emerald-400" /> Referral Bonus History
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {bonusHistoryWiped || bonusHistory.length === 0 ? 'History Wiped (₦0)' : `${bonusHistory.length} record(s)`}
                    </span>
                  </div>

                  {bonusHistoryWiped || bonusHistory.length === 0 ? (
                    <div className="p-2.5 rounded-xl bg-black border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Bonus history wiped clean upon withdrawal. No active bonus records.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {bonusHistory.map((rec) => (
                        <div key={rec.id} className="p-2.5 rounded-lg bg-black border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{rec.refereeName}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                rec.status === 'ACCRUED'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {rec.status === 'ACCRUED' ? 'Support Rendered' : 'Awaiting Support'}
                              </span>
                            </div>
                            <span className="text-neutral-500 font-mono text-[10px] block mt-0.5">
                              {rec.status === 'ACCRUED'
                                ? `Rendered Support: ₦${(rec.supportAmount || 100000).toLocaleString()} • ${rec.date}`
                                : `Registered • Bonus will only add when support is rendered`}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            {rec.status === 'PENDING_SUPPORT' ? (
                              <button
                                type="button"
                                onClick={() => handleSimulateRefereeRenderSupport(rec.refereeName, 100000)}
                                className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer"
                              >
                                Render Support (+₦4k)
                              </button>
                            ) : null}
                            <span className={`font-bold font-mono ${rec.status === 'ACCRUED' ? 'text-emerald-400' : 'text-amber-400/70'}`}>
                              {rec.status === 'ACCRUED' ? `+₦${rec.amount.toLocaleString()}` : '₦0 (Pending)'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick test buttons to demonstrate registration vs support rendered */}
                  <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSimulateNewPendingReferee(`Referee ${Date.now().toString().slice(-4)}`)}
                      className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      + Simulate New Referral (Registered / ₦0)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Two Action Tiles (Side by Side: Render Assistance & Get Assistance) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Tile 1: Render Assistance */}
            <div
              onClick={onOpenRenderAssistance}
              className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-emerald-500 transition cursor-pointer flex flex-col items-center text-center space-y-2 shadow-lg group"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white">Render Assistance</div>
              <span className="text-[10px] font-bold text-emerald-400 bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded-full">
                Matched to Pay
              </span>
            </div>

            {/* Tile 2: Get Assistance */}
            <div
              onClick={onOpenGetAssistance}
              className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-amber-600 transition cursor-pointer flex flex-col items-center text-center space-y-2 shadow-lg group"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white">Get Assistance</div>
              <span className="text-[10px] font-bold text-amber-400 bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded-full">
                Payer Assigned
              </span>
            </div>
          </div>

          {/* Card 4: Message Admin Desk Tile */}
          <div
            onClick={() => setIsMessageAdminOpen(true)}
            className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Message Admin Desk</div>
                <div className="text-[11px] text-neutral-400">Upload receipts & ask questions</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Card 5: Recent Activity */}
          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Recent Activity</h4>
              <button
                type="button"
                onClick={() => showToast('Displaying full activity ledger.')}
                className="text-xs text-neutral-400 hover:text-white transition cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-neutral-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Render Assistance</div>
                    <div className="text-[10px] text-neutral-500 font-mono-nums">10/25/2026</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white font-mono-nums">- ₦150,000</div>
                  <div className="text-[10px] text-neutral-400">Completed</div>
                </div>
              </div>

              {userHistory.slice(1, 3).map((hist) => (
                <div
                  key={hist.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-neutral-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{hist.sector.slice(0, 15)}...</div>
                      <div className="text-[10px] text-neutral-500 font-mono-nums">{hist.dateAssisted}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white font-mono-nums">₦{hist.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-neutral-400">{hist.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Overview, 20-Day Cycle, Matched Banners     */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Dashboard Overview Title */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Dashboard Overview
            </h2>
          </div>

          {/* 3 Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Card 1: Total Supported */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400">
                  Total Supported
                </span>
                <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono-nums">
                ₦{supportedCapital.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-400">
                Funded verified agricultural farms
              </div>
            </div>

            {/* Card 2: Total Dividend Earned */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400">
                  Total Dividend Earned
                </span>
                <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-400">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono-nums">
                ₦{accruedProfit.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-400">
                Total amount received from payouts
              </div>
            </div>

            {/* Card 3: Active Orders */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400">
                  Active Orders
                </span>
                <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono-nums">
                2
              </div>
              <div className="text-[11px] text-neutral-400">
                Pending matches for Render Assistance / Get Assistance
              </div>
            </div>

          </div>

          {/* 20-Day Dividend Growth Cycle Card */}
          <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white">
                      20-Day Dividend Growth Cycle
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-emerald-300 text-[10px] font-bold">
                      20% Dividend
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {investor.status === 'PENDING'
                      ? 'Support submitted • Awaiting admin approval to start counting'
                      : 'Cycle actively running in cluster'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-auto">
                {investor.status === 'PENDING' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-400 text-xs font-semibold flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Admin Approval</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cycle Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* Growth Progress Tracker */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <span className="text-emerald-400">🌱</span> Growth Progress: {investor.status === 'PENDING' ? '0%' : `${investor.dividendPercent}%`} Completed
                </span>
                <span className="text-amber-400 font-bold font-mono-nums">
                  {investor.status === 'PENDING' ? '0 / 20 Days (On Hold)' : `${Math.round((investor.dividendPercent / 100) * 20)} / 20 Days`}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2.5 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 transition-all duration-700 shadow-sm shadow-emerald-500/50"
                  style={{ width: `${investor.status === 'PENDING' ? 3 : Math.max(5, investor.dividendPercent)}%` }}
                />
              </div>

              {/* Milestones */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Day 1: Cycle Start</span>
                <span className="flex items-center gap-1">🌱 Day 10: Mid-Cycle</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">🚜 Day 20: Harvest Payout</span>
              </div>
            </div>

            {/* 4 Financial Metric Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  SUPPORTED CAPITAL
                </span>
                <div className="text-base font-black text-white font-mono-nums">
                  ₦{supportedCapital.toLocaleString()}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  ACCRUED PROFIT
                </span>
                <div className="text-base font-black text-emerald-400 font-mono-nums">
                  +₦{accruedProfit.toLocaleString()}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  EXPECTED (20%)
                </span>
                <div className="text-base font-black text-amber-400 font-mono-nums">
                  +₦{expectedProfit.toLocaleString()}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  MATURITY DATE
                </span>
                <div className="text-base font-bold text-white font-mono-nums">
                  {investor.withdrawalDate || '22 Nov 2026'}
                </div>
              </div>
            </div>

            {/* Sub-notice banner with Message Admin Desk button */}
            <div className="p-3.5 rounded-xl bg-black border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Support awaiting Admin Approval. Once approved, the 20-day dividend progress bar will begin counting!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMessageAdminOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-semibold text-amber-400 hover:text-white hover:border-neutral-500 transition shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Message Admin Desk
              </button>
            </div>
          </div>

          {/* Card: MATCHED PAYMENT REQUIRED (Pitch Black Card with Emerald Accent) */}
          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      MATCHED PAYMENT REQUIRED
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400 text-[10px] font-bold">
                      Action Required
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    You are matched to pay <span className="text-emerald-300">{activePayMatch.matchedWith?.investorName || 'Ugwuode Chukwuebuka Michael'}</span> <span className="font-mono-nums">₦{(activePayMatch.amount || 150000).toLocaleString()}</span>
                  </h4>
                  <p className="text-xs text-neutral-300 font-mono-nums">
                    Bank: {activePayMatch.matchedWith?.bankDetails.bankName || 'OPay'} • Acc: {activePayMatch.matchedWith?.bankDetails.accountNumber || '8062675560'} • Tel: {activePayMatch.matchedWith?.phone || '08062675560'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedMatchedOrder(activePayMatch);
                  setIsViewPayAccountOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-black flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>View Account to Pay</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card: PAYER MATCHED FOR PAYOUT (Pitch Black Card with Amber Accent) */}
          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      PAYER MATCHED FOR PAYOUT
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400 text-[10px] font-bold">
                      Paid
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    <span className="text-amber-300">{activePayoutMatch.matchedWith?.investorName || 'OKORO CALISTUS KELECHI'}</span> is scheduled to pay you <span className="font-mono-nums">₦{(activePayoutMatch.amount || 100000).toLocaleString()}</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>Payer Phone:</span>
                    <span className="px-2 py-0.5 rounded bg-black border border-neutral-700 text-amber-300 font-mono font-bold text-xs">
                      {activePayoutMatch.matchedWith?.phone || '08132662948'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMatchedOrder(activePayoutMatch);
                    setIsViewPayerPhoneOpen(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>View Payer Phone & Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmReceived(activePayoutMatch.id)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Assistance Received to Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card: Grow Wealth Through Agriculture (Farm Base Club Official Emblem) */}
          <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-neutral-800 text-center space-y-4 shadow-xl">
            <div className="flex justify-center">
              <Logo size="lg" showText={false} theme="emerald" className="scale-110" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-wide">
                Grow Wealth Through Agriculture
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
                Empowering rural and commercial farmers with financial sponsorship to increase production yields, mechanized equipment, and guarantee up to 20% dividend in a disciplined 20-day cycle for member
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800 max-w-md mx-auto">
              <div>
                <div className="text-xl font-black text-amber-400 font-mono-nums">20%</div>
                <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">MAX DIVIDEND</div>
              </div>
              <div>
                <div className="text-xl font-black text-emerald-400 font-mono-nums">20 Days</div>
                <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">GROWTH CYCLE</div>
              </div>
              <div>
                <div className="text-xl font-black text-amber-400 font-mono-nums">100%</div>
                <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">VERIFIED FARMS</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Message Admin Pill Button */}
      <button
        type="button"
        onClick={() => setIsMessageAdminOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-2xl shadow-black flex items-center gap-2 cursor-pointer transition transform hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Message Admin</span>
      </button>

      {/* ======================================================== */}
      {/* MODAL 1: Edit Account Details (Bank & Phone)              */}
      {/* ======================================================== */}
      {isEditAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0a0a] border border-neutral-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span>Edit Account Details (Bank & Phone)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditAccountOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccountDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Bank Name</label>
                <select
                  required
                  value={editBankName}
                  onChange={(e) => setEditBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Account Number (10-Digit NUBAN)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={editAccountNumber}
                  onChange={(e) => setEditAccountNumber(e.target.value)}
                  placeholder="e.g. 0123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Account Name</label>
                <input
                  type="text"
                  required
                  value={editAccountName}
                  onChange={(e) => setEditAccountName(e.target.value)}
                  placeholder="e.g. Ugwu Obinna"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Phone Number (Active on WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. 08134567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditAccountOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Deposit NGN to Wallet                            */}
      {/* ======================================================== */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0a0a] border border-neutral-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Deposit NGN to User Wallet</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDepositOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Amount to Deposit (₦)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">₦</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-sm font-bold font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {['10000', '30000', '50000', '100000', '150000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white transition"
                  >
                    ₦{parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
                Funds deposited reflect immediately on your User Wallet for agricultural support allocation or peer settlement.
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  Deposit Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: Recipient Account Details for Support            */}
      {/* Shows Recipient Phone, WhatsApp Link & Direct Message     */}
      {/* ======================================================== */}
      {isViewPayAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0a0a0a] border border-neutral-700 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                <span>Recipient Account Details for Support</span>
              </div>
              <button
                type="button"
                onClick={() => setIsViewPayAccountOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Account Details */}
            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Recipient Farmer / Member:</span>
                <span className="font-bold text-white text-sm">
                  {recipientName}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Assigned Bank:</span>
                <span className="font-bold text-emerald-400">
                  {recipientBank}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Account Number:</span>
                <span className="font-mono text-base font-black text-white select-all">
                  {recipientAccountNo}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Amount to Transfer:</span>
                <span className="font-mono text-base font-black text-amber-400">
                  ₦{matchAmount.toLocaleString()}
                </span>
              </div>

              {/* Recipient Phone Display */}
              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> Recipient Phone Number:
                </span>
                <a
                  href={`tel:${recipientPhone}`}
                  className="font-mono text-sm font-bold text-amber-300 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 hover:border-amber-500 transition"
                >
                  {recipientPhone}
                </a>
              </div>
            </div>

            {/* Quick Contact & WhatsApp Direct Message Section */}
            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Contact Recipient Directly</span>
                </div>
                <span className="text-[10px] text-neutral-400">WhatsApp or In-App</span>
              </div>

              {/* WhatsApp Direct Action Button */}
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(recipientPhone, recipientName, matchAmount)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp ({recipientPhone})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* In-App Message to Recipient's Dashboard */}
              <div className="pt-2 border-t border-neutral-850 space-y-2">
                <label className="text-[11px] font-semibold text-neutral-300 flex items-center justify-between">
                  <span>Send Direct Message to Recipient's Dashboard:</span>
                  <span className="text-[10px] text-emerald-400">Instant notification</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recipientDirectMessage}
                    onChange={(e) => setRecipientDirectMessage(e.target.value)}
                    placeholder="e.g. Hello, I have initiated the ₦150,000 transfer to your account..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0e0e0e] border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendDirectToRecipientDashboard(recipientName);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSendDirectToRecipientDashboard(recipientName)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-md"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>

                {/* Quick pre-filled prompt chips */}
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {[
                    'I have initiated transfer to your account',
                    'Please check and confirm payment receipt',
                    'Receipt uploaded for Admin verification',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRecipientDirectMessage(chip)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-neutral-300 hover:text-white transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Sent Messages History for this session */}
                {sentRecipientMessages.length > 0 && (
                  <div className="mt-2 p-2.5 rounded-xl bg-black border border-neutral-800 space-y-1.5">
                    <span className="text-[10px] font-semibold text-neutral-400 block uppercase tracking-wider">
                      Messages Delivered to Recipient's Dashboard:
                    </span>
                    {sentRecipientMessages.map((m) => (
                      <div key={m.id} className="text-xs bg-neutral-900 p-2 rounded-lg flex items-start justify-between gap-2 border border-neutral-800">
                        <div className="text-neutral-200 text-[11px] leading-snug">
                          <span className="text-emerald-400 font-semibold">You: </span>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-neutral-500 font-mono shrink-0">{m.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Proof of Payment Upload - Fully Responsive */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Proof of Payment / Transfer Note
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {proofFileUploaded ? '1 receipt attached' : 'Optional note'}
                </span>
              </div>

              <textarea
                rows={2}
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="Enter bank transaction reference number or confirmation details..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-neutral-500"
              />

              {/* Hidden file input for native device file picker */}
              <input
                type="file"
                ref={receiptFileInputRef}
                onChange={handleReceiptInputChange}
                accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
                className="hidden"
              />

              {/* Responsive Upload Dropzone / Attached State */}
              {!proofFileUploaded ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingReceipt(true);
                  }}
                  onDragLeave={() => setIsDraggingReceipt(false)}
                  onDrop={handleReceiptDrop}
                  onClick={() => {
                    if (receiptFileInputRef.current) {
                      receiptFileInputRef.current.click();
                    } else {
                      handleUseSampleReceipt();
                    }
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 group ${
                    isDraggingReceipt
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/40 scale-[1.01]'
                      : 'border-neutral-800 bg-[#070707] hover:border-emerald-500/70 hover:bg-neutral-900/50 text-neutral-400'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-950/50 group-hover:border-emerald-700/50 transition">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-emerald-400 block transition">
                        Click or drag & drop to upload payment receipt
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        PNG, JPG, WEBP, PDF up to 10MB
                      </p>
                    </div>
                    <div className="pt-1 flex items-center gap-2 flex-wrap justify-center">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                        Instant Admin verification
                      </span>
                      <button
                        type="button"
                        onClick={handleUseSampleReceipt}
                        className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 font-medium transition cursor-pointer"
                      >
                        Auto-attach sample receipt
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Responsive Attached Receipt Card */
                <div className="p-3 sm:p-4 rounded-2xl border border-emerald-500/80 bg-gradient-to-r from-emerald-950/30 via-[#0e0e0e] to-black transition-all shadow-lg shadow-emerald-950/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Thumbnail & File Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Clickable Thumbnail / Document Icon */}
                      <div
                        onClick={() => setIsReceiptPreviewOpen(true)}
                        className="w-12 h-12 rounded-xl bg-neutral-950 border border-emerald-500/50 shrink-0 overflow-hidden flex items-center justify-center cursor-pointer group/thumb relative shadow-inner"
                        title="Click to preview receipt"
                      >
                        {attachedReceiptFile?.previewUrl ? (
                          <img
                            src={attachedReceiptFile.previewUrl}
                            alt="Receipt"
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-emerald-950/50 flex flex-col items-center justify-center text-emerald-400 group-hover/thumb:scale-110 transition">
                            <FileCheck2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-[8px] font-mono font-bold mt-0.5 text-emerald-300">REC</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                          <Eye className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      </div>

                      {/* File Text Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            onClick={() => setIsReceiptPreviewOpen(true)}
                            className="text-xs sm:text-sm font-bold text-white hover:text-emerald-400 cursor-pointer truncate max-w-[150px] xs:max-w-[210px] sm:max-w-[260px] transition"
                            title={attachedReceiptFile?.name || 'transfer_receipt.png'}
                          >
                            {attachedReceiptFile?.name || 'transfer_receipt.png'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/90 border border-emerald-700/60 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Attached
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                          <span className="font-mono text-emerald-400 font-medium">
                            {attachedReceiptFile?.size || '384 KB'}
                          </span>
                          <span>•</span>
                          <span className="text-neutral-400">
                            {attachedReceiptFile?.uploadedAt || 'Ready for Admin verification'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Responsive Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setIsReceiptPreviewOpen(true)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 text-[11px] font-semibold text-emerald-300 flex items-center gap-1 transition cursor-pointer"
                        title="Preview full receipt document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => receiptFileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-[11px] font-semibold text-neutral-300 flex items-center gap-1 transition cursor-pointer"
                        title="Replace with another file"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Change</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearReceipt}
                        className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/60 border border-neutral-800 hover:border-red-600/60 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                        title="Remove attached receipt"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Responsive Modal Action Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsViewPayAccountOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition text-center cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsViewPayAccountOpen(false);
                  showToast('Payment proof submitted to Admin for rapid verification!');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/40 text-center cursor-pointer"
              >
                Submit Payment Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* RECEIPT PREVIEW LIGHTBOX MODAL                            */}
      {/* ======================================================== */}
      {isReceiptPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0c0c0c] border border-neutral-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span>Verified Payment Transfer Receipt</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptPreviewOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If uploaded custom image file exists */}
            {attachedReceiptFile?.previewUrl ? (
              <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-black p-2 flex justify-center">
                <img
                  src={attachedReceiptFile.previewUrl}
                  alt="Uploaded Transfer Receipt"
                  className="max-h-[380px] w-auto object-contain rounded-xl shadow"
                />
              </div>
            ) : null}

            {/* Authentic Nigerian Banking Transfer Receipt Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black border border-emerald-900/60 space-y-3.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
                    NIP
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">NIBSS Instant Transfer (NIP)</h5>
                    <p className="text-[10px] text-neutral-400">Electronic Funds Transfer Receipt</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-600/80 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  SUCCESSFUL
                </span>
              </div>

              {/* Transfer Amount */}
              <div className="text-center py-2 bg-[#080808] rounded-xl border border-neutral-850">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Transfer Amount</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                  ₦{matchAmount.toLocaleString()}
                </span>
              </div>

              {/* Receipt Key-Value Rows */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Recipient / Beneficiary:</span>
                  <span className="font-bold text-white text-right">{recipientName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Beneficiary Bank:</span>
                  <span className="font-semibold text-emerald-400 text-right">{recipientBank}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Account Number:</span>
                  <span className="font-mono font-bold text-white text-right">{recipientAccountNo}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Sender / Member:</span>
                  <span className="font-semibold text-white text-right">{investor.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Transaction Reference:</span>
                  <span className="font-mono text-[11px] text-neutral-300 text-right">
                    FBC-{Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-400">File Name & Size:</span>
                  <span className="font-mono text-[11px] text-emerald-400 text-right">
                    {attachedReceiptFile?.name || 'transfer_receipt.png'} ({attachedReceiptFile?.size || '384 KB'})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReceiptPreviewOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition text-center cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Receipt copy downloaded.');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: View Payer Phone & Details                       */}
      {/* ======================================================== */}
      {isViewPayerPhoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0a0a] border border-neutral-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>Payer Contact & Assistance Details</span>
              </div>
              <button
                type="button"
                onClick={() => setIsViewPayerPhoneOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Assigned Payer Name:</span>
                <span className="font-bold text-white text-sm">
                  {selectedMatchedOrder?.matchedWith?.investorName || 'OKORO CALISTUS KELECHI'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Expected Payout Amount:</span>
                <span className="font-mono text-base font-black text-amber-400">
                  ₦{(selectedMatchedOrder?.amount || 100000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Payer Telephone:</span>
                <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-amber-300 font-mono font-bold text-sm">
                  {selectedMatchedOrder?.matchedWith?.phone || '08132662948'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              You can contact the paying member directly via phone call or WhatsApp to confirm transfer arrival into your bank account.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsViewPayerPhoneOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: Message Admin Desk                               */}
      {/* ======================================================== */}
      {isMessageAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border border-neutral-700 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Message Admin Desk (Support & Receipts)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMessageAdminOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessageToAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Subject</label>
                <input
                  type="text"
                  required
                  value={adminSubject}
                  onChange={(e) => setAdminSubject(e.target.value)}
                  placeholder="e.g. Inquire about harvest dividend or match proof"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Type your message, query, or attach payment confirmation details here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-700 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
                Messages sent here land directly in the Central Administrator mailbox on the Admin Dashboard for prioritized review.
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMessageAdminOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: Withdraw Referral Bonus & Wipe Bonus History    */}
      {/* ======================================================== */}
      {isWithdrawBonusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0a0a] border border-neutral-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Gift className="w-5 h-5 text-amber-400" />
                <span>Withdraw Referral Bonus</span>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawBonusModalOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Available Referral Bonus:</span>
                <span className="font-mono text-xl font-black text-emerald-400">
                  ₦{availableBonus.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Payout Destination Bank:</span>
                <span className="font-semibold text-white text-right">
                  {investor.bankDetails.bankName || 'Access Bank Plc'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Account Number:</span>
                <span className="font-mono text-white text-right">
                  {investor.bankDetails.accountNumber || '0123456789'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Beneficiary Name:</span>
                <span className="font-semibold text-neutral-300">
                  {investor.bankDetails.accountName || investor.fullName}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Support Rendered Referrals:</span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {qualifiedReferrals} of {requiredReferrals} Qualified
                </span>
              </div>
            </div>

            {/* Crucial wipe notice */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 space-y-1.5 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Bonus History Will Be Wiped</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Once bonus withdrawal is processed, your referral bonus balance resets to ₦0 and your referral bonus accrual history will be completely wiped clean. Only bonuses from referrals who rendered support to another person are withdrawable.
              </p>
            </div>

            {/* Bonus History items to be wiped */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1 text-neutral-300">
                  <History className="w-3.5 h-3.5 text-emerald-400" /> Active Bonus Ledger
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {bonusHistory.length} Record{bonusHistory.length === 1 ? '' : 's'}
                </span>
              </div>

              {bonusHistory.length === 0 ? (
                <div className="p-3 rounded-xl bg-black border border-neutral-800 text-center text-xs text-neutral-500">
                  Bonus history has already been wiped clean.
                </div>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {bonusHistory.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-2 rounded-lg bg-black border border-neutral-800 text-xs">
                      <div>
                        <div className="font-semibold text-white">{rec.refereeName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {rec.status === 'ACCRUED' ? `Support Paid • ${rec.date}` : `Awaiting Support`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold font-mono ${rec.status === 'ACCRUED' ? 'text-emerald-400' : 'text-amber-400/70'}`}>
                          {rec.status === 'ACCRUED' ? `+₦${rec.amount.toLocaleString()}` : '₦0'}
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          rec.status === 'ACCRUED'
                            ? 'bg-neutral-900 text-emerald-400 border border-neutral-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {rec.status === 'ACCRUED' ? 'Support Rendered' : 'Awaiting Support'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2">
              {availableBonus === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setBonusHistory([
                      { id: 'test-1', refereeName: 'Adeola Johnson', amount: 4000, date: '2026-10-27', status: 'ACCRUED', supportRendered: true, supportAmount: 100000 },
                      { id: 'test-2', refereeName: 'Ngozi Okafor', amount: 4000, date: '2026-10-28', status: 'ACCRUED', supportRendered: true, supportAmount: 100000 },
                      { id: 'test-3', refereeName: 'Musa Garba', amount: 4000, date: '2026-10-28', status: 'ACCRUED', supportRendered: true, supportAmount: 100000 },
                    ]);
                    setBonusHistoryWiped(false);
                    showToast('Demo 3 referrals with support rendered added for withdrawal testing.');
                  }}
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-300 font-medium transition text-center cursor-pointer"
                >
                  Add Test Qualified Referrals (₦12,000)
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsWithdrawBonusModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmWithdrawBonus}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Withdrawal & Wipe Bonus History</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
