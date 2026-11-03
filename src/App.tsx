import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { VisionSection } from './components/VisionSection';
import { ContactSection } from './components/ContactSection';
import { InvestorDashboard } from './components/InvestorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MemberLoginModal } from './components/MemberLoginModal';
import { RegisterModal } from './components/RegisterModal';
import { RenderAssistanceModal } from './components/RenderAssistanceModal';
import { GetAssistanceModal } from './components/GetAssistanceModal';
import { PromptFormulaModal } from './components/PromptFormulaModal';
import { LiveAssistanceTicker } from './components/LiveAssistanceTicker';
import {
  INITIAL_INVESTORS,
  INITIAL_HISTORY,
  INITIAL_ORDERS,
  INITIAL_ADMIN_CONTROLS,
  INITIAL_INQUIRIES,
  INITIAL_LIVE_ASSISTANCE_ACTIVITIES,
} from './data/initialData';
import {
  Investor,
  BankDetails,
  AssistanceHistoryItem,
  AssistanceOrder,
  AdminControls,
  ContactInquiry,
  ReferralBonusRecord,
  LiveAssistanceActivity
} from './types';
import {
  fetchInvestorsFromDb,
  fetchOrdersFromDb,
  fetchAdminControlsFromDb,
  saveInvestorToDb,
  deleteInvestorFromDb,
  saveOrderToDb,
  saveAdminControlsToDb,
  saveInquiryToDb
} from './services/supabaseService';

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin'>('home');
  const [investors, setInvestors] = useState<Investor[]>(INITIAL_INVESTORS);
  const [currentInvestor, setCurrentInvestor] = useState<Investor>(
    INITIAL_INVESTORS.find((i) => i.id === 'inv-205') || INITIAL_INVESTORS[0]
  );
  const [assistanceHistory, setAssistanceHistory] = useState<AssistanceHistoryItem[]>(INITIAL_HISTORY);
  const [assistanceOrders, setAssistanceOrders] = useState<AssistanceOrder[]>(INITIAL_ORDERS);
  const [adminControls, setAdminControls] = useState<AdminControls>(INITIAL_ADMIN_CONTROLS);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(INITIAL_INQUIRIES);
  const [liveActivities, setLiveActivities] = useState<LiveAssistanceActivity[]>(INITIAL_LIVE_ASSISTANCE_ACTIVITIES);

  // Dynamic live stream simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const sampleNames = [
        'Mallam Kabir Bello',
        'Mrs. Nkechi Anyaoku',
        'Chief Adeleke Ogundipe',
        'Hajia Maryam Kano',
        'Engr. Chidi Okonjo',
        'Dr. Fola Awolowo',
        'Alhaji Sani Zaria',
        'Pastor Emmanuel Idahosa',
        'Tunde Bakare Agro Hub',
        'Mrs. Amaka Umeh',
      ];
      const sampleAmounts = [50000, 100000, 150000, 200000, 250000, 350000, 500000, 750000];
      const sampleSectors = [
        'Mechanized Rice Milling Hub',
        'Hybrid Maize Cultivation Cluster',
        'Cassava Starch Processing Cluster',
        'Soybean Production & Irrigation',
        'Poultry Feed & Grain Mill',
        'Oil Palm Nursery & Extraction',
        'Sesame Seed Mechanized Farming',
      ];
      const sampleBanks = ['OPay', 'PalmPay', 'Moniepoint', 'Zenith Bank', 'Kuda Bank', 'Access Bank', 'First Bank'];
      const sampleLocations = ['Ogun State', 'Kaduna State', 'Benue State', 'Enugu State', 'Kano State', 'Delta State', 'Kebbi State'];

      const isRender = Math.random() > 0.5;
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomAmount = sampleAmounts[Math.floor(Math.random() * sampleAmounts.length)];
      const randomSector = sampleSectors[Math.floor(Math.random() * sampleSectors.length)];
      const randomLocation = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      const randomBank = sampleBanks[Math.floor(Math.random() * sampleBanks.length)];

      const newItem: LiveAssistanceActivity = {
        id: `auto-${Date.now()}`,
        type: isRender ? 'RENDERED' : 'GOT',
        personName: randomName,
        amount: randomAmount,
        timeAgo: 'Just now',
        sectorOrCoop: randomSector,
        bankName: isRender ? undefined : randomBank,
        location: randomLocation,
        note: isRender
          ? 'Mechanized farming assistance pledged & matched'
          : 'Assistance cycle payout credited successfully',
      };

      setLiveActivities((prev) => [newItem, ...prev.slice(0, 35)]);
    }, 22000);

    return () => clearInterval(interval);
  }, []);

  // Supabase Initial Hydration
  useEffect(() => {
    async function loadDataFromSupabase() {
      try {
        const [dbInvestors, dbOrders, dbControls] = await Promise.all([
          fetchInvestorsFromDb(),
          fetchOrdersFromDb(),
          fetchAdminControlsFromDb(),
        ]);

        if (dbInvestors && dbInvestors.length > 0) {
          setInvestors(dbInvestors);
          setCurrentInvestor((prev) => {
            const found = dbInvestors.find((inv) => inv.id === prev.id);
            return found || dbInvestors[0];
          });
        }

        if (dbOrders && dbOrders.length > 0) {
          setAssistanceOrders(dbOrders);
        }

        if (dbControls) {
          setAdminControls(dbControls);
        }
      } catch (err) {
        console.warn('Supabase initial fetch notice:', err);
      }
    }

    loadDataFromSupabase();
  }, []);

  // Auth & Modal States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isMemberLoginOpen, setIsMemberLoginOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRenderAssistanceOpen, setIsRenderAssistanceOpen] = useState(false);
  const [isGetAssistanceOpen, setIsGetAssistanceOpen] = useState(false);
  const [isPromptFormulaOpen, setIsPromptFormulaOpen] = useState(false);

  // Handlers
  const handleOpenAdminLogin = () => {
    if (isAdminLoggedIn) {
      setActivePage('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setActivePage('admin');
  };

  const handleExitAdmin = () => {
    setIsAdminLoggedIn(false);
    setActivePage('home');
  };

  const handleRegisterNewInvestor = (
    data: Omit<Investor, 'id' | 'referralCode' | 'referralCount' | 'referralEarnings' | 'totalAssisted' | 'status'>
  ) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `inv-${randomSuffix}`;
    const newInvestor: Investor = {
      ...data,
      id: newId,
      referralCode: `FBC-${randomSuffix}`,
      referralCount: 0,
      referralEarnings: 0,
      totalAssisted: data.activeAssistance,
      status: 'PENDING',
    };

    const newHistoryItem: AssistanceHistoryItem = {
      id: `hist-${Date.now()}`,
      investorId: newId,
      sector: 'Mechanized Grain & Hybrid Maize Production',
      amount: data.activeAssistance,
      expectedYield: data.activeAssistance * 0.20,
      dateAssisted: data.assistanceDate,
      withdrawalDate: data.withdrawalDate,
      progressPercent: 0,
      status: 'ACTIVE_GROWTH',
    };

    setInvestors((prev) => {
      let updated = [newInvestor, ...prev];
      if (data.referredByCode) {
        updated = updated.map((inv) => {
          if (
            inv.referralCode.toLowerCase() === data.referredByCode?.toLowerCase() ||
            data.referredByCode?.toLowerCase().includes(inv.referralCode.toLowerCase())
          ) {
            const pendingRec: ReferralBonusRecord = {
              id: `bon-pend-${Date.now()}`,
              refereeName: data.fullName,
              amount: 0,
              date: new Date().toISOString().slice(0, 10),
              status: 'PENDING_SUPPORT',
              supportRendered: false,
            };
            return {
              ...inv,
              referralCount: inv.referralCount + 1,
              referralBonusHistory: [pendingRec, ...(inv.referralBonusHistory || [])],
            };
          }
          return inv;
        });
      }
      return updated;
    });

    setCurrentInvestor(newInvestor);
    setAssistanceHistory((prev) => [newHistoryItem, ...prev]);
    saveInvestorToDb(newInvestor);
    setActivePage('dashboard');
  };

  const handleApproveInvestor = (investorId: string) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === investorId ? { ...inv, status: 'ACTIVE' } : inv
      )
    );
    if (currentInvestor.id === investorId) {
      setCurrentInvestor((prev) => ({ ...prev, status: 'ACTIVE' }));
    }
    handleSendDirectMessage(
      investorId,
      'Account Approved & Activated',
      'Congratulations! Your Farm Base Club membership has been officially approved and activated by Central Administration. You can now fully render and receive peer assistance.'
    );
  };

  const handleDeleteInvestor = (investorId: string) => {
    // Permanently remove user account
    setInvestors((prev) => prev.filter((inv) => inv.id !== investorId));
    deleteInvestorFromDb(investorId);

    // Permanently delete all related assistance orders
    setAssistanceOrders((prev) =>
      prev.filter(
        (ord) => ord.investorId !== investorId && ord.matchedWith?.investorId !== investorId
      )
    );

    // Permanently delete assistance history
    setAssistanceHistory((prev) => prev.filter((h) => h.investorId !== investorId));

    // Switch current investor if the active one was deleted
    if (currentInvestor.id === investorId) {
      const remaining = investors.filter((inv) => inv.id !== investorId);
      if (remaining.length > 0) {
        setCurrentInvestor(remaining[0]);
      }
    }
  };

  const handleApproveFarmSupport = (investorId: string, orderId?: string) => {
    setInvestors((prev) =>
      prev.map((inv) => {
        if (inv.id === investorId) {
          return {
            ...inv,
            status: 'ACTIVE',
            dividendPercent: 0,
            assistanceDate: new Date().toISOString().slice(0, 10),
            withdrawalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          };
        }
        return inv;
      })
    );
    if (orderId) {
      setAssistanceOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'MATCHED' } : ord))
      );
    }
    handleSendDirectMessage(
      investorId,
      'Farm Support Approved (20-Day Cycle Started)',
      'Your agricultural capital assistance has been approved by Central Admin. Your 20-day cycle has commenced with up to 20% dividend yield.'
    );
  };

  const handleViewUserDashboard = (investor: Investor) => {
    setCurrentInvestor(investor);
    setActivePage('dashboard');
  };

  const handleWithdrawReferralBonus = (investorId: string, amount: number) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === investorId
          ? {
              ...inv,
              referralEarnings: 0,
              referralBonusHistory: [],
              walletBalance: (inv.walletBalance || 0) + amount,
            }
          : inv
      )
    );
    if (currentInvestor.id === investorId) {
      setCurrentInvestor((prev) => ({
        ...prev,
        referralEarnings: 0,
        referralBonusHistory: [],
        walletBalance: (prev.walletBalance || 0) + amount,
      }));
    }
    handleSendDirectMessage(
      investorId,
      'Referral Bonus Withdrawn & History Wiped',
      `Your referral bonus payout of ₦${amount.toLocaleString()} was successfully processed. Your referral bonus balance has been reset to ₦0 and your bonus accrual history has been wiped.`
    );
  };

  const handleUpdateBankDetails = (bankDetails: BankDetails, phone: string) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === currentInvestor.id
          ? { ...inv, bankDetails, phone }
          : inv
      )
    );
    setCurrentInvestor((prev) => ({
      ...prev,
      bankDetails,
      phone,
    }));
  };

  const handleDepositWallet = (amount: number) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === currentInvestor.id
          ? { ...inv, walletBalance: (inv.walletBalance || 0) + amount }
          : inv
      )
    );
    setCurrentInvestor((prev) => ({
      ...prev,
      walletBalance: (prev.walletBalance || 0) + amount,
    }));
  };

  const handleConfirmReceivedPayment = (orderId: string) => {
    setAssistanceOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'CONFIRMED' } : ord))
    );
    handleSendDirectMessage(
      currentInvestor.id,
      'Support Payment Confirmed',
      'You have verified and confirmed receipt of support in your bank account. The system transaction is complete.'
    );
  };

  const handleSelectInvestor = (inv: Investor) => {
    setCurrentInvestor(inv);
    setActivePage('dashboard');
  };

  const handleSubmitRenderOrder = (amount: number, proofNote?: string) => {
    const newOrder: AssistanceOrder = {
      id: `ORD-R-${Math.floor(100 + Math.random() * 900)}`,
      type: 'RENDER',
      investorId: currentInvestor.id,
      investorName: currentInvestor.fullName,
      phone: currentInvestor.phone,
      amount,
      bankDetails: currentInvestor.bankDetails,
      status: 'WAITING_MATCH',
      proofOfPaymentNote: proofNote,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setAssistanceOrders((prev) => [newOrder, ...prev]);
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === currentInvestor.id
          ? {
              ...inv,
              activeAssistance: inv.activeAssistance + amount,
              totalAssisted: inv.totalAssisted + amount,
              assistanceDate: new Date().toISOString().split('T')[0],
              dividendPercent: Math.min(inv.dividendPercent, 20),
            }
          : inv
      )
    );
    setCurrentInvestor((prev) => ({
      ...prev,
      activeAssistance: prev.activeAssistance + amount,
      totalAssisted: prev.totalAssisted + amount,
    }));

    // BUSINESS RULE: Referral bonus ONLY adds when the referred person renders support to another person
    if (currentInvestor.referredByCode) {
      const bonusAmt = 4000;
      setInvestors((prev) =>
        prev.map((inv) => {
          if (
            inv.referralCode.toLowerCase() === currentInvestor.referredByCode?.toLowerCase() ||
            currentInvestor.referredByCode?.toLowerCase().includes(inv.referralCode.toLowerCase())
          ) {
            const history = inv.referralBonusHistory || [];
            const alreadyAccrued = history.some(
              (h) => h.refereeName === currentInvestor.fullName && h.status === 'ACCRUED'
            );
            if (!alreadyAccrued) {
              const updatedHistory: ReferralBonusRecord[] = [
                {
                  id: `bon-acc-${Date.now()}`,
                  refereeName: currentInvestor.fullName,
                  amount: bonusAmt,
                  date: new Date().toISOString().slice(0, 10),
                  status: 'ACCRUED',
                  supportRendered: true,
                  supportAmount: amount,
                },
                ...history.filter((h) => h.refereeName !== currentInvestor.fullName),
              ];
              return {
                ...inv,
                referralEarnings: (inv.referralEarnings || 0) + bonusAmt,
                walletBalance: (inv.walletBalance || 0) + bonusAmt,
                referralBonusHistory: updatedHistory,
              };
            }
          }
          return inv;
        })
      );
      handleSendDirectMessage(
        currentInvestor.id,
        'Support Rendered - Referrer Bonus Credited',
        `You rendered ₦${amount.toLocaleString()} agricultural support! Because you rendered support, your referrer has been credited with their ₦4,000 referral bonus.`
      );
    }

    // Prepend to Live Movable Assistance Feed
    const newLiveRender: LiveAssistanceActivity = {
      id: `live-r-${Date.now()}`,
      type: 'RENDERED',
      personName: currentInvestor.fullName,
      amount,
      timeAgo: 'Just now',
      sectorOrCoop: 'Mechanized Farming Sponsorship',
      location: 'Enugu State',
      note: proofNote || 'Agricultural assistance pledged & matched',
    };
    setLiveActivities((prev) => [newLiveRender, ...prev]);
  };

  const handleSubmitGetOrder = (amount: number) => {
    const newOrder: AssistanceOrder = {
      id: `ORD-G-${Math.floor(100 + Math.random() * 900)}`,
      type: 'GET',
      investorId: currentInvestor.id,
      investorName: currentInvestor.fullName,
      phone: currentInvestor.phone,
      amount,
      bankDetails: currentInvestor.bankDetails,
      status: 'WAITING_MATCH',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setAssistanceOrders((prev) => [newOrder, ...prev]);
    saveOrderToDb(newOrder);

    // Prepend to Live Movable Assistance Feed
    const newLiveGet: LiveAssistanceActivity = {
      id: `live-g-${Date.now()}`,
      type: 'GOT',
      personName: currentInvestor.fullName,
      amount,
      timeAgo: 'Just now',
      bankName: currentInvestor.bankDetails.bankName,
      sectorOrCoop: 'Assistance Withdrawal Payout',
      location: 'Enugu State',
      note: 'Payment demand dispatched for peer fulfillment',
    };
    setLiveActivities((prev) => [newLiveGet, ...prev]);
  };

  const handleUpdateAdminControls = (controls: Partial<AdminControls>) => {
    setAdminControls((prev) => {
      const updated = {
        ...prev,
        ...controls,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      saveAdminControlsToDb(updated);
      return updated;
    });
  };

  const handleToggleUserDividendPause = (investorId: string) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === investorId ? { ...inv, dividendPaused: !inv.dividendPaused } : inv
      )
    );
    if (currentInvestor.id === investorId) {
      setCurrentInvestor((prev) => ({ ...prev, dividendPaused: !prev.dividendPaused }));
    }
  };

  const handleToggleUserWithdrawalLock = (investorId: string) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === investorId ? { ...inv, withdrawalLocked: !inv.withdrawalLocked } : inv
      )
    );
    if (currentInvestor.id === investorId) {
      setCurrentInvestor((prev) => ({ ...prev, withdrawalLocked: !prev.withdrawalLocked }));
    }
  };

  const handleUpdateUserDividendPercent = (investorId: string, percent: number) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === investorId ? { ...inv, dividendPercent: percent } : inv
      )
    );
    if (currentInvestor.id === investorId) {
      setCurrentInvestor((prev) => ({ ...prev, dividendPercent: percent }));
    }
  };

  const handleSendDirectMessage = (targetId: string | 'all', title: string, message: string) => {
    const msgObj = {
      id: `msg-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isBroadcast: targetId === 'all',
      type: 'info' as const,
    };

    setInvestors((prev) =>
      prev.map((inv) => {
        if (targetId === 'all' || inv.id === targetId) {
          return { ...inv, directMessage: msgObj };
        }
        return inv;
      })
    );

    if (targetId === 'all' || currentInvestor.id === targetId) {
      setCurrentInvestor((prev) => ({ ...prev, directMessage: msgObj }));
    }
  };

  const handleSendContactInquiry = (
    data: Omit<ContactInquiry, 'id' | 'createdAt' | 'read' | 'resolved'>
  ) => {
    const newInquiry: ContactInquiry = {
      ...data,
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
      resolved: false,
    };
    setContactInquiries((prev) => [newInquiry, ...prev]);
    saveInquiryToDb(newInquiry);
  };

  const handleMarkInquiryRead = (id: string, read: boolean) => {
    setContactInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, read } : inq))
    );
  };

  const handleToggleInquiryResolved = (id: string) => {
    setContactInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, resolved: !inq.resolved } : inq))
    );
  };

  const handleDeleteInquiry = (id: string) => {
    setContactInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  const handleMatchAssistanceOrders = (renderOrderId: string, getOrderId: string) => {
    const renderOrd = assistanceOrders.find((o) => o.id === renderOrderId);
    const getOrd = assistanceOrders.find((o) => o.id === getOrderId);
    if (!renderOrd || !getOrd) return;

    setAssistanceOrders((prev) =>
      prev.map((o) => {
        if (o.id === renderOrderId) {
          return {
            ...o,
            status: 'MATCHED',
            matchedWith: {
              orderId: getOrd.id,
              investorId: getOrd.investorId,
              investorName: getOrd.investorName,
              phone: getOrd.phone,
              bankDetails: getOrd.bankDetails,
              matchedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
          };
        }
        if (o.id === getOrderId) {
          return {
            ...o,
            status: 'MATCHED',
            matchedWith: {
              orderId: renderOrd.id,
              investorId: renderOrd.investorId,
              investorName: renderOrd.investorName,
              phone: renderOrd.phone,
              bankDetails: renderOrd.bankDetails,
              matchedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
          };
        }
        return o;
      })
    );
  };

  const handleCreateCustomPeerMatch = (
    supporterId: string,
    recipientId: string,
    amount: number,
    payerPhone: string,
    recipientBank: { bankName: string; accountNumber: string; accountName: string; phone: string }
  ) => {
    const supporter = investors.find((i) => i.id === supporterId);
    const recipient = investors.find((i) => i.id === recipientId);
    if (!supporter || !recipient) return;

    const renderOrderId = `ORD-R-${Math.floor(100 + Math.random() * 900)}`;
    const getOrderId = `ORD-G-${Math.floor(100 + Math.random() * 900)}`;
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const renderOrder: AssistanceOrder = {
      id: renderOrderId,
      type: 'RENDER',
      investorId: supporter.id,
      investorName: supporter.fullName,
      phone: payerPhone || supporter.phone,
      amount,
      bankDetails: supporter.bankDetails,
      status: 'MATCHED',
      matchedWith: {
        orderId: getOrderId,
        investorId: recipient.id,
        investorName: recipient.fullName,
        phone: recipientBank.phone || recipient.phone,
        bankDetails: {
          bankName: recipientBank.bankName || recipient.bankDetails.bankName,
          accountNumber: recipientBank.accountNumber || recipient.bankDetails.accountNumber,
          accountName: recipientBank.accountName || recipient.bankDetails.accountName,
        },
        matchedAt: nowTime,
        proofSubmitted: false,
      },
      createdAt: nowTime,
    };

    const getOrder: AssistanceOrder = {
      id: getOrderId,
      type: 'GET',
      investorId: recipient.id,
      investorName: recipient.fullName,
      phone: recipientBank.phone || recipient.phone,
      amount,
      bankDetails: {
        bankName: recipientBank.bankName || recipient.bankDetails.bankName,
        accountNumber: recipientBank.accountNumber || recipient.bankDetails.accountNumber,
        accountName: recipientBank.accountName || recipient.bankDetails.accountName,
      },
      status: 'MATCHED',
      matchedWith: {
        orderId: renderOrderId,
        investorId: supporter.id,
        investorName: supporter.fullName,
        phone: payerPhone || supporter.phone,
        bankDetails: supporter.bankDetails,
        matchedAt: nowTime,
        proofSubmitted: false,
      },
      createdAt: nowTime,
    };

    setAssistanceOrders((prev) => [renderOrder, getOrder, ...prev]);

    handleSendDirectMessage(
      supporter.id,
      'Peer Payment Assigned',
      `You have been matched to render assistance of ₦${amount.toLocaleString()} to ${recipient.fullName}. Bank: ${recipientBank.bankName} (${recipientBank.accountNumber}, ${recipientBank.accountName}). Contact receiver: ${recipientBank.phone || recipient.phone}.`
    );

    handleSendDirectMessage(
      recipient.id,
      'Matched Supporter Assigned',
      `A supporter (${supporter.fullName}, Phone: ${payerPhone || supporter.phone}) has been assigned to pay ₦${amount.toLocaleString()} to your bank account.`
    );
  };

  const handleConfirmAssistanceSettlement = (orderId: string) => {
    setAssistanceOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.matchedWith?.orderId === orderId
          ? { ...o, status: 'CONFIRMED' }
          : o
      )
    );
  };

  // Find active matched order for current investor if any
  const currentInvestorMatchedOrder = assistanceOrders.find(
    (o) => o.investorId === currentInvestor.id && o.status === 'MATCHED'
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-600 selection:text-white">
      
      {/* Top Bar Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenLogin={() => setIsMemberLoginOpen(true)}
        onOpenAdminLogin={handleOpenAdminLogin}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenPromptFormula={() => setIsPromptFormulaOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        currentInvestor={currentInvestor}
        systemNotice={adminControls.systemNotice}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activePage === 'home' && (
          <HomeSection
            activities={liveActivities}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onGoToDashboard={() => setActivePage('dashboard')}
            onOpenRenderAssistance={() => setIsRenderAssistanceOpen(true)}
            onOpenGetAssistance={() => setIsGetAssistanceOpen(true)}
          />
        )}

        {activePage === 'about' && (
          <AboutSection
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onGoToDashboard={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'vision' && (
          <VisionSection
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onGoToDashboard={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'contact' && (
          <ContactSection onSendMessage={handleSendContactInquiry} />
        )}

        {activePage === 'dashboard' && (
          <InvestorDashboard
            investor={currentInvestor}
            assistanceHistory={assistanceHistory}
            assistanceOrders={assistanceOrders}
            adminControls={adminControls}
            onOpenRenderAssistance={() => setIsRenderAssistanceOpen(true)}
            onOpenGetAssistance={() => setIsGetAssistanceOpen(true)}
            onOpenRegisterOrSwitch={() => setIsRegisterModalOpen(true)}
            isAdminLoggedIn={isAdminLoggedIn}
            onApproveInvestor={(id) => handleApproveInvestor(id)}
            onReturnToAdmin={() => setActivePage('admin')}
            onWithdrawReferralBonus={(id, amount) => handleWithdrawReferralBonus(id, amount)}
            onUpdateBankDetails={handleUpdateBankDetails}
            onDepositWallet={handleDepositWallet}
            onConfirmReceivedPayment={handleConfirmReceivedPayment}
            onSendInquiry={handleSendContactInquiry}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            investors={investors}
            assistanceOrders={assistanceOrders}
            adminControls={adminControls}
            contactInquiries={contactInquiries}
            onUpdateAdminControls={handleUpdateAdminControls}
            onToggleUserDividendPause={handleToggleUserDividendPause}
            onToggleUserWithdrawalLock={handleToggleUserWithdrawalLock}
            onUpdateUserDividendPercent={handleUpdateUserDividendPercent}
            onSendDirectMessage={handleSendDirectMessage}
            onMatchAssistanceOrders={handleMatchAssistanceOrders}
            onConfirmAssistanceSettlement={handleConfirmAssistanceSettlement}
            onMarkInquiryRead={handleMarkInquiryRead}
            onToggleInquiryResolved={handleToggleInquiryResolved}
            onDeleteInquiry={handleDeleteInquiry}
            onExitAdmin={handleExitAdmin}
            onApproveInvestor={handleApproveInvestor}
            onViewUserDashboard={handleViewUserDashboard}
            onDeleteInvestor={handleDeleteInvestor}
            onApproveFarmSupport={handleApproveFarmSupport}
            onCreatePeerMatch={handleCreateCustomPeerMatch}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
        onOpenAdminLogin={handleOpenAdminLogin}
        onOpenPromptFormula={() => setIsPromptFormulaOpen(true)}
      />

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterNewInvestor}
      />

      <RenderAssistanceModal
        isOpen={isRenderAssistanceOpen}
        onClose={() => setIsRenderAssistanceOpen(false)}
        investor={currentInvestor}
        onSubmitOrder={handleSubmitRenderOrder}
        activeOrder={currentInvestorMatchedOrder}
      />

      <GetAssistanceModal
        isOpen={isGetAssistanceOpen}
        onClose={() => setIsGetAssistanceOpen(false)}
        investor={currentInvestor}
        adminControls={adminControls}
        onRequestAssistance={handleSubmitGetOrder}
      />

      <MemberLoginModal
        isOpen={isMemberLoginOpen}
        onClose={() => setIsMemberLoginOpen(false)}
        investors={investors}
        currentInvestor={currentInvestor}
        onSelectInvestor={(inv) => setCurrentInvestor(inv)}
        onGoToDashboard={() => setActivePage('dashboard')}
        onOpenRegister={() => {
          setIsMemberLoginOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <PromptFormulaModal
        isOpen={isPromptFormulaOpen}
        onClose={() => setIsPromptFormulaOpen(false)}
      />

      {/* Floating WhatsApp Assistance Button (Hidden Phone Digits) */}
      <a
        href="https://wa.me/2349131376638?text=Hello%20Farm%20Base%20Club%2C%20I%20need%20assistance"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Farm Base Club Assistance Desk"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-950/80 border-2 border-emerald-400/80 transition-all hover:scale-105 group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="hidden sm:inline">WhatsApp Assistance Desk</span>
        <span className="sm:hidden font-semibold">WhatsApp Desk</span>
      </a>

    </div>
  );
}
