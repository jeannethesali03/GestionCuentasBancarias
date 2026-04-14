import { useState } from 'react';
import { useBankContext } from '../hooks';
import './AccountForm.css';

export const AccountForm = () => {
  const { createAccount } = useBankContext();
  const [formData, setFormData] = useState({ name: '', initialBalance: '', justification: 'Depósito inicial' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const balance = formData.initialBalance ? parseFloat(formData.initialBalance) : 0;
  const requiresJustification = balance >= 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('El nombre del titular es requerido');
      return;
    }

    const balanceNum = parseFloat(formData.initialBalance);
    if (isNaN(balanceNum) || balanceNum < 0) {
      setError('El saldo inicial debe ser un número positivo');
      return;
    }

    if (balanceNum === 0) {
      setError('El saldo inicial debe ser mayor a 0');
      return;
    }

    if (requiresJustification && !formData.justification.trim()) {
      setError('La justificación es requerida para depósitos >= $1,000');
      return;
    }

    try {
      createAccount(formData.name.trim(), balanceNum, requiresJustification ? formData.justification : undefined);
      setFormData({ name: '', initialBalance: '', justification: 'Depósito inicial' });
      setSuccess(`Cuenta creada exitosamente para ${formData.name}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    }
  };

  return (
    <div className="account-form-container">
      <h2>Gestión de Cuentas</h2>

      <form onSubmit={handleSubmit} className="account-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Titular</label>
          <input
            id="name"
            type="text"
            placeholder="Ej: Ana Pérez"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="balance">Saldo Inicial ($)</label>
          <input
            id="balance"
            type="number"
            placeholder="Ej: 500.00"
            step="0.01"
            min="0"
            value={formData.initialBalance}
            onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
          />
        </div>

        {requiresJustification && (
          <div className="form-group justification-field">
            <label htmlFor="justification">
              📝 Justificación (Depósito ≥ $1,000)
            </label>
            <input
              id="justification"
              type="text"
              placeholder="Ej: Ahorro mensual, pago de servicios..."
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
            />
            <small>Valor por defecto: "Depósito inicial"</small>
          </div>
        )}

        <button type="submit" className="btn-primary">
          Crear Cuenta
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

    </div>
  );
};
