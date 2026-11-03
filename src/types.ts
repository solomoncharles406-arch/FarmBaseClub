export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingOrSwift?: string;
}

export interface ReferralBonusRecord {
  id: string;
  refereeName: string;
  amount: number;
  date: string;
  status: 'ACCRUED' | 'WITHDRAWN' | 'PENDING_SUPPORT';
  supportRendered?: boolean;
  supportAmount?: number;
}

export interface Investor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bankDetails: BankDetails;
  referralCode: string;
  referredByCode?: string;
  referralCount: number;
  referralEarnings: number;
  referralBonusHistory?: ReferralBonusRecord[];
  walletBalance?: number;
  activeAssistance: number;
  totalAssisted: number;
  dividendPercent: number; // 0 to 100%
  assistanceDate: string;
  withdrawalDate: string;
  dividendPaused: boolean;
  withdrawalLocked: boolean;
  directMessage?: {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isBroadcast: boolean;
    type: 'alert' | 'info' | 'success';
  } | null;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface AssistanceHistoryItem {
  id: string;
  investorId: string;
  sector: string;
  amount: number;
  expectedYield: number;
  dateAssisted: string;
  withdrawalDate: string;
  progressPercent: number;
  status: 'ACTIVE_GROWTH' | 'MATURED' | 'WITHDRAWN';
}

export interface AssistanceOrder {
  id: string;
  type: 'RENDER' | 'GET'; // RENDER = Offering to pay; GET = Demanding payment
  investorId: string;
  investorName: string;
  phone: string;
  amount: number;
  bankDetails: BankDetails;
  status: 'WAITING_MATCH' | 'MATCHED' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'CANCELLED';
  matchedWith?: {
    orderId: string;
    investorId: string;
    investorName: string;
    phone: string;
    bankDetails: BankDetails;
    matchedAt: string;
    proofSubmitted?: boolean;
    proofNote?: string;
  };
  proofOfPaymentNote?: string;
  createdAt: string;
}

export interface AdminControls {
  globalDividendPaused: boolean;
  globalWithdrawalsLocked: boolean;
  systemNotice: string;
  lastUpdated: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  resolved: boolean;
}

export interface LiveAssistanceActivity {
  id: string;
  type: 'RENDERED' | 'GOT';
  personName: string;
  amount: number;
  timeAgo: string;
  sectorOrCoop?: string;
  bankName?: string;
  counterpartyName?: string;
  note?: string;
  location?: string;
}

