// Validadores
export const validateAmount = (amount: number): { valid: boolean; error?: string } => {
  if (amount < 0) {
    return { valid: false, error: 'El monto no puede ser negativo' };
  }
  if (amount === 0) {
    return { valid: false, error: 'El monto debe ser mayor a 0' };
  }
  return { valid: true };
};

export const validateDepositAmount = (amount: number, requiresJustification: boolean): { valid: boolean; error?: string } => {
  const amountValidation = validateAmount(amount);
  if (!amountValidation.valid) return amountValidation;

  if (amount >= 1000 && !requiresJustification) {
    return { valid: false, error: 'Los depósitos ≥ $1000 requieren justificación' };
  }

  return { valid: true };
};

export const validateWithdrawalAmount = (amount: number, balance: number, dailyAccumulated: number): { valid: boolean; error?: string } => {
  const amountValidation = validateAmount(amount);
  if (!amountValidation.valid) return amountValidation;

  if (amount > balance) {
    return { valid: false, error: `No hay suficiente saldo. Saldo disponible: $${balance.toFixed(2)}` };
  }

  if (dailyAccumulated + amount > 1000) {
    return { valid: false, error: `Límite diario excedido. Límite: $1000, Acumulado hoy: $${dailyAccumulated.toFixed(2)}` };
  }

  return { valid: true };
};

// Cálculo de interés simple: I = C * r * t
export const calculateSimpleInterest = (capital: number, annualRate: number, years: number): number => {
  return capital * (annualRate / 100) * years;
};

// Helper para convertir meses a años
export const monthsToYears = (months: number): number => {
  return months / 12;
};

// Funciones de fecha
export const getToday = (): string => {
  return new Date().toISOString();
};

export const getDateFromIso = (iso: string): Date => {
  return new Date(iso);
};

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatFullDateTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getMonthYear = (iso: string): { year: number; month: number } => {
  const date = new Date(iso);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

export const isSameMonthYear = (iso: string, year: number, month: number): boolean => {
  const dateInfo = getMonthYear(iso);
  return dateInfo.year === year && dateInfo.month === month;
};
