import { useState } from 'react';
import { useBankContext, useDailyWithdrawals } from '../hooks';
import { validateWithdrawalAmount } from '../utils/validators';
import './WithdrawPanel.css';

export const WithdrawPanel = () => {
  const { selectedAccountId, withdraw, accounts } = useBankContext();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const dailyWithdrawals = useDailyWithdrawals(selectedAccountId);

  // Calcular acumulado del día
  const dailyAccumulated = dailyWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);
  const remainingDaily = 1000 - dailyAccumulated;

  // Calcular comisión proyectada
  const projectedCommission = dailyWithdrawals.length > 0 ? 1 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAccountId) {
      setError('Debe seleccionar una cuenta primero');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('El monto debe ser un valor positivo');
      return;
    }

    const validation = validateWithdrawalAmount(
      withdrawAmount,
      selectedAccount?.currentBalance || 0,
      dailyAccumulated
    );

    if (!validation.valid) {
      setError(validation.error || 'Error en la validación');
      return;
    }

    try {
      withdraw(selectedAccountId, withdrawAmount);
      setAmount('');
      setSuccess(
        `Retiro de $${withdrawAmount.toFixed(2)} realizado exitosamente${
          projectedCommission > 0 ? ` (Comisión: $${projectedCommission.toFixed(2)})` : ''
        }`
      );
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al realizar el retiro');
    }
  };

  return (
    <div className="withdraw-panel">
      <h2>Realizar Retiro</h2>

      {!selectedAccountId ? (
        <div className="warning-message">
          ⚠️ Selecciona una cuenta para realizar un retiro
        </div>
      ) : (
        <>
          <div className="account-info">
            <p>
              <strong>{selectedAccount?.name}</strong> - Saldo: ${selectedAccount?.currentBalance.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="withdraw-form">
            <div className="form-group">
              <label htmlFor="amount">Monto a Retirar ($)</label>
              <input
                id="amount"
                type="number"
                placeholder="Ej: 500.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">
              Retirar
            </button>
          </form>

          {/* Estado del límite diario */}
          <div className="daily-limit-info">
            <h4>Límite Diario de Retiros</h4>
            <div className="limit-bar">
              <div
                className="limit-used"
                style={{ width: `${(dailyAccumulated / 1000) * 100}%` }}
              ></div>
            </div>
            <p>
              Retiros hoy: ${dailyAccumulated.toFixed(2)} / $1000.00
              <br />
              Disponible hoy: ${remainingDaily.toFixed(2)}
            </p>
          </div>

          {/* Información de retiros del día */}
          {dailyWithdrawals.length > 0 && (
            <div className="daily-withdrawals">
              <h4>Retiros Registrados Hoy ({dailyWithdrawals.length})</h4>
              <ul>
                {dailyWithdrawals.map((tx, index) => (
                  <li key={tx.id}>
                    Retiro #{index + 1}: ${tx.amount.toFixed(2)}
                    {index > 0 && <span className="commission-badge">+$1 comisión</span>}
                  </li>
                ))}
              </ul>
              {dailyWithdrawals.length > 0 && (
                <p className="commission-info">
                  💡 El próximo retiro tendrá una comisión de <strong>$1.00</strong>
                </p>
              )}
            </div>
          )}
        </>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};
