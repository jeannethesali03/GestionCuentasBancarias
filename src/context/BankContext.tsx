import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { Account, BankContextType, MonthlyStatement, Transaction } from '../types';
import {
  validateAmount,
  validateDepositAmount,
  validateWithdrawalAmount,
  getToday,
  getDateFromIso,
  isSameDay,
  isSameMonthYear,
} from '../utils/validators';

const STORAGE_KEY = 'bank_data';

export const BankContext = createContext<BankContextType | undefined>(undefined);

interface BankState {
  accounts: Account[];
  transactions: Transaction[];
  selectedAccountId: string | null;
}

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BankState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { accounts: [], transactions: [], selectedAccountId: null };
      }
    }
    return { accounts: [], transactions: [], selectedAccountId: null };
  });

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Generar UUID simple (sin dependencia externa)
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const createAccount = useCallback((name: string, initialBalance: number) => {
    const validation = validateAmount(initialBalance);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newAccount: Account = {
      id: generateUUID(),
      name,
      initialBalance,
      currentBalance: initialBalance,
      createdAt: getToday(),
    };

    setState((prev) => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
      selectedAccountId: newAccount.id,
    }));
  }, []);

  const selectAccount = useCallback((accountId: string) => {
    setState((prev) => ({
      ...prev,
      selectedAccountId: accountId,
    }));
  }, []);

  const deposit = useCallback(
    (accountId: string, amount: number, justification?: string) => {
      setState((prev) => {
        const account = prev.accounts.find((a) => a.id === accountId);
        if (!account) throw new Error('Cuenta no encontrada');

        const requiresJustification = amount >= 1000;
        const validation = validateDepositAmount(amount, requiresJustification && !!justification);
        if (!validation.valid) throw new Error(validation.error);

        const newBalance = account.currentBalance + amount;
        const updatedAccounts = prev.accounts.map((a) =>
          a.id === accountId ? { ...a, currentBalance: newBalance } : a
        );

        const newTransaction: Transaction = {
          id: generateUUID(),
          accountId,
          type: 'deposit',
          amount,
          date: getToday(),
          justification: requiresJustification ? justification : undefined,
          balanceAfter: newBalance,
        };

        return {
          ...prev,
          accounts: updatedAccounts,
          transactions: [...prev.transactions, newTransaction],
        };
      });
    },
    []
  );

  const withdraw = useCallback((accountId: string, amount: number) => {
    setState((prev) => {
      const account = prev.accounts.find((a) => a.id === accountId);
      if (!account) throw new Error('Cuenta no encontrada');

      // Calcular acumulado de retiros del día
      const today = new Date();
      const todayString = today.toISOString();
      const dailyWithdrawals = prev.transactions.filter((t) => {
        if (t.accountId !== accountId || t.type !== 'withdrawal') return false;
        const txDate = getDateFromIso(t.date);
        return isSameDay(txDate, today);
      });

      const dailyAccumulated = dailyWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);

      const validation = validateWithdrawalAmount(amount, account.currentBalance, dailyAccumulated);
      if (!validation.valid) throw new Error(validation.error);

      // Calcular comisión (2do retiro en adelante = $1)
      const commission = dailyWithdrawals.length > 0 ? 1 : 0;
      const totalDebit = amount + commission;
      const newBalance = account.currentBalance - totalDebit;

      const updatedAccounts = prev.accounts.map((a) =>
        a.id === accountId ? { ...a, currentBalance: newBalance } : a
      );

      const transactions: Transaction[] = [];

      // Transacción de retiro
      const withdrawalTransaction: Transaction = {
        id: generateUUID(),
        accountId,
        type: 'withdrawal',
        amount,
        date: todayString,
        balanceAfter: newBalance,
      };
      transactions.push(withdrawalTransaction);

      // Transacción de comisión (si aplica)
      if (commission > 0) {
        const commissionTransaction: Transaction = {
          id: generateUUID(),
          accountId,
          type: 'commission',
          amount: commission,
          date: todayString,
          balanceAfter: newBalance,
        };
        transactions.push(commissionTransaction);
      }

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [...prev.transactions, ...transactions],
      };
    });
  }, []);

  const addInterest = useCallback((accountId: string, rate: number, monthsCount: number) => {
    setState((prev) => {
      const account = prev.accounts.find((a) => a.id === accountId);
      if (!account) throw new Error('Cuenta no encontrada');

      const years = monthsCount / 12;
      const interestAmount = account.currentBalance * (rate / 100) * years;
      const newBalance = account.currentBalance + interestAmount;

      const updatedAccounts = prev.accounts.map((a) =>
        a.id === accountId ? { ...a, currentBalance: newBalance } : a
      );

      const interestTransaction: Transaction = {
        id: generateUUID(),
        accountId,
        type: 'interest',
        amount: interestAmount,
        date: getToday(),
        balanceAfter: newBalance,
      };

      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [...prev.transactions, interestTransaction],
      };
    });
  }, []);

  const getTransactionsByMonth = useCallback(
    (accountId: string, year: number, month: number): Transaction[] => {
      return state.transactions.filter(
        (t) => t.accountId === accountId && isSameMonthYear(t.date, year, month)
      );
    },
    [state.transactions]
  );

  const getMonthlyStatement = useCallback(
    (accountId: string, year: number, month: number): MonthlyStatement => {
      const transactions = getTransactionsByMonth(accountId, year, month);
      const account = state.accounts.find((a) => a.id === accountId);

      if (!account) {
        throw new Error('Cuenta no encontrada');
      }

      // Calcular totales
      const totalDeposits = transactions
        .filter((t) => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawals = transactions
        .filter((t) => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalCommissions = transactions
        .filter((t) => t.type === 'commission')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalInterests = transactions
        .filter((t) => t.type === 'interest')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calcular saldos
      const balanceBeforeMonth = transactions.length > 0
        ? transactions[0].balanceAfter - transactions[0].amount - (transactions[0].commission || 0)
        : account.currentBalance;

      const finalBalance = transactions.length > 0
        ? transactions[transactions.length - 1].balanceAfter
        : account.currentBalance;

      return {
        year,
        month,
        totalDeposits,
        totalWithdrawals,
        totalCommissions,
        totalInterests,
        initialBalance: balanceBeforeMonth,
        finalBalance,
        transactions,
      };
    },
    [state.accounts, state.transactions, getTransactionsByMonth]
  );

  const value: BankContextType = {
    accounts: state.accounts,
    transactions: state.transactions,
    selectedAccountId: state.selectedAccountId,
    createAccount,
    selectAccount,
    deposit,
    withdraw,
    addInterest,
    getTransactionsByMonth,
    getMonthlyStatement,
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};
