import { useState } from 'react';
import { useBankContext, useInterestCalculator } from '../hooks';
import './InterestCalculator.css';

export const InterestCalculator = () => {
  const { selectedAccountId, addInterest, accounts } = useBankContext();
  const { calculateInterest } = useInterestCalculator();
  const [formData, setFormData] = useState({ rate: '5', months: '12' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const rate = parseFloat(formData.rate) || 0;
  const months = parseFloat(formData.months) || 0;
  const projectedInterest = selectedAccount
    ? calculateInterest(selectedAccount.currentBalance, rate, months)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAccountId) {
      setError('Debe seleccionar una cuenta primero');
      return;
    }

    if (rate < 0) {
      setError('La tasa de interés no puede ser negativa');
      return;
    }

    if (months <= 0) {
      setError('El período debe ser mayor a 0');
      return;
    }

    try {
      addInterest(selectedAccountId, rate, months);
      setSuccess(
        `Interés de $${projectedInterest.toFixed(2)} añadido a la cuenta (${rate}% anual, ${months} meses)`
      );
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular interés');
    }
  };

  return (
    <div className="interest-calculator">
      <h2>Calcular Interés Simple</h2>

      {!selectedAccountId ? (
        <div className="warning-message">
          ⚠️ Selecciona una cuenta para calcular intereses
        </div>
      ) : (
        <>
          <div className="account-info">
            <p>
              <strong>{selectedAccount?.name}</strong> - Saldo: ${selectedAccount?.currentBalance.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="interest-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rate">Tasa Anual (%)</label>
                <input
                  id="rate"
                  type="number"
                  placeholder="Ej: 5"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="months">Período (meses)</label>
                <input
                  id="months"
                  type="number"
                  placeholder="Ej: 12"
                  step="1"
                  min="1"
                  max="120"
                  value={formData.months}
                  onChange={(e) => setFormData({ ...formData, months: e.target.value })}
                />
              </div>
            </div>

            <div className="interest-preview">
              <h4>Cálculo: I = C · r · t</h4>
              <p>
                I = ${selectedAccount?.currentBalance.toFixed(2)} × {rate}% × {(months / 12).toFixed(2)} años
              </p>
              <p className="interest-result">
                Interés Generado: <strong>${projectedInterest.toFixed(2)}</strong>
              </p>
              <p className="new-balance">
                Nuevo Saldo: ${(selectedAccount ? selectedAccount.currentBalance + projectedInterest : 0).toFixed(2)}
              </p>
            </div>

            <button type="submit" className="btn-primary">
              Aplicar Interés
            </button>
          </form>
        </>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};
