export type TransactionType = 'deposit' | 'withdrawal' | 'commission' | 'interest';

export interface Account {
  id: string; // UUID
  name: string;
  initialBalance: number;
  currentBalance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO format timestamp
  justification?: string;
  commission?: number;
  balanceAfter: number;
}

export interface BankContextType {
  accounts: Account[];
  transactions: Transaction[];
  selectedAccountId: string | null;
  createAccount: (name: string, initialBalance: number, justification?: string) => void;
  selectAccount: (accountId: string) => void;
  deposit: (accountId: string, amount: number, justification?: string) => void;
  withdraw: (accountId: string, amount: number) => void;
  addInterest: (accountId: string, rate: number, monthsCount: number) => void;
  getTransactionsByMonth: (accountId: string, year: number, month: number) => Transaction[];
  getTransactionsByDateRange: (accountId: string, startDate: string, endDate: string) => Transaction[];
  getMonthlyStatement: (accountId: string, year: number, month: number) => MonthlyStatement;
  deleteAccount: (accountId: string) => void;
  clearAllData: () => void;
}

export interface MonthlyStatement {
  year: number;
  month: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalCommissions: number;
  totalInterests: number;
  initialBalance: number;
  finalBalance: number;
  transactions: Transaction[];
}
