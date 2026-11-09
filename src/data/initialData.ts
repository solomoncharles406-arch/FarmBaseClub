import { Investor, AssistanceHistoryItem, AssistanceOrder, AdminControls, ContactInquiry, LiveAssistanceActivity } from '../types';

// Cleared all dummy accounts so Admin Dashboard and User list start fresh
export const INITIAL_INVESTORS: Investor[] = [];

export const INITIAL_HISTORY: AssistanceHistoryItem[] = [];

export const INITIAL_ORDERS: AssistanceOrder[] = [];

export const EMPTY_DEFAULT_INVESTOR: Investor = {
  id: 'guest',
  fullName: 'Guest Member',
  email: '',
  phone: '',
  bankDetails: {
    bankName: 'Zenith Bank Plc',
    accountNumber: '',
    accountName: '',
  },
  referralCode: 'FBC-0000',
  referralCount: 0,
  referralEarnings: 0,
  activeAssistance: 0,
  totalAssisted: 0,
  dividendPercent: 20,
  assistanceDate: '',
  withdrawalDate: '',
  dividendPaused: false,
  withdrawalLocked: false,
  directMessage: null,
  status: 'PENDING',
};

export const INITIAL_ADMIN_CONTROLS: AdminControls = {
  globalDividendPaused: false,
  globalWithdrawalsLocked: false,
  systemNotice: 'Normal farming cycle operations active across all 36 state cooperatives. Assistance matching runs continuously.',
  lastUpdated: '2026-10-23 14:00'
};

export const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'INQ-5521',
    name: 'Chief Obinna Nnamdi',
    email: 'obinna.nnamdi@ogbunike-agro.ng',
    phone: '+234 803 712 8840',
    subject: 'Farming Cooperative Partnership',
    message: 'Good day Farm Base Club Admin. Our cooperative cluster in Anambra State comprises 120 cassava and palm oil smallholders seeking financial assistance for automated processing mills. We would like to schedule a field verification visit.',
    createdAt: '2026-10-24 08:45',
    read: false,
    resolved: false,
  },
  {
    id: 'INQ-5518',
    name: 'Mrs. Fatima Al-Hassan',
    email: 'fatima.alhassan@kanoseeds.org',
    phone: '+234 816 554 9901',
    subject: 'Render Assistance Payment Verification',
    message: 'Hello Support, I pledged assistance for ₦400,000 yesterday for the Jigawa sesame cluster and completed the bank transfer. Kindly expedite the administrative confirmation so my 20-day dividend cycle begins counting.',
    createdAt: '2026-10-23 19:15',
    read: false,
    resolved: false,
  }
];

export const INITIAL_LIVE_ASSISTANCE_ACTIVITIES: LiveAssistanceActivity[] = [
  {
    id: 'act-r-1',
    type: 'RENDERED',
    personName: 'Alhaji Ibrahim Danladi',
    amount: 500000,
    timeAgo: '2m ago',
    sectorOrCoop: 'Hybrid Maize Farm Hub',
    location: 'Kano State',
    note: 'Mechanized Seeds & Fertilizers Sponsorship',
  },
  {
    id: 'act-g-1',
    type: 'GOT',
    personName: 'Ugwuode Chukwuebuka Michael',
    amount: 150000,
    timeAgo: '3m ago',
    bankName: 'OPay',
    sectorOrCoop: 'Direct Assistance Settlement',
    location: 'Enugu State',
    note: 'Payout Confirmed & Received',
  },
  {
    id: 'act-r-2',
    type: 'RENDERED',
    personName: 'Engr. Babatunde Sanusi',
    amount: 600000,
    timeAgo: '5m ago',
    sectorOrCoop: 'Commercial Rice Milling Cluster',
    location: 'Kebbi State',
    note: 'Irrigation & Pumping Equipment Sponsoring',
  },
  {
    id: 'act-g-2',
    type: 'GOT',
    personName: 'OKORO CALISTUS KELECHI',
    amount: 100000,
    timeAgo: '6m ago',
    bankName: 'First Bank of Nigeria',
    sectorOrCoop: 'Agro Assistance Payout',
    location: 'Imo State',
    note: 'Payout Received from Peer Sponsor',
  },
  {
    id: 'act-r-3',
    type: 'RENDERED',
    personName: 'Chief Emeka Okafor',
    amount: 1000000,
    timeAgo: '8m ago',
    sectorOrCoop: 'Mechanized Cassava Processing Cluster',
    location: 'Anambra State',
    note: 'Automated Processing Mill Expansion',
  },
  {
    id: 'act-g-3',
    type: 'GOT',
    personName: 'Amina Yusuf Garba',
    amount: 240000,
    timeAgo: '10m ago',
    bankName: 'Union Bank of Nigeria',
    sectorOrCoop: '20-Day Harvest Cycle Dividend',
    location: 'Kano State',
    note: 'Capital + 20% Dividend Payout Credited',
  },
  {
    id: 'act-r-4',
    type: 'RENDERED',
    personName: 'Mrs. Folashade Adeleke',
    amount: 450000,
    timeAgo: '12m ago',
    sectorOrCoop: 'Soybean Cultivation Hub',
    location: 'Benue State',
    note: 'Bio-Fertilizer Sponsoring Assistance',
  },
  {
    id: 'act-g-4',
    type: 'GOT',
    personName: 'Mallam Sanusi Aliyu',
    amount: 400000,
    timeAgo: '15m ago',
    bankName: 'Jaiz Bank Plc',
    sectorOrCoop: 'Wheat Irrigation Dividend',
    location: 'Sokoto State',
    note: 'Cycle Completed Payout Dispatched',
  }
];
