import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Investor,
  AssistanceOrder,
  AssistanceHistoryItem,
  AdminControls,
  ContactInquiry,
  LiveAssistanceActivity,
} from '../types';

// Convert DB row to TypeScript Investor
export const mapDbToInvestor = (row: any): Investor => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  password:
    row.password ||
    (row.routing_or_swift?.startsWith('pwd:') ? row.routing_or_swift.slice(4) : undefined) ||
    row.direct_message?._pwd ||
    undefined,
  bankDetails: {
    bankName: row.bank_name,
    accountNumber: row.account_number,
    accountName: row.account_name,
    routingOrSwift: row.routing_or_swift?.startsWith('pwd:') ? undefined : (row.routing_or_swift || undefined),
  },
  referralCode: row.referral_code,
  referredByCode: row.referred_by_code || undefined,
  referralCount: row.referral_count || 0,
  referralEarnings: Number(row.referral_earnings || 0),
  walletBalance: Number(row.wallet_balance || 0),
  activeAssistance: Number(row.active_assistance || 0),
  totalAssisted: Number(row.total_assisted || 0),
  dividendPercent: Number(row.dividend_percent || 20),
  assistanceDate: row.assistance_date ? String(row.assistance_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
  withdrawalDate: row.withdrawal_date ? String(row.withdrawal_date).slice(0, 10) : new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
  dividendPaused: Boolean(row.dividend_paused),
  withdrawalLocked: Boolean(row.withdrawal_locked),
  directMessage: row.direct_message || null,
  status: row.status || 'PENDING',
});

// Convert DB row to TypeScript AssistanceOrder
export const mapDbToOrder = (row: any): AssistanceOrder => ({
  id: row.id,
  type: row.type,
  investorId: row.investor_id,
  investorName: row.investor_name,
  phone: row.phone,
  amount: Number(row.amount),
  bankDetails: {
    bankName: row.bank_name,
    accountNumber: row.account_number,
    accountName: row.account_name,
  },
  status: row.status,
  matchedWith: row.matched_order_id
    ? {
        orderId: row.matched_order_id,
        investorId: row.matched_investor_id,
        investorName: row.matched_investor_name,
        phone: row.matched_phone,
        bankDetails: {
          bankName: row.matched_bank_name,
          accountNumber: row.matched_account_number,
          accountName: row.matched_account_name,
        },
        matchedAt: row.matched_at || '',
        proofSubmitted: Boolean(row.proof_submitted),
        proofNote: row.proof_note || undefined,
      }
    : undefined,
  proofOfPaymentNote: row.proof_of_payment_note || undefined,
  createdAt: row.created_at || new Date().toISOString(),
});

// ----------------- Supabase Read Operations -----------------

export async function fetchInvestorsFromDb(): Promise<Investor[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('investors').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase investors fetch error:', error.message);
      return null;
    }
    return data && data.length > 0 ? data.map(mapDbToInvestor) : null;
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

export async function fetchOrdersFromDb(): Promise<AssistanceOrder[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('assistance_orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase orders fetch error:', error.message);
      return null;
    }
    return data && data.length > 0 ? data.map(mapDbToOrder) : null;
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

export async function fetchAdminControlsFromDb(): Promise<AdminControls | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('admin_controls').select('*').eq('id', 1).single();
    if (error) {
      console.warn('Supabase admin controls fetch error:', error.message);
      return null;
    }
    if (data) {
      return {
        globalDividendPaused: Boolean(data.global_dividend_paused),
        globalWithdrawalsLocked: Boolean(data.global_withdrawals_locked),
        systemNotice: data.system_notice || '',
        lastUpdated: data.last_updated || new Date().toISOString(),
      };
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

// ----------------- Supabase Write Operations -----------------

export async function saveInvestorToDb(investor: Investor): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const encodedRouting = investor.password
      ? `pwd:${investor.password}`
      : (investor.bankDetails.routingOrSwift || null);

    const directMsgWithPwd = investor.directMessage
      ? { ...investor.directMessage, ...(investor.password ? { _pwd: investor.password } : {}) }
      : (investor.password ? { _pwd: investor.password } : null);

    const { error } = await supabase.from('investors').upsert({
      id: investor.id,
      full_name: investor.fullName,
      email: investor.email,
      phone: investor.phone,
      bank_name: investor.bankDetails.bankName,
      account_number: investor.bankDetails.accountNumber,
      account_name: investor.bankDetails.accountName,
      routing_or_swift: encodedRouting,
      referral_code: investor.referralCode,
      referred_by_code: investor.referredByCode || null,
      referral_count: investor.referralCount,
      referral_earnings: investor.referralEarnings,
      wallet_balance: investor.walletBalance || 0,
      active_assistance: investor.activeAssistance,
      total_assisted: investor.totalAssisted,
      dividend_percent: investor.dividendPercent,
      assistance_date: investor.assistanceDate,
      withdrawal_date: investor.withdrawalDate,
      dividend_paused: investor.dividendPaused,
      withdrawal_locked: investor.withdrawalLocked,
      direct_message: directMsgWithPwd,
      status: investor.status,
    });
    if (error) {
      console.warn('Failed to upsert investor to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving investor to Supabase:', err);
    return false;
  }
}

export async function deleteInvestorFromDb(investorId: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('investors').delete().eq('id', investorId);
    if (error) {
      console.warn('Failed to delete investor from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error deleting investor from Supabase:', err);
    return false;
  }
}

export async function saveOrderToDb(order: AssistanceOrder): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('assistance_orders').upsert({
      id: order.id,
      type: order.type,
      investor_id: order.investorId,
      investor_name: order.investorName,
      phone: order.phone,
      amount: order.amount,
      bank_name: order.bankDetails.bankName,
      account_number: order.bankDetails.accountNumber,
      account_name: order.bankDetails.accountName,
      status: order.status,
      matched_order_id: order.matchedWith?.orderId || null,
      matched_investor_id: order.matchedWith?.investorId || null,
      matched_investor_name: order.matchedWith?.investorName || null,
      matched_phone: order.matchedWith?.phone || null,
      matched_bank_name: order.matchedWith?.bankDetails.bankName || null,
      matched_account_number: order.matchedWith?.bankDetails.accountNumber || null,
      matched_account_name: order.matchedWith?.bankDetails.accountName || null,
      matched_at: order.matchedWith?.matchedAt || null,
      proof_submitted: order.matchedWith?.proofSubmitted || false,
      proof_note: order.matchedWith?.proofNote || null,
      proof_of_payment_note: order.proofOfPaymentNote || null,
    });
    if (error) {
      console.warn('Failed to save order to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving order to Supabase:', err);
    return false;
  }
}

export async function saveAdminControlsToDb(controls: AdminControls): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('admin_controls').upsert({
      id: 1,
      global_dividend_paused: controls.globalDividendPaused,
      global_withdrawals_locked: controls.globalWithdrawalsLocked,
      system_notice: controls.systemNotice,
      last_updated: new Date().toISOString(),
    });
    if (error) {
      console.warn('Failed to save admin controls to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving admin controls to Supabase:', err);
    return false;
  }
}

export async function saveInquiryToDb(inquiry: ContactInquiry): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('contact_inquiries').insert({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || null,
      subject: inquiry.subject,
      message: inquiry.message,
      read: inquiry.read,
      resolved: inquiry.resolved,
    });
    return !error;
  } catch (err) {
    console.warn('Error saving inquiry to Supabase:', err);
    return false;
  }
}
