import { useState } from 'react';
import { useBankContext } from '../hooks';
import './DepositPanel.css';

export const DepositPanel = () => {
  const { selectedAccountId, deposit, accounts } = useBankContext();
  const [formData, setFormData] = useState({ amount: '', justification: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAccountId) {
      setError('Debe seleccionar una cuenta primero');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('El monto debe ser un valor positivo');
      return;
    }

    // Validar justificación para depósitos >= $1000
    if (amount >= 1000 && !formData.justification.trim()) {
      setError('Los depósitos de $1000 o más requieren justificación');
      return;
    }

    try {
      deposit(selectedAccountId, amount, formData.justification || undefined);
      setFormData({ amount: '', justification: '' });
      setSuccess(`Depósito de $${amount.toFixed(2)} realizado exitosamente`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al realizar el depósito');
    }
  };

  return (
    <div className="deposit-panel">
      <h2>Realizar Depósito</h2>

      {!selectedAccountId ? (
        <div className="warning-message">
          ⚠️ Selecciona una cuenta para realizar un depósito
        </div>
      ) : (
        <>
          <div className="account-info">
            <p>
              <strong>{selectedAccount?.name}</strong> - Saldo: ${selectedAccount?.currentBalance.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="deposit-form">
            <div className="form-group">
              <label htmlFor="amount">Monto a Depositar ($)</label>
              <input
                id="amount"
                type="number"
                placeholder="Ej: 1500.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              {parseFloat(formData.amount) >= 1000 && (
                <small className="note">
                  📌 Este depósito requiere justificación (monto ≥ $1000)
                </small>
              )}
            </div>

            {parseFloat(formData.amount) >= 1000 && (
              <div className="form-group">
                <label htmlFor="justification">Justificación (requerida para depósitos ≥ $1000)</label>
                <input
                  id="justification"
                  type="text"
                  placeholder="Ej: Ahorro mensual, pago de servicios, etc."
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                />
              </div>
            )}

            <button type="submit" className="btn-primary">
              Depositar
            </button>
          </form>
        </>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};
