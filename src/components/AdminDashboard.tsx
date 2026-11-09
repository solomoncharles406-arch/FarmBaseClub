import React, { useState } from 'react';
import { Investor, AssistanceOrder, AdminControls, ContactInquiry, LiveAssistanceActivity, ReferralWithdrawalRequest } from '../types';
import { UploadLandingFeedModal } from './UploadLandingFeedModal';
import {
  ShieldCheck,
  Pause,
  Play,
  Lock,
  Unlock,
  MessageSquare,
  Users,
  HandCoins,
  Download,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Building2,
  CreditCard,
  Phone,
  Mail,
  UserCheck,
  User,
  Sliders,
  Trash2,
  Search,
  ExternalLink,
  Check,
  RotateCcw,
  Inbox,
  Filter,
  Eye,
  Ban,
  Clock,
  Layers,
  ArrowUpRight,
  Plus,
  Megaphone,
  Bell,
  UploadCloud,
  FileCheck2,
  X,
  FileText,
} from 'lucide-react';

interface AdminDashboardProps {
  investors: Investor[];
  assistanceOrders: AssistanceOrder[];
  adminControls: AdminControls;
  contactInquiries?: ContactInquiry[];
  liveActivities?: LiveAssistanceActivity[];
  referralWithdrawalRequests?: ReferralWithdrawalRequest[];
  onApproveReferralWithdrawal?: (requestId: string) => void;
  onRejectReferralWithdrawal?: (requestId: string, reason?: string) => void;
  onUpdateLiveActivities?: (activities: LiveAssistanceActivity[]) => void;
  onUpdateAdminControls: (controls: Partial<AdminControls>) => void;
  onToggleUserDividendPause: (investorId: string) => void;
  onToggleUserWithdrawalLock: (investorId: string) => void;
  onUpdateUserDividendPercent: (investorId: string, percent: number) => void;
  onSendDirectMessage: (targetId: string | 'all', title: string, message: string) => void;
  onMatchAssistanceOrders: (renderOrderId: string, getOrderId: string) => void;
  onConfirmAssistanceSettlement: (orderId: string) => void;
  onMarkInquiryRead?: (id: string, read: boolean) => void;
  onToggleInquiryResolved?: (id: string) => void;
  onDeleteInquiry?: (id: string) => void;
  onExitAdmin: () => void;
  onApproveInvestor?: (investorId: string) => void;
  onViewUserDashboard?: (investor: Investor) => void;
  onDeleteInvestor?: (investorId: string) => void;
  onApproveFarmSupport?: (investorId: string, orderId?: string) => void;
  onCreatePeerMatch?: (
    supporterId: string,
    recipientId: string,
    amount: number,
    payerPhone: string,
    recipientBank: { bankName: string; accountNumber: string; accountName: string; phone: string }
  ) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  investors,
  assistanceOrders,
  adminControls,
  contactInquiries = [],
  liveActivities = [],
  referralWithdrawalRequests = [],
  onApproveReferralWithdrawal,
  onRejectReferralWithdrawal,
  onUpdateLiveActivities,
  onUpdateAdminControls,
  onToggleUserDividendPause,
  onToggleUserWithdrawalLock,
  onUpdateUserDividendPercent,
  onSendDirectMessage,
  onMatchAssistanceOrders,
  onConfirmAssistanceSettlement,
  onMarkInquiryRead,
  onToggleInquiryResolved,
  onDeleteInquiry,
  onExitAdmin,
  onApproveInvestor,
  onViewUserDashboard,
  onDeleteInvestor,
  onApproveFarmSupport,
  onCreatePeerMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'matching' | 'mailbox' | 'payouts' | 'users'>('overview');
  const [isUploadFeedOpen, setIsUploadFeedOpen] = useState(false);

  // Peer-to-Peer Account Matching Desk state (matching Screenshot_2026-10-27_162714_5c5cc47b.png)
  const [selectedSupporterId, setSelectedSupporterId] = useState<string>('');
  const [payerPhoneNumber, setPayerPhoneNumber] = useState<string>('');

  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [recipientBankName, setRecipientBankName] = useState<string>('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState<string>('');
  const [recipientAccountName, setRecipientAccountName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');

  const [matchAmount, setMatchAmount] = useState<string>('50000');
  const [matchSuccessAlert, setMatchSuccessAlert] = useState<string | null>(null);

  // Messaging form state
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [msgTitle, setMsgTitle] = useState('Central Harvest Operations Update');
  const [msgBody, setMsgBody] = useState('');
  const [msgSentNotice, setMsgSentNotice] = useState(false);

  // Mailbox states
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(
    contactInquiries.length > 0 ? contactInquiries[0].id : ''
  );
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'unread' | 'resolved'>('all');
  const [inquirySearch, setInquirySearch] = useState('');

  // Manual matching selections
  const [selectedRenderId, setSelectedRenderId] = useState<string>('');
  const [selectedGetId, setSelectedGetId] = useState<string>('');

  // Search/Filter for Registered Users
  const [userSearch, setUserSearch] = useState('');

  // Permanent Account Deletion State
  const [investorToDelete, setInvestorToDelete] = useState<Investor | null>(null);

  // Admin Proof of Payment Lightbox Preview State
  const [selectedProofPreview, setSelectedProofPreview] = useState<{
    orderId: string;
    receiptUrl?: string;
    receiptName?: string;
    note?: string;
    payerName?: string;
    recipientName?: string;
    amount?: number;
    date?: string;
    recipientConfirmed?: boolean;
    payerPhone?: string;
    recipientPhone?: string;
    bankName?: string;
    accountNumber?: string;
  } | null>(null);

  // Quick system notice state & feedback
  const [systemNoticeInput, setSystemNoticeInput] = useState(adminControls.systemNotice || '');
  const [bulletinSaved, setBulletinSaved] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const handleUpdateBulletin = () => {
    const notice = systemNoticeInput.trim();
    if (!notice) return;

    onUpdateAdminControls({ systemNotice: notice });

    if (onSendDirectMessage) {
      onSendDirectMessage('all', 'Central Dashboard Bulletin Notice', notice);
    }

    setBulletinSaved(true);
    setAdminToast('Global Dashboard Bulletin successfully updated and broadcast to all user dashboards!');
    setTimeout(() => setBulletinSaved(false), 3500);
    setTimeout(() => setAdminToast(null), 4500);
  };

  const handleSelectSupporter = (id: string) => {
    setSelectedSupporterId(id);
    const user = investors.find((inv) => inv.id === id);
    if (user) {
      setPayerPhoneNumber(user.phone || '');
      if (user.activeAssistance > 0) {
        setMatchAmount(user.activeAssistance.toString());
      }
    } else {
      setPayerPhoneNumber('');
    }
  };

  const handleSelectRecipient = (id: string) => {
    setSelectedRecipientId(id);
    const user = investors.find((inv) => inv.id === id);
    if (user) {
      setRecipientBankName(user.bankDetails.bankName || '');
      setRecipientAccountNumber(user.bankDetails.accountNumber || '');
      setRecipientAccountName(user.bankDetails.accountName || user.fullName);
      setRecipientPhone(user.phone || '');
    } else {
      setRecipientBankName('');
      setRecipientAccountNumber('');
      setRecipientAccountName('');
      setRecipientPhone('');
    }
  };

  const handleResetMatchForm = () => {
    setSelectedSupporterId('');
    setPayerPhoneNumber('');
    setSelectedRecipientId('');
    setRecipientBankName('');
    setRecipientAccountNumber('');
    setRecipientAccountName('');
    setRecipientPhone('');
    setMatchAmount('50000');
    setMatchSuccessAlert(null);
  };

  const handleCreatePeerMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupporterId || !selectedRecipientId) {
      alert('Please select both a Supporter user and a Recipient user.');
      return;
    }
    const amt = parseFloat(matchAmount) || 50000;
    if (onCreatePeerMatch) {
      onCreatePeerMatch(selectedSupporterId, selectedRecipientId, amt, payerPhoneNumber, {
        bankName: recipientBankName,
        accountNumber: recipientAccountNumber,
        accountName: recipientAccountName,
        phone: recipientPhone,
      });
    }

    const supporterUser = investors.find((i) => i.id === selectedSupporterId);
    const recipientUser = investors.find((i) => i.id === selectedRecipientId);
    setMatchSuccessAlert(
      `Peer Match successfully established! ${supporterUser?.fullName || 'Supporter'} paired to pay ₦${amt.toLocaleString()} to ${recipientUser?.fullName || 'Recipient'}.`
    );
    setTimeout(() => {
      setMatchSuccessAlert(null);
    }, 6000);
  };

  const renderOrders = assistanceOrders.filter((o) => o.type === 'RENDER');
  const getOrders = assistanceOrders.filter((o) => o.type === 'GET');

  const pendingRender = renderOrders.filter((o) => o.status === 'WAITING_MATCH');
  const pendingGet = getOrders.filter((o) => o.status === 'WAITING_MATCH');
  const matchedOrders = assistanceOrders.filter((o) => o.status === 'MATCHED' || o.status === 'PAYMENT_PENDING');
  const proofPendingOrders = assistanceOrders.filter(
    (o) =>
      o.status !== 'CONFIRMED' &&
      !o.adminApproved &&
      Boolean(
        o.proofSubmitted ||
        o.matchedWith?.proofSubmitted ||
        o.status === 'PAYMENT_PENDING' ||
        o.proofReceiptUrl ||
        o.matchedWith?.proofReceiptUrl
      )
  );
  const pendingApprovalCount = investors.filter((inv) => inv.status === 'PENDING').length;
  const pendingReferrals = referralWithdrawalRequests.filter((r) => r.status === 'PENDING');

  // Safe Platform Balance calculation - NEVER NaN
  const platformBalance = investors.reduce((sum, inv) => sum + (Number(inv.activeAssistance) || 0), 0);
  const totalSupportCount = renderOrders.length;

  // Active Farm Support list: investors with activeAssistance or render orders
  const farmSupportList = investors
    .filter((inv) => inv.activeAssistance > 0)
    .map((inv) => {
      const relatedOrder = renderOrders.find((o) => o.investorId === inv.id);
      return {
        id: relatedOrder?.id || `farm-support-${inv.id}`,
        orderId: relatedOrder?.id,
        investorId: inv.id,
        name: inv.fullName,
        email: inv.email,
        amount: inv.activeAssistance,
        expectedRedeem: Math.round(inv.activeAssistance * 1.20),
        status: inv.status,
      };
    });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle || !msgBody) return;
    onSendDirectMessage(selectedTarget, msgTitle, msgBody);
    setMsgSentNotice(true);
    setTimeout(() => {
      setMsgSentNotice(false);
      setMsgBody('');
    }, 2500);
  };

  const handleAutoMatch = () => {
    if (pendingRender.length > 0 && pendingGet.length > 0) {
      onMatchAssistanceOrders(pendingRender[0].id, pendingGet[0].id);
    }
  };

  const handleManualMatch = () => {
    if (selectedRenderId && selectedGetId) {
      onMatchAssistanceOrders(selectedRenderId, selectedGetId);
      setSelectedRenderId('');
      setSelectedGetId('');
    }
  };

  const filteredInvestors = investors.filter((inv) => {
    if (!userSearch) return true;
    const term = userSearch.toLowerCase();
    return (
      inv.fullName.toLowerCase().includes(term) ||
      inv.email.toLowerCase().includes(term) ||
      inv.phone.includes(term) ||
      inv.bankDetails.bankName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 py-6 pb-20 relative">

      {/* Admin Floating Toast Notification */}
      {adminToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}
      
      {/* Admin Top Header & Master Switch Strip */}
      <section className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/50">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                  Administrator Super-Console
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                  AUTHENTICATED · SECURE SESSION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Farm Base Club Central Operations
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUploadFeedOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer"
              title="Upload and manage custom names and amounts for the landing page movable feed"
            >
              <UploadCloud className="w-4 h-4 text-white" />
              <span>Upload Landing Names & Amounts</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white bg-black hover:bg-neutral-900 border border-neutral-800 rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-400" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Master Controls: Dividend Pause, Withdrawal Lock, Global Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className={`p-4 rounded-2xl border transition ${
            adminControls.globalDividendPaused
              ? 'bg-amber-950/30 border-amber-600'
              : 'bg-black border-neutral-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Global Dividend Flow
                </span>
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  {adminControls.globalDividendPaused ? (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <Pause className="w-4 h-4" /> Dividends Paused
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Play className="w-4 h-4" /> Normal Growth Active
                    </span>
                  )}
                </h4>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateAdminControls({
                    globalDividendPaused: !adminControls.globalDividendPaused,
                  })
                }
                className={`px-3 py-2 text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5 ${
                  adminControls.globalDividendPaused
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {adminControls.globalDividendPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume Growth
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Dividends
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition ${
            adminControls.globalWithdrawalsLocked
              ? 'bg-red-950/40 border-red-600'
              : 'bg-black border-neutral-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Payout Withdrawals
                </span>
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  {adminControls.globalWithdrawalsLocked ? (
                    <span className="text-red-400 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> Withdrawals Stopped
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Unlock className="w-4 h-4" /> Withdrawals Enabled
                    </span>
                  )}
                </h4>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateAdminControls({
                    globalWithdrawalsLocked: !adminControls.globalWithdrawalsLocked,
                  })
                }
                className={`px-3 py-2 text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5 shrink-0 ${
                  adminControls.globalWithdrawalsLocked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {adminControls.globalWithdrawalsLocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" /> Unlock Payouts
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Stop Withdrawals
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                  Global Dashboard Notice
                </span>
                {bulletinSaved && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> Published
                  </span>
                )}
              </div>
              <input
                type="text"
                value={systemNoticeInput}
                onChange={(e) => setSystemNoticeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUpdateBulletin();
                  }
                }}
                placeholder="Broadcast banner on all dashboards..."
                className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-lg text-white text-xs placeholder-neutral-500 focus:outline-none transition"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdateBulletin}
              className={`mt-2 w-full py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                bulletinSaved
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30 font-extrabold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 active:scale-95'
              }`}
            >
              {bulletinSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Bulletin Updated & Broadcast!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Update Dashboard Bulletin</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Tab Navigation matching Screenshot 1 */}
        <div className="flex items-center gap-2 sm:gap-3 pt-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'overview' as const, label: 'Overview & Financials', icon: Layers },
            {
              id: 'matching' as const,
              label: 'Peer Matching & Proofs',
              icon: Users,
              badge: proofPendingOrders.length > 0 ? `${proofPendingOrders.length} Proofs` : (pendingRender.length > 0 ? `${pendingRender.length} New` : undefined),
            },
            {
              id: 'mailbox' as const,
              label: 'User Inquiries & Chat',
              icon: MessageSquare,
              badge: contactInquiries.filter((inq) => !inq.read).length ? `${contactInquiries.filter((inq) => !inq.read).length}` : undefined,
            },
            {
              id: 'payouts' as const,
              label: `Pending Payouts (${pendingGet.length + pendingReferrals.length})`,
              icon: ArrowUpRight,
              badge: pendingReferrals.length > 0 ? `${pendingReferrals.length} Bonus Req` : undefined,
            },
            {
              id: 'users' as const,
              label: `Registered Users (${investors.length})`,
              icon: Users,
              badge: pendingApprovalCount > 0 ? `${pendingApprovalCount} Pending` : undefined,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-black shadow-md font-bold'
                  : 'bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-emerald-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === tab.id ? 'bg-black text-emerald-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* TAB 1: Overview & Financials (Screenshot 1) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Landing Page Movable Names Action Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#07130b] via-[#091a0e] to-[#06120a] border border-emerald-800/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-950 border border-emerald-600/70 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-white">
                    Landing Page Movable Names & Amounts Feed
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                    Live Ticker
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {(liveActivities || []).length} peer names & amounts actively scrolling on the public homepage. Upload CSV/text or add custom names independently from registered accounts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadFeedOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-950/60 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload & Manage Names</span>
            </button>
          </div>
          
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Users */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
              <span className="text-xs text-neutral-400 font-medium">Total Users</span>
              <div className="text-3xl font-extrabold text-white font-mono-nums">
                {investors.length}
              </div>
            </div>

            {/* Platform Balance */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
              <span className="text-xs text-neutral-400 font-medium">Platform Balance</span>
              <div className="text-3xl font-extrabold text-white font-mono-nums">
                ₦{platformBalance.toLocaleString()}
              </div>
            </div>

            {/* Total Render Assistance */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
              <span className="text-xs text-neutral-400 font-medium">Total Render Assistance</span>
              <div className="text-3xl font-extrabold text-emerald-500 font-mono-nums">
                {totalSupportCount}
              </div>
            </div>

            {/* Total Get Assistance (GA) */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-2">
              <span className="text-xs text-neutral-400 font-medium">Total Get Assistance (GA)</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono-nums">
                {pendingGet.length}
              </div>
            </div>

          </div>

          {/* Two Columns: Pending Payout Requests vs Active Render Assistance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Card: Pending Payout Requests (Get Assistance) */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Pending Payout Requests (Get Assistance)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold text-[11px]">
                      <th className="pb-3 pr-4">USER</th>
                      <th className="pb-3 px-3">AMOUNT</th>
                      <th className="pb-3 px-3">STATUS</th>
                      <th className="pb-3 pl-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingGet.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-sm text-neutral-400 font-medium">
                          No pending requests
                        </td>
                      </tr>
                    ) : (
                      pendingGet.map((order) => (
                        <tr key={order.id} className="border-b border-neutral-900/60 hover:bg-neutral-900/30">
                          <td className="py-3.5 pr-4">
                            <div className="font-bold text-white text-sm">{order.investorName}</div>
                            <div className="text-xs text-neutral-400">{order.phone}</div>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-amber-400 text-sm">
                            ₦{order.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                              Pending Match
                            </span>
                          </td>
                          <td className="py-3.5 pl-3 text-right">
                            <button
                              onClick={() => {
                                setActiveTab('matching');
                                setSelectedGetId(order.id);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                            >
                              Match Recipient
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Card: Active Render Assistance */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Active Render Assistance
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold text-[11px]">
                      <th className="pb-3 pr-3">USER</th>
                      <th className="pb-3 px-3">AMOUNT</th>
                      <th className="pb-3 px-3">EXPECTED GET ASSISTANCE</th>
                      <th className="pb-3 px-3">STATUS / CYCLE</th>
                      <th className="pb-3 pl-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900/60">
                    {farmSupportList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-neutral-500 text-xs">
                          No active render assistance pledges currently.
                        </td>
                      </tr>
                    ) : (
                      farmSupportList.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-900/30">
                        <td className="py-3.5 pr-3">
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <div className="text-xs text-neutral-400">{item.email}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 text-sm">
                          ₦{item.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                          ₦{item.expectedRedeem.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3">
                          {item.status === 'PENDING' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              Pending Admin Approval
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 inline-flex items-center gap-1 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved (20d Active)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pl-3 text-right">
                          {item.status === 'PENDING' ? (
                            <button
                              type="button"
                              onClick={() => onApproveFarmSupport?.(item.investorId, item.orderId)}
                              className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-md shadow-emerald-950/50 flex items-center gap-1.5 ml-auto whitespace-nowrap"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve (Start 20d)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const matchedInv = investors.find((inv) => inv.id === item.investorId);
                                if (matchedInv) onViewUserDashboard?.(matchedInv);
                              }}
                              className="px-3.5 py-1.5 text-xs font-bold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 rounded-lg transition flex items-center gap-1.5 ml-auto whitespace-nowrap"
                            >
                              <span>View Dashboard</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Registered Users (Screenshot 2) */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Registered Users
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Monitor user investments, 20-day returns, referrals, and account status
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter users..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-black border border-neutral-800 text-xs text-white focus:border-emerald-500 w-44"
                />
              </div>

              <span className="text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg">
                View All ({investors.length})
              </span>
            </div>
          </div>

          {/* User List Cards matching Screenshot 2 */}
          <div className="space-y-3">
            {filteredInvestors.map((inv) => {
              const expectedReturns = inv.activeAssistance > 0 ? Math.round(inv.activeAssistance * 1.20) : 0;
              return (
                <div
                  key={inv.id}
                  className="p-4 sm:p-5 rounded-xl bg-black border border-neutral-800/80 hover:border-emerald-500/40 transition flex flex-col xl:flex-row xl:items-center justify-between gap-4"
                >
                  {/* Column 1: User info */}
                  <div className="space-y-1 min-w-[240px]">
                    <div className="text-base font-bold text-white uppercase tracking-wide">
                      {inv.fullName}
                    </div>
                    <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
                      <span>{inv.email}</span>
                      <span>•</span>
                      <span>{inv.phone}</span>
                    </div>
                    <div className="text-xs text-neutral-300">
                      {inv.bankDetails.bankName}: <span className="font-mono text-neutral-200">{inv.bankDetails.accountNumber}</span> ({inv.bankDetails.accountName})
                    </div>
                  </div>

                  {/* Column 2: Status */}
                  <div className="space-y-1 min-w-[160px]">
                    <div>
                      {inv.status === 'PENDING' ? (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Pending Approval
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {inv.activeAssistance > 0 ? `Active Support: ₦${inv.activeAssistance.toLocaleString()}` : 'No support rendered yet'}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      User
                    </div>
                  </div>

                  {/* Column 3: Financials */}
                  <div className="grid grid-cols-3 gap-4 min-w-[280px]">
                    <div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        ₦{inv.activeAssistance.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Active Support
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-amber-400 font-mono">
                        ₦{expectedReturns.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {inv.status === 'PENDING' ? 'Cycle on hold' : '20-Day Cycle'}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white font-mono">
                        {inv.referralCount} Ref
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        +₦{inv.referralEarnings.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Actions Buttons matching Screenshot 2 */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Approve Button */}
                    <button
                      type="button"
                      onClick={() => onApproveInvestor?.(inv.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                        inv.status === 'PENDING'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                      }`}
                      title={inv.status === 'PENDING' ? 'Approve and activate this account' : 'Account is active'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{inv.status === 'PENDING' ? 'Approve' : 'Approved'}</span>
                    </button>

                    {/* View Dashboard Button */}
                    <button
                      type="button"
                      onClick={() => onViewUserDashboard?.(inv)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/90 border border-amber-700/80 transition flex items-center gap-1.5 shadow-md"
                      title="View user dashboard directly as admin"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Dashboard</span>
                    </button>

                    {/* Quick Utility Icon Buttons */}
                    <button
                      type="button"
                      onClick={() => onToggleUserDividendPause(inv.id)}
                      className={`p-2 rounded-lg border transition ${
                        inv.dividendPaused
                          ? 'bg-amber-950 border-amber-600 text-amber-400'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={inv.dividendPaused ? 'Resume Dividend Growth' : 'Pause Dividend Growth'}
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleUserWithdrawalLock(inv.id)}
                      className={`p-2 rounded-lg border transition ${
                        inv.withdrawalLocked
                          ? 'bg-red-950 border-red-600 text-red-400'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={inv.withdrawalLocked ? 'Unlock Withdrawals' : 'Lock Withdrawals'}
                    >
                      {inv.withdrawalLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTarget(inv.id);
                        setActiveTab('mailbox');
                      }}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-400 transition"
                      title="Send Direct Message to this user"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setInvestorToDelete(inv)}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-600 transition cursor-pointer"
                      title="Permanently delete user account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredInvestors.length === 0 && (
              <div className="py-12 text-center space-y-2 border border-dashed border-neutral-800 rounded-2xl bg-black">
                <Users className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm font-semibold text-neutral-300">No registered accounts</p>
                <p className="text-xs text-neutral-500">All recent dummy accounts have been cleared. Newly registered users will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Peer Matching Desk (Exact replica of Screenshot_2026-10-27_162714_5c5cc47b.png) */}
      {activeTab === 'matching' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreatePeerMatch}
            className="p-6 sm:p-8 rounded-3xl bg-[#09150d] border border-emerald-900/40 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    Peer-to-Peer Account Matching Desk
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Match any supporter to pay directly into another user's bank account, and assign the payer's phone number for the receiver to contact.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetMatchForm}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition shrink-0"
                title="Reset Match Form"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Notification alert if match created */}
            {matchSuccessAlert && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{matchSuccessAlert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMatchSuccessAlert(null)}
                  className="text-neutral-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 2 Main Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Supporter */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#061009] border border-emerald-900/50 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    1. SUPPORTER (USER WHO WILL PAY)
                  </span>
                  <span className="text-xs text-neutral-400">
                    Displays on "Support"
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300 block">
                    Select Supporting User
                  </label>
                  <select
                    value={selectedSupporterId}
                    onChange={(e) => handleSelectSupporter(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Choose Supporter --</option>
                    {investors.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.fullName} ({inv.email}) {inv.activeAssistance > 0 ? `· Active: ₦${inv.activeAssistance.toLocaleString()}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300 block">
                    Payer's Phone Number <span className="text-amber-400">(Visible to Receiver on Redeem Support)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={payerPhoneNumber}
                      onChange={(e) => setPayerPhoneNumber(e.target.value)}
                      placeholder="e.g. +2348031234567"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono-nums"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Admin can enter or modify the phone number the receiver will see when clicking "Redeem Support".
                  </p>
                </div>
              </div>

              {/* Card 2: Recipient */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#061009] border border-emerald-900/50 space-y-4">
                <div className="flex items-center justify-between gap-2 pb-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    2. RECIPIENT (USER TO BE PAID)
                  </span>
                  <span className="text-xs text-neutral-400">
                    Account details given to Supporter
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300 block">
                    Select Recipient User
                  </label>
                  <select
                    value={selectedRecipientId}
                    onChange={(e) => handleSelectRecipient(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Choose Recipient --</option>
                    {investors.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.fullName} ({inv.bankDetails?.bankName || 'No bank assigned'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2-column: Bank Name & Account Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300 block">Bank Name</label>
                    <input
                      type="text"
                      value={recipientBankName}
                      onChange={(e) => setRecipientBankName(e.target.value)}
                      placeholder="e.g. Access Bank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300 block">Account Number</label>
                    <input
                      type="text"
                      value={recipientAccountNumber}
                      onChange={(e) => setRecipientAccountNumber(e.target.value)}
                      placeholder="e.g. 0123456789"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono-nums"
                    />
                  </div>
                </div>

                {/* 2-column: Account Name & Recipient Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300 block">Account Name</label>
                    <input
                      type="text"
                      value={recipientAccountName}
                      onChange={(e) => setRecipientAccountName(e.target.value)}
                      placeholder="e.g. Chioma Eze"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300 block">Recipient Phone</label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="e.g. +2348012345678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white text-xs sm:text-sm placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono-nums"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar: Amount + Create Match Button */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#061009] border border-emerald-900/50 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 w-full sm:w-72">
                <label className="text-xs font-medium text-neutral-300 block">
                  Amount to Match (NGN)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    value={matchAmount}
                    onChange={(e) => setMatchAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#09170e] border border-emerald-900/60 text-white font-bold text-sm placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono-nums"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Peer Match</span>
              </button>
            </div>
          </form>

          {/* Payment Proofs & Verifications Awaiting Admin Review */}
          {proofPendingOrders.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#09150d] border-2 border-emerald-500/70 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">Payment Proofs Awaiting Verification</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-xs font-black">
                        {proofPendingOrders.length} Ready
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/80">
                      View uploaded receipts and approve to immediately start the user's 20-day growth progress.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proofPendingOrders.map((ord) => {
                  const payer = ord.type === 'RENDER' ? ord.investorName : ord.matchedWith?.investorName || '';
                  const payerPhone = ord.type === 'RENDER' ? ord.phone : ord.matchedWith?.phone || '';
                  const recipient = ord.type === 'GET' ? ord.investorName : ord.matchedWith?.investorName || '';
                  const bank = ord.bankDetails.bankName;
                  const accNo = ord.bankDetails.accountNumber;
                  const accName = ord.bankDetails.accountName;
                  const isRecipientConfirmed = Boolean(ord.recipientConfirmed || ord.matchedWith?.recipientConfirmed);
                  const proofImg = ord.proofReceiptUrl || ord.matchedWith?.proofReceiptUrl;
                  const proofFileName = ord.proofReceiptName || ord.matchedWith?.proofReceiptName || 'transfer_receipt.png';
                  const proofNoteText = ord.proofNote || ord.matchedWith?.proofNote || ord.proofOfPaymentNote;

                  return (
                    <div key={ord.id} className="p-4 rounded-xl bg-black border border-emerald-800/80 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                        <span className="font-mono text-xs text-neutral-400">Order: {ord.id}</span>
                        <span className="font-mono text-base font-black text-emerald-400">₦{ord.amount.toLocaleString()}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Payer (Growth will start):</span>
                          <span className="font-bold text-white">{payer}</span>
                          <p className="font-mono text-[11px] text-neutral-400">{payerPhone}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Demanding Recipient:</span>
                          <span className="font-bold text-white">{recipient}</span>
                          <p className="text-[11px] text-neutral-400 truncate">{bank} - {accNo}</p>
                        </div>
                      </div>

                      {/* Recipient Confirmation Pill */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-neutral-400">Recipient Confirmation:</span>
                        {isRecipientConfirmed ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Confirmed Received
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700 text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> Confirmation Pending
                          </span>
                        )}
                      </div>

                      {/* Proof Thumbnail & Note */}
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{proofFileName}</p>
                            {proofNoteText && <p className="text-[10px] text-amber-300 truncate font-mono">Ref: {proofNoteText}</p>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedProofPreview({
                            orderId: ord.id,
                            receiptUrl: proofImg,
                            receiptName: proofFileName,
                            note: proofNoteText,
                            payerName: payer,
                            recipientName: recipient,
                            amount: ord.amount,
                            date: ord.proofSubmittedAt || ord.matchedWith?.proofSubmittedAt,
                            recipientConfirmed: isRecipientConfirmed,
                            payerPhone,
                            bankName: bank,
                            accountNumber: accNo,
                          })}
                          className="px-2.5 py-1 rounded bg-black hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 text-xs text-emerald-300 font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Receipt</span>
                        </button>
                      </div>

                      {/* Primary Admin Approval Action */}
                      <button
                        type="button"
                        onClick={() => {
                          onConfirmAssistanceSettlement(ord.id);
                          setAdminToast(`Approved! ${payer}'s 20-day growth progress is now active and counting.`);
                          setTimeout(() => setAdminToast(null), 4000);
                        }}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Payment Proof & Start Growth Progress</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Matched Assignments */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <h4 className="text-base font-bold text-white">Active Matched Assignments</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Offering Payer (Render)</th>
                    <th className="py-2.5 px-3">Demanding Recipient (Get)</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Beneficiary Bank Details</th>
                    <th className="py-2.5 px-3">Proof of Payment</th>
                    <th className="py-2.5 px-3">Recipient Confirmed?</th>
                    <th className="py-2.5 px-3">Payment Status</th>
                    <th className="py-2.5 px-3">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono-nums">
                  {matchedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-xs text-neutral-500">
                        No active matched assignments awaiting confirmation.
                      </td>
                    </tr>
                  ) : (
                    matchedOrders.map((ord) => {
                      const payer = ord.type === 'RENDER' ? ord.investorName : ord.matchedWith?.investorName || '';
                      const payerPhone = ord.type === 'RENDER' ? ord.phone : ord.matchedWith?.phone || '';
                      const recipient = ord.type === 'GET' ? ord.investorName : ord.matchedWith?.investorName || '';
                      const isConfirmed = ord.status === 'CONFIRMED' || Boolean(ord.adminApproved);
                      const isRecipientConfirmed = Boolean(ord.recipientConfirmed || ord.matchedWith?.recipientConfirmed);
                      const hasProof = Boolean(ord.proofSubmitted || ord.matchedWith?.proofSubmitted || ord.proofReceiptUrl || ord.matchedWith?.proofReceiptUrl);
                      const proofImg = ord.proofReceiptUrl || ord.matchedWith?.proofReceiptUrl;
                      const proofFileName = ord.proofReceiptName || ord.matchedWith?.proofReceiptName || 'transfer_receipt.png';
                      const proofNoteText = ord.proofNote || ord.matchedWith?.proofNote || ord.proofOfPaymentNote;

                      return (
                        <tr key={ord.id} className="hover:bg-neutral-900/30">
                          <td className="py-3 px-3 text-neutral-300 font-mono">{ord.id}</td>
                          <td className="py-3 px-3 text-emerald-400 font-sans font-bold">
                            {payer}
                          </td>
                          <td className="py-3 px-3 text-white font-sans font-medium">
                            {recipient}
                          </td>
                          <td className="py-3 px-3 font-bold text-white">₦{ord.amount.toLocaleString()}</td>
                          <td className="py-3 px-3 text-neutral-300 font-sans">
                            {ord.bankDetails.bankName} - {ord.bankDetails.accountNumber} ({ord.bankDetails.accountName})
                          </td>
                          <td className="py-3 px-3 font-sans">
                            {hasProof ? (
                              <button
                                type="button"
                                onClick={() => setSelectedProofPreview({
                                  orderId: ord.id,
                                  receiptUrl: proofImg,
                                  receiptName: proofFileName,
                                  note: proofNoteText,
                                  payerName: payer,
                                  recipientName: recipient,
                                  amount: ord.amount,
                                  date: ord.proofSubmittedAt || ord.matchedWith?.proofSubmittedAt,
                                  recipientConfirmed: isRecipientConfirmed,
                                  payerPhone,
                                  bankName: ord.bankDetails.bankName,
                                  accountNumber: ord.bankDetails.accountNumber,
                                })}
                                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-emerald-600/70 text-emerald-300 hover:bg-emerald-950 transition text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Receipt</span>
                              </button>
                            ) : (
                              <span className="text-neutral-500 text-[11px] italic">No proof yet</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-sans">
                            {isRecipientConfirmed ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Confirmed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-400 border border-amber-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isConfirmed
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {isConfirmed ? 'Settled & Active' : (hasProof ? 'Proof Uploaded' : 'Matched & Active')}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans">
                            {isConfirmed ? (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-700 text-[11px] font-bold">
                                ✓ Approved & Growing
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onConfirmAssistanceSettlement(ord.id);
                                  setAdminToast(`Approved! ${payer}'s 20-day growth progress is now active and counting.`);
                                  setTimeout(() => setAdminToast(null), 4000);
                                }}
                                className="px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-md flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve Proof & Start Growth</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: User Inquiries & Chat (Mailbox) */}
      {activeTab === 'mailbox' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                  Direct Contact Desk Communications
                </span>
                <h3 className="text-xl font-bold text-white">Inquiries & Message Inbox</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Inquiries submitted via the Contact Desk form go directly to this operations desk.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono-nums">
                  {contactInquiries.length} Total Messages
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              
              {/* Inbox List */}
              <div className="space-y-2 lg:col-span-1 border-r border-neutral-800/80 pr-0 lg:pr-4">
                <div className="flex items-center gap-2 mb-3">
                  {(['all', 'unread', 'resolved'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setInquiryFilter(filter)}
                      className={`px-3 py-1 text-xs rounded-lg font-bold capitalize transition ${
                        inquiryFilter === filter
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {contactInquiries
                    .filter((inq) => {
                      if (inquiryFilter === 'unread') return !inq.read;
                      if (inquiryFilter === 'resolved') return inq.resolved;
                      return true;
                    })
                    .map((inq) => (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiryId(inq.id);
                          onMarkInquiryRead?.(inq.id, true);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition ${
                          selectedInquiryId === inq.id
                            ? 'bg-emerald-950/60 border-emerald-500'
                            : inq.read
                            ? 'bg-black border-neutral-800/80 hover:border-neutral-700'
                            : 'bg-neutral-900/80 border-emerald-700/80'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white text-xs">{inq.name}</span>
                          <span className="text-[10px] text-neutral-500">{inq.createdAt.split(' ')[0]}</span>
                        </div>
                        <div className="text-xs text-neutral-300 font-medium truncate mt-0.5">
                          {inq.subject}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate mt-1">
                          {inq.message}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Message Details & Reply Console */}
              <div className="lg:col-span-2 space-y-4">
                {(() => {
                  const inquiry = contactInquiries.find((i) => i.id === selectedInquiryId) || contactInquiries[0];
                  if (!inquiry) {
                    return (
                      <div className="p-12 text-center text-neutral-500 text-xs">
                        No inquiries selected.
                      </div>
                    );
                  }
                  return (
                    <div className="p-5 rounded-2xl bg-black border border-neutral-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                        <div>
                          <h4 className="text-base font-bold text-white">{inquiry.subject}</h4>
                          <div className="text-xs text-neutral-400 font-mono mt-0.5">
                            From: <span className="text-white font-bold">{inquiry.name}</span> ({inquiry.email} · {inquiry.phone})
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleInquiryResolved?.(inquiry.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              inquiry.resolved
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{inquiry.resolved ? 'Resolved' : 'Mark Resolved'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteInquiry?.(inquiry.id)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                        {inquiry.message}
                      </div>

                      {/* Reply / Compose Section */}
                      <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                          Send Direct Response to Member Dashboard:
                        </span>
                        <input
                          type="text"
                          value={msgTitle}
                          onChange={(e) => setMsgTitle(e.target.value)}
                          placeholder="Response Subject..."
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-xs"
                        />
                        <textarea
                          rows={3}
                          value={msgBody}
                          onChange={(e) => setMsgBody(e.target.value)}
                          placeholder="Type administrative reply..."
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl text-white text-xs"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition flex items-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Response</span>
                        </button>
                        {msgSentNotice && (
                          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Message successfully dispatched to user dashboard.
                          </div>
                        )}
                      </form>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Pending Payouts & Referral Bonus Requests */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Card 1: Referral Bonus Withdrawal Requests (Admin Approval Required) */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>Referral Bonus Withdrawal Requests</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                    Admin Approval Required
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Approve or decline member requests to withdraw accrued referral earnings to their registered bank accounts
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border self-start sm:self-auto ${
                pendingReferrals.length > 0
                  ? 'text-amber-400 bg-amber-950/40 border-amber-800'
                  : 'text-neutral-400 bg-neutral-900 border-neutral-800'
              }`}>
                {pendingReferrals.length} Pending Approval
              </span>
            </div>

            {referralWithdrawalRequests.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                <div className="text-sm font-bold text-white">No Referral Bonus Withdrawal Requests</div>
                <div className="text-xs text-neutral-400">When members submit withdrawal requests for referral earnings, they will appear here for admin review and disbursement.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Request ID</th>
                      <th className="py-3 px-3">Member</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3">Bank Details</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {referralWithdrawalRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-900/30">
                        <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">{req.id}</td>
                        <td className="py-3 px-3 font-bold text-white">{req.investorName}</td>
                        <td className="py-3 px-3 font-mono text-amber-300">{req.phone}</td>
                        <td className="py-3 px-3 text-neutral-300">
                          <div className="font-semibold text-white">{req.bankDetails?.bankName}</div>
                          <div className="font-mono text-emerald-400">{req.bankDetails?.accountNumber}</div>
                          <div className="text-[10px] text-neutral-400">{req.bankDetails?.accountName}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                          ₦{req.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3 px-3">
                          {req.status === 'PENDING' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" /> Pending Admin
                            </span>
                          ) : req.status === 'APPROVED' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Approved & Paid
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 flex items-center gap-1 w-fit">
                              <Ban className="w-3 h-3" /> Declined
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {req.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onApproveReferralWithdrawal) {
                                    onApproveReferralWithdrawal(req.id);
                                    setAdminToast(`Referral bonus withdrawal of ₦${req.amount.toLocaleString()} for ${req.investorName} has been APPROVED!`);
                                    setTimeout(() => setAdminToast(null), 4000);
                                  }
                                }}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve & Release Bonus</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onRejectReferralWithdrawal) {
                                    onRejectReferralWithdrawal(req.id, 'Requirements not satisfied');
                                    setAdminToast(`Referral withdrawal request declined.`);
                                    setTimeout(() => setAdminToast(null), 4000);
                                  }
                                }}
                                className="px-2.5 py-1.5 text-xs font-bold text-red-400 bg-red-950/60 hover:bg-red-900 border border-red-800 rounded-lg transition cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-500 italic">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card 2: Pending Payout Claims (Get Assistance) */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <div>
                <h3 className="text-xl font-bold text-white">Pending Payout Claims (Get Assistance)</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Claims submitted after 20-day maturity waiting for settlement</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800 px-3 py-1.5 rounded-lg">
                {pendingGet.length} Pending
              </span>
            </div>

            {pendingGet.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                <div className="text-sm font-bold text-white">No Pending Payout Claims</div>
                <div className="text-xs text-neutral-400">All matured 20-day dividend cycles have been dispatched or matched.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Recipient Name</th>
                      <th className="py-3 px-3">Bank Account</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {pendingGet.map((claim) => (
                      <tr key={claim.id} className="hover:bg-neutral-900/30">
                        <td className="py-3 px-3 font-mono text-neutral-300">{claim.id}</td>
                        <td className="py-3 px-3 font-bold text-white">{claim.investorName}</td>
                        <td className="py-3 px-3 text-neutral-300">{claim.bankDetails.bankName} - {claim.bankDetails.accountNumber}</td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-400 text-sm">₦{claim.amount.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
                            Waiting Match
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setActiveTab('matching');
                              setSelectedGetId(claim.id);
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
                          >
                            Pair Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Permanent Account Deletion Confirmation Modal */}
      {investorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0c0c0c] border border-red-800/80 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Permanently Delete Account</h4>
                <p className="text-xs text-neutral-400">Irreversible administrative action</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-neutral-800 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Member Name:</span>
                <span className="font-bold text-white text-right">{investorToDelete.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Email:</span>
                <span className="text-neutral-200 font-mono text-right">{investorToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Account Status:</span>
                <span className="text-amber-400 font-bold">{investorToDelete.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Active Capital:</span>
                <span className="text-white font-mono font-bold">₦{investorToDelete.activeAssistance.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-red-300 bg-red-950/30 p-3.5 rounded-xl border border-red-900/60 leading-relaxed">
              ⚠️ <strong>Permanent Action:</strong> Deleting this account will permanently erase the user record, active orders, and referral history from Farm Base Club. This cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setInvestorToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const deletedName = investorToDelete.fullName;
                  onDeleteInvestor?.(investorToDelete.id);
                  setInvestorToDelete(null);
                  setAdminToast(`Account for ${deletedName} has been permanently deleted from Farm Base Club.`);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-950/60 cursor-pointer"
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADMIN PROOF OF PAYMENT LIGHTBOX MODAL                     */}
      {/* ======================================================== */}
      {selectedProofPreview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0c0c0c] border border-neutral-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span>Administrative Proof Verification</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProofPreview(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Proof Image or Document Card */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-black flex items-center justify-center min-h-[220px] max-h-[360px] relative">
              {selectedProofPreview.receiptUrl ? (
                <img
                  src={selectedProofPreview.receiptUrl}
                  alt="Proof Receipt"
                  className="w-full h-full object-contain max-h-[350px]"
                />
              ) : (
                <div className="text-center p-8 space-y-2">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">{selectedProofPreview.receiptName || 'Payment Transfer Slip'}</p>
                  <p className="text-xs text-neutral-400">Electronic Banking Transfer Receipt</p>
                </div>
              )}
            </div>

            {/* Verification Metadata */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Payer (Growth will start):</span>
                <span className="font-bold text-white">{selectedProofPreview.payerName} ({selectedProofPreview.payerPhone})</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Demanding Recipient:</span>
                <span className="font-bold text-white">{selectedProofPreview.recipientName} ({selectedProofPreview.bankName} - {selectedProofPreview.accountNumber})</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Transfer Amount:</span>
                <span className="font-mono text-base font-black text-emerald-400">₦{(selectedProofPreview.amount || 0).toLocaleString()}</span>
              </div>
              {selectedProofPreview.note && (
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Reference / Note:</span>
                  <span className="font-mono text-amber-300 font-bold">{selectedProofPreview.note}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Recipient Confirmation:</span>
                {selectedProofPreview.recipientConfirmed ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Recipient Confirmed Received
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600 font-bold text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> Recipient Confirmation Pending
                  </span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProofPreview(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-semibold transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmAssistanceSettlement(selectedProofPreview.orderId);
                  setAdminToast(`Approved! ${selectedProofPreview.payerName}'s 20-day growth progress is now active and counting.`);
                  setTimeout(() => setAdminToast(null), 4000);
                  setSelectedProofPreview(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Proof & Start Growth Progress</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Landing Feed Activities Modal */}
      <UploadLandingFeedModal
        isOpen={isUploadFeedOpen}
        onClose={() => setIsUploadFeedOpen(false)}
        activities={liveActivities}
        onSaveActivities={(updated) => {
          onUpdateLiveActivities?.(updated);
        }}
      />

    </div>
  );
};
