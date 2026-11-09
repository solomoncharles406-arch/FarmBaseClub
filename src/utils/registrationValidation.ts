import { Investor } from '../types';

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  bankName?: string;
  accountNumber: string;
  accountName: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  field?: 'email' | 'phone' | 'accountNumber' | 'accountName' | 'fullName';
  message?: string;
}

export const normalizeEmail = (e?: string): string => (e || '').trim().toLowerCase();

export const normalizePhoneDigits = (p?: string): string => {
  const digits = (p || '').replace(/\D/g, '');
  // Match last 10 digits to correctly catch local '080...' vs '+23480...' vs raw 10 digits
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

export const normalizeAccountNumber = (acc?: string): string => {
  return (acc || '').replace(/\D/g, '').trim();
};

export const normalizeNameForComparison = (name?: string): string => {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Combines all investors from memory and localStorage to guarantee complete duplicate protection.
 */
export const getAllRegisteredInvestors = (inMemoryInvestors: Investor[] = []): Investor[] => {
  const map = new Map<string, Investor>();

  // 1. In-memory investors
  if (Array.isArray(inMemoryInvestors)) {
    inMemoryInvestors.forEach((inv) => {
      if (inv && inv.id) {
        map.set(inv.id, inv);
      }
    });
  }

  // 2. Cached in localStorage
  try {
    const cached = localStorage.getItem('farmbase_all_investors');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        parsed.forEach((inv: Investor) => {
          if (inv && inv.id) {
            map.set(inv.id, inv);
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error reading cached investors:', err);
  }

  return Array.from(map.values());
};

/**
 * Validates whether any registration field (email, phone, account number, account name, full name)
 * has already been used by an existing member.
 */
export const checkDuplicateRegistration = (
  input: RegistrationInput,
  existingInvestors: Investor[] = []
): DuplicateCheckResult => {
  const allExisting = getAllRegisteredInvestors(existingInvestors);

  const cleanEmail = normalizeEmail(input.email);
  const cleanPhone = normalizePhoneDigits(input.phone);
  const cleanAccNum = normalizeAccountNumber(input.accountNumber);
  const cleanAccName = normalizeNameForComparison(input.accountName);
  const cleanFullName = normalizeNameForComparison(input.fullName);

  for (const inv of allExisting) {
    // 1. Check duplicate Email
    if (cleanEmail && normalizeEmail(inv.email) === cleanEmail) {
      return {
        isDuplicate: true,
        field: 'email',
        message: `Registration rejected: The email address "${input.email.trim()}" is already registered. Each account must have a unique email address.`,
      };
    }

    // 2. Check duplicate Phone Number
    if (cleanPhone && cleanPhone.length >= 7) {
      const invPhone = normalizePhoneDigits(inv.phone);
      if (invPhone && invPhone === cleanPhone) {
        return {
          isDuplicate: true,
          field: 'phone',
          message: `Registration rejected: The phone number "${input.phone.trim()}" is already registered to an existing account. Duplicate phone numbers are not accepted.`,
        };
      }
    }

    // 3. Check duplicate Bank Account Number
    if (cleanAccNum && cleanAccNum.length >= 7) {
      const invAccNum = normalizeAccountNumber(inv.bankDetails?.accountNumber);
      if (invAccNum && invAccNum === cleanAccNum) {
        return {
          isDuplicate: true,
          field: 'accountNumber',
          message: `Registration rejected: The bank account number "${input.accountNumber.trim()}" is already registered to an existing member. Duplicate bank account numbers are not accepted.`,
        };
      }
    }

    // 4. Check duplicate Beneficiary Account Name
    if (cleanAccName && cleanAccName.length >= 3) {
      const invAccName = normalizeNameForComparison(inv.bankDetails?.accountName);
      const invFullName = normalizeNameForComparison(inv.fullName);
      if ((invAccName && invAccName === cleanAccName) || (invFullName && invFullName === cleanAccName)) {
        return {
          isDuplicate: true,
          field: 'accountName',
          message: `Registration rejected: The beneficiary account name "${input.accountName.trim()}" is already registered in the system. Duplicate account names are not accepted.`,
        };
      }
    }

    // 5. Check duplicate Full Legal Name
    if (cleanFullName && cleanFullName.length >= 3) {
      const invFullName = normalizeNameForComparison(inv.fullName);
      const invAccName = normalizeNameForComparison(inv.bankDetails?.accountName);
      if ((invFullName && invFullName === cleanFullName) || (invAccName && invAccName === cleanFullName)) {
        return {
          isDuplicate: true,
          field: 'fullName',
          message: `Registration rejected: An account under the legal name "${input.fullName.trim()}" already exists. Duplicate member names are not accepted.`,
        };
      }
    }
  }

  return { isDuplicate: false };
};
