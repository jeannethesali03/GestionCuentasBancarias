import { useState } from 'react';
import { useBankContext } from '../hooks';
import { formatDate } from '../utils/validators';
import './MonthlyStatement.css';

export const MonthlyStatement = () => {
  const { selectedAccountId, getMonthlyStatement, accounts } = useBankContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  if (!selectedAccountId || !selectedAccount) {
    return (
      <div className="monthly-statement empty">
        <p>Selecciona una cuenta para ver el estado de cuenta</p>
      </div>
    );
  }

  const statement = getMonthlyStatement(selectedAccountId, selectedYear, selectedMonth);

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="monthly-statement">
      <h2>Estado de Cuenta Detallado</h2>

      {/* Selector de mes/año */}
      <div className="month-selector">
        <button onClick={handlePrevMonth} className="btn-nav">
          ← Anterior
        </button>
        <h3>{monthName}</h3>
        <button onClick={handleNextMonth} className="btn-nav">
          Siguiente →
        </button>
      </div>

      {/* Resumen Global */}
      <div className="summary-global">
        <h3>Resumen Global</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <p className="label">Saldo Inicial</p>
            <p className="value">${statement.initialBalance.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <p className="label">Saldo Final</p>
            <p className="value highlight">${statement.finalBalance.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <p className="label">Total Movimientos</p>
            <p className="value">
              ${(statement.totalDeposits + statement.totalWithdrawals + statement.totalInterests).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen del Período */}
      <div className="summary-period">
        <h3>Resumen del Período</h3>
        <div className="summary-grid">
          <div className="summary-card deposits">
            <p className="label">📥 Total Depósitos</p>
            <p className="value">${statement.totalDeposits.toFixed(2)}</p>
          </div>
          <div className="summary-card withdrawals">
            <p className="label">📤 Total Retiros</p>
            <p className="value">${statement.totalWithdrawals.toFixed(2)}</p>
          </div>
          <div className="summary-card commissions">
            <p className="label">💸 Total Comisiones</p>
            <p className="value">${statement.totalCommissions.toFixed(2)}</p>
          </div>
          <div className="summary-card interests">
            <p className="label">📊 Total Intereses</p>
            <p className="value">${statement.totalInterests.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Detalle de Transacciones */}
      <div className="transactions-detail">
        <h3>Detalle de Transacciones</h3>
        {statement.transactions.length === 0 ? (
          <p className="no-transactions">No hay transacciones en este período</p>
        ) : (
          <div className="transactions-table">
            <div className="table-header">
              <div className="col-date">Fecha</div>
              <div className="col-type">Tipo</div>
              <div className="col-amount">Monto</div>
              <div className="col-detail">Detalle</div>
            </div>
            {statement.transactions.map((tx) => (
              <div key={tx.id} className={`table-row ${tx.type}`}>
                <div className="col-date">{formatDate(tx.date)}</div>
                <div className="col-type">
                  {tx.type === 'deposit' && '📥 Depósito'}
                  {tx.type === 'withdrawal' && '📤 Retiro'}
                  {tx.type === 'commission' && '💸 Comisión'}
                  {tx.type === 'interest' && '📊 Interés'}
                </div>
                <div className="col-amount">${tx.amount.toFixed(2)}</div>
                <div className="col-detail">
                  {tx.justification || tx.commission ? (
                    <span>{tx.justification || `Comisión: $${tx.commission?.toFixed(2)}`}</span>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen Final */}
      <div className="final-summary">
        <div className="summary-item">
          <span>Ingresos Totales (Depósitos + Intereses):</span>
          <strong>${(statement.totalDeposits + statement.totalInterests).toFixed(2)}</strong>
        </div>
        <div className="summary-item">
          <span>Egresos Totales (Retiros + Comisiones):</span>
          <strong>${(statement.totalWithdrawals + statement.totalCommissions).toFixed(2)}</strong>
        </div>
        <div className="summary-item highlight">
          <span>Movimiento Neto:</span>
          <strong className="net-movement">
            ${(
              statement.totalDeposits -
              statement.totalWithdrawals +
              statement.totalInterests -
              statement.totalCommissions
            ).toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
};
