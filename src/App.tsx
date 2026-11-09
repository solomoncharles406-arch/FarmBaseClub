import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';
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
import {
  INITIAL_INVESTORS,
  INITIAL_HISTORY,
  INITIAL_ORDERS,
  INITIAL_ADMIN_CONTROLS,
  INITIAL_INQUIRIES,
  INITIAL_LIVE_ASSISTANCE_ACTIVITIES,
  EMPTY_DEFAULT_INVESTOR,
} from './data/initialData';
import { checkDuplicateRegistration } from './utils/registrationValidation';
import {
  Investor,
  BankDetails,
  AssistanceHistoryItem,
  AssistanceOrder,
  AdminControls,
  ContactInquiry,
  ReferralBonusRecord,
  ReferralWithdrawalRequest,
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
  const [activePage, setActivePage] = useState<'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin'>(() => {
    try {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/admin' || hash === '#admin') return 'admin';
      if (hash === '#/about' || hash === '#about') return 'about';
      if (hash === '#/vision' || hash === '#vision') return 'vision';
      if (hash === '#/contact' || hash === '#contact') return 'contact';
      if (hash === '#/dashboard' || hash === '#dashboard') return 'dashboard';
    } catch (e) {
      console.warn(e);
    }
    return 'home';
  });
  const [investors, setInvestors] = useState<Investor[]>(() => {
    try {
      const cached = localStorage.getItem('farmbase_all_investors');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, Investor>();
          INITIAL_INVESTORS.forEach((inv) => map.set(inv.email.toLowerCase(), inv));
          parsed.forEach((inv: Investor) => {
            if (inv && inv.email) {
              map.set(inv.email.toLowerCase(), inv);
            }
          });
          return Array.from(map.values());
        }
      }
    } catch (e) {
      console.warn('Failed reading cached investors:', e);
    }
    return INITIAL_INVESTORS;
  });
  const [currentInvestor, setCurrentInvestor] = useState<Investor>(() => {
    try {
      const cached = localStorage.getItem('farmbase_all_investors');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const rememberedId = localStorage.getItem('farmbase_remembered_investor_id');
          const rememberedEmail = localStorage.getItem('farmbase_remember_email');
          if (rememberedId || rememberedEmail) {
            const found = parsed.find(
              (inv: Investor) =>
                inv.id === rememberedId ||
                (rememberedEmail && inv.email.toLowerCase() === rememberedEmail.toLowerCase())
            );
            if (found) return found;
          }
          return parsed[0];
        }
      }
    } catch (e) {
      console.warn('Failed restoring current investor:', e);
    }
    return INITIAL_INVESTORS[0] || EMPTY_DEFAULT_INVESTOR;
  });
  const [assistanceHistory, setAssistanceHistory] = useState<AssistanceHistoryItem[]>(INITIAL_HISTORY);
  const [assistanceOrders, setAssistanceOrders] = useState<AssistanceOrder[]>(INITIAL_ORDERS);
  const [adminControls, setAdminControls] = useState<AdminControls>(INITIAL_ADMIN_CONTROLS);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(INITIAL_INQUIRIES);
  const [liveActivities, setLiveActivities] = useState<LiveAssistanceActivity[]>(() => {
    try {
      const saved = localStorage.getItem('farmbase_custom_live_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cached live activities:', e);
    }
    return INITIAL_LIVE_ASSISTANCE_ACTIVITIES;
  });

  const [referralWithdrawalRequests, setReferralWithdrawalRequests] = useState<ReferralWithdrawalRequest[]>(() => {
    try {
      const cached = localStorage.getItem('farmbase_referral_withdrawal_requests');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed loading cached referral withdrawal requests:', e);
    }
    return [];
  });

  const handleUpdateLiveActivities = (newActivities: LiveAssistanceActivity[]) => {
    setLiveActivities(newActivities);
    try {
      localStorage.setItem('farmbase_custom_live_activities', JSON.stringify(newActivities));
    } catch (e) {
      console.warn('Could not persist live activities to storage:', e);
    }
  };

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
          setInvestors((prev) => {
            const map = new Map<string, Investor>();
            // 1. Seed demo investors
            INITIAL_INVESTORS.forEach((inv) => map.set(inv.email.toLowerCase(), inv));
            // 2. Database investors from Supabase
            dbInvestors.forEach((inv) => map.set(inv.email.toLowerCase(), inv));
            // 3. Local/newly registered accounts so they are NEVER overwritten
            prev.forEach((inv) => {
              if (inv && inv.email) {
                map.set(inv.email.toLowerCase(), inv);
              }
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('farmbase_all_investors', JSON.stringify(merged));
            } catch (e) {
              console.warn(e);
            }
            return merged;
          });
          setCurrentInvestor((prev) => {
            const found = dbInvestors.find((inv) => inv.id === prev.id || inv.email.toLowerCase() === prev.email?.toLowerCase());
            return found || prev;
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
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState<boolean>(() => {
    try {
      const isRemembered = localStorage.getItem('farmbase_remember_user') === 'true';
      const rememberedId = localStorage.getItem('farmbase_remembered_investor_id');
      const rememberedEmail = localStorage.getItem('farmbase_remember_email');
      return Boolean(isRemembered && (rememberedId || rememberedEmail));
    } catch {
      return false;
    }
  });
  const [isMemberLoginOpen, setIsMemberLoginOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRenderAssistanceOpen, setIsRenderAssistanceOpen] = useState(false);
  const [isGetAssistanceOpen, setIsGetAssistanceOpen] = useState(false);
  const [isPromptFormulaOpen, setIsPromptFormulaOpen] = useState(false);

  // URL Hash routing for www.farmbaseclub.com/#/admin and subpages
  useEffect(() => {
    const handleHashRouting = () => {
      try {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#/admin' || hash === '#admin') {
          setActivePage('admin');
          if (!isAdminLoggedIn) {
            setIsAdminLoginOpen(true);
          }
        } else if (hash === '#/dashboard' || hash === '#dashboard') {
          setActivePage('dashboard');
          if (!isMemberLoggedIn) {
            setIsMemberLoginOpen(true);
          }
        } else if (hash === '#/about' || hash === '#about') {
          setActivePage('about');
        } else if (hash === '#/vision' || hash === '#vision') {
          setActivePage('vision');
        } else if (hash === '#/contact' || hash === '#contact') {
          setActivePage('contact');
        } else if (hash === '' || hash === '#' || hash === '#/' || hash === '#/home') {
          if (activePage === 'about' || activePage === 'vision' || activePage === 'contact') {
            setActivePage('home');
          }
        }
      } catch (e) {
        console.warn('Hash routing error:', e);
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, [isAdminLoggedIn, isMemberLoggedIn]);

  // Handlers
  const handleOpenAdminLogin = () => {
    if (isAdminLoggedIn) {
      setActivePage('admin');
      window.location.hash = '#/admin';
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setActivePage('admin');
    window.location.hash = '#/admin';
  };

  const handleExitAdmin = () => {
    setIsAdminLoggedIn(false);
    setActivePage('home');
    if (window.location.hash.toLowerCase().includes('admin')) {
      try {
        window.history.pushState(null, '', window.location.pathname);
      } catch {
        window.location.hash = '';
      }
    }
  };

  const handleMemberLogout = () => {
    setIsMemberLoggedIn(false);
    try {
      // Clear active remembered session token so user must authenticate via login form
      localStorage.removeItem('farmbase_remembered_investor_id');
      // If user did not check remember me, clean all stored credentials
      if (localStorage.getItem('farmbase_remember_user') !== 'true') {
        localStorage.removeItem('farmbase_remember_user');
        localStorage.removeItem('farmbase_remember_email');
        localStorage.removeItem('farmbase_remember_password');
      }
    } catch (e) {
      console.warn('Logout storage error:', e);
    }
    setActivePage('home');
  };

  const handleRegisterNewInvestor = async (
    data: Omit<Investor, 'id' | 'referralCode' | 'referralCount' | 'referralEarnings' | 'totalAssisted' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    // 1. Strict duplicate validation against memory and localStorage
    const localDupCheck = checkDuplicateRegistration(
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        accountNumber: data.bankDetails?.accountNumber || '',
        accountName: data.bankDetails?.accountName || '',
      },
      investors
    );

    if (localDupCheck.isDuplicate) {
      return { success: false, error: localDupCheck.message };
    }

    // 2. Cross-verify against remote Supabase database records to prevent duplicate submissions
    try {
      const dbInvestors = await fetchInvestorsFromDb();
      if (dbInvestors && dbInvestors.length > 0) {
        const dbDupCheck = checkDuplicateRegistration(
          {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            accountNumber: data.bankDetails?.accountNumber || '',
            accountName: data.bankDetails?.accountName || '',
          },
          dbInvestors
        );
        if (dbDupCheck.isDuplicate) {
          return { success: false, error: dbDupCheck.message };
        }
      }
    } catch (e) {
      console.warn('DB verification notice during registration:', e);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `inv-${randomSuffix}`;
    const newInvestor: Investor = {
      ...data,
      id: newId,
      referralCode: `FBC-${randomSuffix}`,
      referralCount: 0,
      referralEarnings: 0,
      walletBalance: 0,
      activeAssistance: 0,
      totalAssisted: 0,
      dividendPercent: 20,
      referralBonusHistory: [],
      status: 'PENDING',
    };

    // 3. Immediately store in state and localStorage
    setInvestors((prev) => {
      const updated = [newInvestor, ...prev];
      try {
        localStorage.setItem('farmbase_all_investors', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to cache investors:', err);
      }
      return updated;
    });

    // 4. Store password in account password map
    try {
      const pwdMap = JSON.parse(localStorage.getItem('farmbase_account_passwords') || '{}');
      pwdMap[newInvestor.email.toLowerCase()] = data.password;
      if (data.phone) {
        pwdMap[data.phone.replace(/\D/g, '')] = data.password;
      }
      pwdMap[newInvestor.referralCode.toLowerCase()] = data.password;
      localStorage.setItem('farmbase_account_passwords', JSON.stringify(pwdMap));
    } catch (e) {
      console.warn('Password cache error:', e);
    }

    setCurrentInvestor(newInvestor);
    setIsMemberLoggedIn(true);
    setActivePage('dashboard');

    // 5. Persist to Supabase database
    try {
      await saveInvestorToDb(newInvestor);
    } catch (err) {
      console.warn('Supabase save error for registered user:', err);
    }

    return { success: true };
  };

  const handleApproveInvestor = async (investorId: string) => {
    setInvestors((prev) => {
      const updated = prev.map((inv) =>
        inv.id === investorId ? { ...inv, status: 'ACTIVE' as const } : inv
      );
      try {
        localStorage.setItem('farmbase_all_investors', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving approved investor:', e);
      }
      return updated;
    });
    if (currentInvestor.id === investorId) {
      setCurrentInvestor((prev) => ({ ...prev, status: 'ACTIVE' }));
    }
    const target = investors.find((inv) => inv.id === investorId);
    if (target) {
      await saveInvestorToDb({ ...target, status: 'ACTIVE' });
    }
    handleSendDirectMessage(
      investorId,
      'Account Approved & Activated',
      'Congratulations! Your Farm Base Club membership has been officially approved and activated by Central Administration. You can now fully render and receive peer assistance.'
    );
  };

  const handleDeleteInvestor = (investorId: string) => {
    // Permanently remove user account from state & local storage
    setInvestors((prev) => {
      const updated = prev.filter((inv) => inv.id !== investorId);
      try {
        localStorage.setItem('farmbase_all_investors', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error updating investors after deletion:', e);
      }
      return updated;
    });
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

  const handleRequestWithdrawReferralBonus = (investorId: string, amount: number) => {
    const inv = investors.find((i) => i.id === investorId) || currentInvestor;
    const newRequest: ReferralWithdrawalRequest = {
      id: `ref-wdr-${Date.now()}`,
      investorId,
      investorName: inv.fullName,
      phone: inv.phone,
      amount,
      bankDetails: inv.bankDetails,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    const updated = [newRequest, ...referralWithdrawalRequests.filter((r) => r.id !== newRequest.id)];
    setReferralWithdrawalRequests(updated);
    try {
      localStorage.setItem('farmbase_referral_withdrawal_requests', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    handleSendDirectMessage(
      investorId,
      'Referral Withdrawal Request Submitted',
      `Your request to withdraw ₦${amount.toLocaleString()} in referral bonuses has been received. Farm Base Admin will inspect and approve the disbursement to ${inv.bankDetails?.bankName} (${inv.bankDetails?.accountNumber}).`
    );
  };

  const handleApproveReferralWithdrawal = (requestId: string) => {
    const request = referralWithdrawalRequests.find((r) => r.id === requestId);
    if (!request) return;

    // 1. Update request status
    const updatedRequests: ReferralWithdrawalRequest[] = referralWithdrawalRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'APPROVED' as const, approvedAt: new Date().toISOString() }
        : r
    );
    setReferralWithdrawalRequests(updatedRequests);
    try {
      localStorage.setItem('farmbase_referral_withdrawal_requests', JSON.stringify(updatedRequests));
    } catch (e) {
      console.warn(e);
    }

    // 2. Wipe investor's referral earnings and bonus history (as required)
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === request.investorId
          ? {
              ...inv,
              referralEarnings: 0,
              referralBonusHistory: [],
            }
          : inv
      )
    );
    if (currentInvestor.id === request.investorId) {
      setCurrentInvestor((prev) => ({
        ...prev,
        referralEarnings: 0,
        referralBonusHistory: [],
      }));
    }

    // 3. Notify investor
    handleSendDirectMessage(
      request.investorId,
      'Referral Bonus Withdrawal Approved',
      `Farm Base Admin has APPROVED your referral bonus withdrawal of ₦${request.amount.toLocaleString()}. Payout released to ${request.bankDetails?.bankName} (${request.bankDetails?.accountNumber})! Your bonus accrual record has been settled.`
    );
  };

  const handleRejectReferralWithdrawal = (requestId: string, reason?: string) => {
    const request = referralWithdrawalRequests.find((r) => r.id === requestId);
    if (!request) return;

    const updatedRequests: ReferralWithdrawalRequest[] = referralWithdrawalRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'REJECTED' as const, adminNote: reason || 'Requirements not satisfied' }
        : r
    );
    setReferralWithdrawalRequests(updatedRequests);
    try {
      localStorage.setItem('farmbase_referral_withdrawal_requests', JSON.stringify(updatedRequests));
    } catch (e) {
      console.warn(e);
    }

    handleSendDirectMessage(
      request.investorId,
      'Referral Withdrawal Declined',
      `Your referral bonus withdrawal request of ₦${request.amount.toLocaleString()} was declined by Admin: ${reason || 'Referral conditions not fully satisfied'}.`
    );
  };

  const handleWithdrawReferralBonus = (investorId: string, amount: number) => {
    handleRequestWithdrawReferralBonus(investorId, amount);
  };

  const handleUpdateBankDetails = (bankDetails: BankDetails, phone: string) => {
    const otherInvestors = investors.filter((inv) => inv.id !== currentInvestor.id);
    const dupCheck = checkDuplicateRegistration(
      {
        fullName: currentInvestor.fullName,
        email: currentInvestor.email,
        phone,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName,
      },
      otherInvestors
    );

    if (dupCheck.isDuplicate && dupCheck.field !== 'fullName' && dupCheck.field !== 'email') {
      alert(dupCheck.message || 'These banking or phone coordinates are already in use by another registered member.');
      return;
    }

    setInvestors((prev) => {
      const updated = prev.map((inv) =>
        inv.id === currentInvestor.id
          ? { ...inv, bankDetails, phone }
          : inv
      );
      try {
        localStorage.setItem('farmbase_all_investors', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    setCurrentInvestor((prev) => {
      const updated = {
        ...prev,
        bankDetails,
        phone,
      };
      saveInvestorToDb(updated).catch(console.warn);
      return updated;
    });
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

  const handleSubmitProofOfPayment = (
    orderId: string,
    proof: { receiptUrl: string; receiptName: string; note: string }
  ) => {
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    let recipientId: string | null = null;
    let payerName = '';
    let assistAmount = 0;

    setAssistanceOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.matchedWith?.orderId === orderId) {
          payerName = ord.type === 'RENDER' ? ord.investorName : ord.matchedWith?.investorName || '';
          recipientId = ord.type === 'RENDER' ? (ord.matchedWith?.investorId || null) : ord.investorId;
          assistAmount = ord.amount;
          return {
            ...ord,
            status: 'PAYMENT_PENDING' as const,
            proofSubmitted: true,
            proofReceiptUrl: proof.receiptUrl,
            proofReceiptName: proof.receiptName,
            proofNote: proof.note,
            proofSubmittedAt: nowTime,
            matchedWith: ord.matchedWith
              ? {
                  ...ord.matchedWith,
                  proofSubmitted: true,
                  proofReceiptUrl: proof.receiptUrl,
                  proofReceiptName: proof.receiptName,
                  proofNote: proof.note,
                  proofSubmittedAt: nowTime,
                }
              : undefined,
          };
        }
        return ord;
      })
    );

    // Keep payer in PENDING until admin approves
    setInvestors((prev) => {
      const updated = prev.map((inv) =>
        inv.id === currentInvestor.id
          ? { ...inv, status: 'PENDING' as const, dividendPercent: 0 }
          : inv
      );
      try {
        localStorage.setItem('farmbase_all_investors', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    setCurrentInvestor((prev) => ({ ...prev, status: 'PENDING' as const, dividendPercent: 0 }));

    handleSendDirectMessage(
      currentInvestor.id,
      'Proof of Payment Uploaded',
      `Your proof of payment for ₦${assistAmount.toLocaleString()} has been uploaded and submitted to Central Admin. Your 20-day growth progress will start counting as soon as Admin reviews and approves it.`
    );

    if (recipientId) {
      handleSendDirectMessage(
        recipientId,
        'Payment Proof Uploaded by Supporter',
        `${payerName || 'Your matched supporter'} has uploaded transfer proof (₦${assistAmount.toLocaleString()}) to your bank account. Please verify your bank and click 'Confirm to Admin I Have Received Assistance' on your dashboard.`
      );
    }
  };

  const handleConfirmReceivedPayment = (orderId: string) => {
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    let payerId: string | null = null;
    let recipientName = '';
    let amount = 0;

    setAssistanceOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.matchedWith?.orderId === orderId) {
          if (ord.type === 'GET') {
            recipientName = ord.investorName;
            payerId = ord.matchedWith?.investorId || null;
            amount = ord.amount;
          } else {
            payerId = ord.investorId;
            recipientName = ord.matchedWith?.investorName || '';
            amount = ord.amount;
          }
          return {
            ...ord,
            recipientConfirmed: true,
            recipientConfirmedAt: nowTime,
            matchedWith: ord.matchedWith
              ? {
                  ...ord.matchedWith,
                  recipientConfirmed: true,
                  recipientConfirmedAt: nowTime,
                }
              : undefined,
          };
        }
        return ord;
      })
    );

    handleSendDirectMessage(
      currentInvestor.id,
      'Assistance Receipt Confirmed to Admin',
      `You have confirmed to Admin that you received ₦${amount.toLocaleString()} assistance in your bank account. Central Admin will complete final approval.`
    );

    if (payerId) {
      handleSendDirectMessage(
        payerId,
        'Recipient Confirmed Payment Receipt',
        `Great news! ${recipientName || 'The recipient'} has confirmed receiving your ₦${amount.toLocaleString()} transfer to Admin. Your 20-day growth progress will start once Admin completes final approval.`
      );
    }
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

    const today = new Date();
    const withdrawal = new Date(today);
    withdrawal.setDate(today.getDate() + 20);

    const newHistoryItem: AssistanceHistoryItem = {
      id: `hist-${Date.now()}`,
      investorId: currentInvestor.id,
      sector: 'Mechanized Grain & Hybrid Maize Production',
      amount,
      expectedYield: Math.round(amount * 0.20),
      dateAssisted: today.toISOString().split('T')[0],
      withdrawalDate: withdrawal.toISOString().split('T')[0],
      progressPercent: 0,
      status: 'ACTIVE_GROWTH',
    };

    setAssistanceHistory((prev) => [newHistoryItem, ...prev]);

    setAssistanceOrders((prev) => [newOrder, ...prev]);
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === currentInvestor.id
          ? {
              ...inv,
              activeAssistance: (inv.activeAssistance || 0) + amount,
              totalAssisted: (inv.totalAssisted || 0) + amount,
              assistanceDate: today.toISOString().split('T')[0],
              withdrawalDate: withdrawal.toISOString().split('T')[0],
              dividendPercent: Math.min(inv.dividendPercent || 20, 20),
            }
          : inv
      )
    );
    setCurrentInvestor((prev) => ({
      ...prev,
      activeAssistance: (prev.activeAssistance || 0) + amount,
      totalAssisted: (prev.totalAssisted || 0) + amount,
      assistanceDate: today.toISOString().split('T')[0],
      withdrawalDate: withdrawal.toISOString().split('T')[0],
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
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const today = new Date().toISOString().split('T')[0];
    const withdrawal = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let payerId: string | null = null;
    let payerName = '';
    let recipientId: string | null = null;
    let confirmedAmount = 0;

    // 1. Mark orders confirmed & admin approved
    setAssistanceOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.matchedWith?.orderId === orderId) {
          if (o.type === 'RENDER') {
            payerId = o.investorId;
            payerName = o.investorName;
            recipientId = o.matchedWith?.investorId || null;
            confirmedAmount = o.amount;
          } else {
            recipientId = o.investorId;
            payerId = o.matchedWith?.investorId || null;
            payerName = o.matchedWith?.investorName || '';
            confirmedAmount = o.amount;
          }
          return {
            ...o,
            status: 'CONFIRMED' as const,
            adminApproved: true,
            adminApprovedAt: nowTime,
            matchedWith: o.matchedWith
              ? {
                  ...o.matchedWith,
                  adminApproved: true,
                  adminApprovedAt: nowTime,
                }
              : undefined,
          };
        }
        return o;
      })
    );

    // 2. Activate payer so growth progress starts counting!
    if (payerId) {
      const targetPayerId = payerId;
      setInvestors((prev) => {
        const updated = prev.map((inv) => {
          if (inv.id === targetPayerId) {
            return {
              ...inv,
              status: 'ACTIVE' as const,
              activeAssistance: (inv.activeAssistance || 0) > 0 ? inv.activeAssistance : confirmedAmount,
              totalAssisted: (inv.totalAssisted || 0) + confirmedAmount,
              assistanceDate: today,
              withdrawalDate: withdrawal,
              dividendPercent: Math.max(5, inv.dividendPercent || 5), // Day 1: 5% starts counting!
              dividendPaused: false,
            };
          }
          return inv;
        });
        try {
          localStorage.setItem('farmbase_all_investors', JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });

      if (currentInvestor.id === targetPayerId) {
        setCurrentInvestor((prev) => ({
          ...prev,
          status: 'ACTIVE' as const,
          activeAssistance: (prev.activeAssistance || 0) > 0 ? prev.activeAssistance : confirmedAmount,
          totalAssisted: (prev.totalAssisted || 0) + confirmedAmount,
          assistanceDate: today,
          withdrawalDate: withdrawal,
          dividendPercent: Math.max(5, prev.dividendPercent || 5),
          dividendPaused: false,
        }));
      }

      // Add active growth record to assistance history
      const newHistoryItem: AssistanceHistoryItem = {
        id: `hist-approved-${Date.now()}`,
        investorId: targetPayerId,
        sector: 'Mechanized Grain & Hybrid Maize Production',
        amount: confirmedAmount,
        expectedYield: Math.round(confirmedAmount * 0.20),
        dateAssisted: today,
        withdrawalDate: withdrawal,
        progressPercent: 5,
        status: 'ACTIVE_GROWTH',
      };
      setAssistanceHistory((prev) => [newHistoryItem, ...prev]);

      handleSendDirectMessage(
        targetPayerId,
        'Payment Approved & Growth Started!',
        `Your assistance payment of ₦${confirmedAmount.toLocaleString()} has been officially verified and approved by Admin. Your 20-day agricultural growth progress is now active and counting (Day 1: 5%).`
      );
    }

    if (recipientId) {
      handleSendDirectMessage(
        recipientId,
        'Assistance Order Released by Admin',
        `Admin has confirmed and finalized the ₦${confirmedAmount.toLocaleString()} assistance release for your account.`
      );
    }
  };

  // Find active matched order for current investor if any (strictly when matched to a peer)
  const currentInvestorMatchedOrder =
    currentInvestor.id && currentInvestor.id !== 'guest'
      ? assistanceOrders.find(
          (o) =>
            o.investorId === currentInvestor.id &&
            o.status === 'MATCHED' &&
            Boolean(o.matchedWith?.investorName)
        )
      : undefined;

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
        isMemberLoggedIn={isMemberLoggedIn}
        onMemberLogout={handleMemberLogout}
        currentInvestor={currentInvestor}
        systemNotice={adminControls.systemNotice}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activePage === 'home' && (
          <HomeSection
            activities={liveActivities}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onOpenLogin={() => setIsMemberLoginOpen(true)}
            onGoToDashboard={() => {
              if (isMemberLoggedIn) {
                setActivePage('dashboard');
              } else {
                setIsMemberLoginOpen(true);
              }
            }}
            onOpenRenderAssistance={() => setIsRenderAssistanceOpen(true)}
            onOpenGetAssistance={() => setIsGetAssistanceOpen(true)}
          />
        )}

        {activePage === 'about' && (
          <AboutSection
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onGoToDashboard={() => {
              if (isMemberLoggedIn) {
                setActivePage('dashboard');
              } else {
                setIsMemberLoginOpen(true);
              }
            }}
          />
        )}

        {activePage === 'vision' && (
          <VisionSection
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onGoToDashboard={() => {
              if (isMemberLoggedIn) {
                setActivePage('dashboard');
              } else {
                setIsMemberLoginOpen(true);
              }
            }}
          />
        )}

        {activePage === 'contact' && (
          <ContactSection onSendMessage={handleSendContactInquiry} />
        )}

        {activePage === 'dashboard' && (
          isMemberLoggedIn ? (
            <InvestorDashboard
              investor={currentInvestor}
              assistanceHistory={assistanceHistory}
              assistanceOrders={assistanceOrders}
              adminControls={adminControls}
              onOpenRenderAssistance={() => setIsRenderAssistanceOpen(true)}
              onOpenGetAssistance={() => setIsGetAssistanceOpen(true)}
              onOpenRegisterOrSwitch={() => setIsRegisterModalOpen(true)}
              isAdminLoggedIn={isAdminLoggedIn}
              onLogout={handleMemberLogout}
              onApproveInvestor={(id) => handleApproveInvestor(id)}
              onReturnToAdmin={() => setActivePage('admin')}
              onWithdrawReferralBonus={(id, amount) => handleWithdrawReferralBonus(id, amount)}
              onRequestWithdrawReferralBonus={handleRequestWithdrawReferralBonus}
              referralWithdrawalRequests={referralWithdrawalRequests}
              onUpdateBankDetails={handleUpdateBankDetails}
              onDepositWallet={handleDepositWallet}
              onConfirmReceivedPayment={handleConfirmReceivedPayment}
              onSubmitProofOfPayment={handleSubmitProofOfPayment}
              onSendInquiry={handleSendContactInquiry}
            />
          ) : (
            <div className="py-24 text-center space-y-6 max-w-md mx-auto px-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
                <LogIn className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Member Portal Login Required
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  You must type your registered username and account password each time to enter your dashboard (except when Remember Me is active).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMemberLoginOpen(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In with Username & Password</span>
              </button>
            </div>
          )
        )}

        {activePage === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard
              investors={investors}
              assistanceOrders={assistanceOrders}
              adminControls={adminControls}
              contactInquiries={contactInquiries}
              liveActivities={liveActivities}
              referralWithdrawalRequests={referralWithdrawalRequests}
              onApproveReferralWithdrawal={handleApproveReferralWithdrawal}
              onRejectReferralWithdrawal={handleRejectReferralWithdrawal}
              onUpdateLiveActivities={handleUpdateLiveActivities}
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
          ) : (
            <div className="py-24 text-center space-y-6 max-w-md mx-auto px-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
                <LogIn className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Admin Console Restricted
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Administrator credentials verification is required to access the Farm Base Central Console.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In as Administrator</span>
              </button>
            </div>
          )
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
        onClose={() => {
          setIsAdminLoginOpen(false);
          if (activePage === 'admin' && !isAdminLoggedIn) {
            setActivePage('home');
            if (window.location.hash.toLowerCase().includes('admin')) {
              try {
                window.history.pushState(null, '', window.location.pathname);
              } catch {
                window.location.hash = '';
              }
            }
          }
        }}
        onSuccess={handleAdminSuccess}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        investors={investors}
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
        onSelectInvestor={(inv) => {
          setCurrentInvestor(inv);
          setIsMemberLoggedIn(true);
        }}
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
