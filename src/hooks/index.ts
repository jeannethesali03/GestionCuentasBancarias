import { useContext } from 'react';
import { BankContext } from '../context/BankContext';
import type { Transaction } from '../types';
import { getDateFromIso, isSameDay } from '../utils/validators';

export const useBankContext = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBankContext debe usarse dentro de BankProvider');
  }
  return context;
};

// Hook para obtener retiros del día actual
export const useDailyWithdrawals = (accountId: string | null): Transaction[] => {
  const { transactions } = useBankContext();

  if (!accountId) return [];

  const today = new Date();
  return transactions.filter((t) => {
    if (t.accountId !== accountId || t.type !== 'withdrawal') return false;
    const txDate = getDateFromIso(t.date);
    return isSameDay(txDate, today);
  });
};

// Hook para obtener comisiones aplicables
export const useCommissions = (accountId: string | null): number => {
  const dailyWithdrawals = useDailyWithdrawals(accountId);
  // Cada retiro después del primero tiene comisión de $1
  return dailyWithdrawals.length > 0 ? 1 : 0;
};

// Hook para calcular interés
export const useInterestCalculator = () => {
  const calculateInterest = (capital: number, annualRate: number, months: number): number => {
    const years = months / 12;
    return capital * (annualRate / 100) * years;
  };

  return { calculateInterest };
};
