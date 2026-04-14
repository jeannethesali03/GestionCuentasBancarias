import { useState } from 'react';
import { useBankContext } from '../hooks';
import { formatDate } from '../utils/validators';
import './MonthlyStatement.css';

export const MonthlyStatement = () => {
  const { selectedAccountId, getMonthlyStatement, getTransactionsByDateRange, accounts } = useBankContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);
  const [filterMode, setFilterMode] = useState<'month' | 'range'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  if (!selectedAccountId || !selectedAccount) {
    return (
      <div className="monthly-statement empty">
        <p>Selecciona una cuenta para ver el estado de cuenta</p>
      </div>
    );
  }

  // Obtener transacciones según el modo de filtro
  let transactions, statement;

  if (filterMode === 'range' && startDate && endDate) {
    // Modo: rango de fechas
    const today = new Date().toISOString().split('T')[0];
    transactions = getTransactionsByDateRange(selectedAccountId, startDate, endDate);

    // Calcular saldos para el rango
    const account = accounts.find((a) => a.id === selectedAccountId);
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

    const balanceBeforeRange = transactions.length > 0
      ? transactions[0].balanceAfter - transactions[0].amount - (transactions[0].commission || 0)
      : account?.currentBalance || 0;

    const finalBalance = transactions.length > 0
      ? transactions[transactions.length - 1].balanceAfter
      : account?.currentBalance || 0;

    statement = {
      year: new Date(startDate).getFullYear(),
      month: new Date(startDate).getMonth() + 1,
      totalDeposits,
      totalWithdrawals,
      totalCommissions,
      totalInterests,
      initialBalance: balanceBeforeRange,
      finalBalance,
      transactions,
    };
  } else {
    // Modo: mes y año
    statement = getMonthlyStatement(selectedAccountId, selectedYear, selectedMonth);
  }

  const monthName = filterMode === 'range' && startDate && endDate
    ? `${new Date(startDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} - ${new Date(endDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}`
    : new Date(selectedYear, selectedMonth - 1).toLocaleDateString('es-ES', {
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

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleQuickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month] = e.target.value.split('-');
    if (year && month) {
      setSelectedYear(parseInt(year));
      setSelectedMonth(parseInt(month));
    }
  };

  const handleApplyRangeFilter = () => {
    if (!startDate || !endDate) {
      alert('Por favor selecciona ambas fechas');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('La fecha inicial debe ser menor a la fecha final');
      return;
    }
    setFilterMode('range');
    setShowCalendar(false);
  };

  const handleClearRangeFilter = () => {
    setFilterMode('month');
    setStartDate('');
    setEndDate('');
  };

  // Generar rango de años (5 años atrás a 5 años adelante)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="monthly-statement">
      <h2>Estado de Cuenta Detallado</h2>

      {/* Selector de mes/año - o rango de fechas */}
      {filterMode === 'month' ? (
        <div className="month-selector">
          <button onClick={handlePrevMonth} className="btn-nav">
            ← Anterior
          </button>
          <h3>{monthName}</h3>
          <button onClick={handleNextMonth} className="btn-nav">
            Siguiente →
          </button>
        </div>
      ) : (
        <div className="date-range-display">
          <h3>📅 {monthName}</h3>
          <button onClick={handleClearRangeFilter} className="btn-clear-range">
            ✕ Mostrar mes/año
          </button>
        </div>
      )}

      {/* Selector rápido de mes/año o rango */}
      <div className="quick-date-selector">
        <button
          className="btn-calendar"
          onClick={() => setShowCalendar(!showCalendar)}
          title="Abrir selector de calendario"
        >
          📅 {filterMode === 'month' ? 'Ir a otra fecha' : 'Cambiar filtro'}
        </button>

        {showCalendar && (
          <div className="calendar-picker">
            {/* Tab para cambiar entre modo mes y rango */}
            <div className="mode-tabs">
              <button
                className={`tab-btn ${filterMode === 'month' ? 'active' : ''}`}
                onClick={() => {
                  setFilterMode('month');
                  setStartDate('');
                  setEndDate('');
                }}
              >
                📆 Mes/Año
              </button>
              <button
                className={`tab-btn ${filterMode === 'range' ? 'active' : ''}`}
                onClick={() => setFilterMode('range')}
              >
                📊 Rango de Fechas
              </button>
            </div>

            {filterMode === 'month' ? (
              <>
                <div className="picker-row">
                  <div className="picker-group">
                    <label htmlFor="month-select">Mes</label>
                    <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                      <option value={1}>Enero</option>
                      <option value={2}>Febrero</option>
                      <option value={3}>Marzo</option>
                      <option value={4}>Abril</option>
                      <option value={5}>Mayo</option>
                      <option value={6}>Junio</option>
                      <option value={7}>Julio</option>
                      <option value={8}>Agosto</option>
                      <option value={9}>Septiembre</option>
                      <option value={10}>Octubre</option>
                      <option value={11}>Noviembre</option>
                      <option value={12}>Diciembre</option>
                    </select>
                  </div>

                  <div className="picker-group">
                    <label htmlFor="year-select">Año</label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="picker-row">
                  <label htmlFor="quick-date">O selecciona directamente:</label>
                  <input
                    id="quick-date"
                    type="month"
                    value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
                    onChange={handleQuickDate}
                    className="month-input"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="picker-row">
                  <div className="picker-group">
                    <label htmlFor="start-date">Fecha Inicio</label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="date-input"
                    />
                  </div>

                  <div className="picker-group">
                    <label htmlFor="end-date">Fecha Fin</label>
                    <input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                </div>

                <button className="btn-apply-range" onClick={handleApplyRangeFilter}>
                  ✓ Aplicar Filtro
                </button>
              </>
            )}

            <button
              className="btn-close-calendar"
              onClick={() => setShowCalendar(false)}
            >
              ✓ Cerrar
            </button>
          </div>
        )}
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
