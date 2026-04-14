import { useState } from 'react';
import { useBankContext } from '../hooks';
import './AccountForm.css';

export const AccountForm = () => {
  const { createAccount } = useBankContext();
  const [formData, setFormData] = useState({ name: '', initialBalance: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('El nombre del titular es requerido');
      return;
    }

    const balance = parseFloat(formData.initialBalance);
    if (isNaN(balance) || balance < 0) {
      setError('El saldo inicial debe ser un número positivo');
      return;
    }

    if (balance === 0) {
      setError('El saldo inicial debe ser mayor a 0');
      return;
    }

    try {
      createAccount(formData.name.trim(), balance);
      setFormData({ name: '', initialBalance: '' });
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

        <button type="submit" className="btn-primary">
          Crear Cuenta
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

    </div>
  );
};
