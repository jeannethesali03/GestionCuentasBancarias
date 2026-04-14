import { useBankContext } from '../hooks';
import { formatFullDateTime } from '../utils/validators';
import './TransactionHistory.css';

export const TransactionHistory = () => {
  const { selectedAccountId, transactions } = useBankContext();

  const accountTransactions = transactions.filter((t) => t.accountId === selectedAccountId);

  if (!selectedAccountId) {
    return (
      <div className="transaction-history empty">
        <p>Selecciona una cuenta para ver el historial</p>
      </div>
    );
  }

  if (accountTransactions.length === 0) {
    return (
      <div className="transaction-history empty">
        <p>No hay transacciones en esta cuenta</p>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '📥';
      case 'withdrawal':
        return '📤';
      case 'commission':
        return '💸';
      case 'interest':
        return '📊';
      default:
        return '📋';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Retiro';
      case 'commission':
        return 'Comisión';
      case 'interest':
        return 'Interés';
      default:
        return 'Transacción';
    }
  };

  return (
    <div className="transaction-history">
      <h2>Historial de Transacciones ({accountTransactions.length})</h2>
      <div className="transactions-table">
        <div className="table-header">
          <div className="col-type">Tipo</div>
          <div className="col-date">Fecha</div>
          <div className="col-amount">Monto</div>
          <div className="col-balance">Saldo</div>
          <div className="col-justification">Detalle</div>
        </div>
        {[...accountTransactions].reverse().map((tx) => (
          <div key={tx.id} className={`table-row ${tx.type}`}>
            <div className="col-type">
              {getTransactionIcon(tx.type)} {getTransactionLabel(tx.type)}
            </div>
            <div className="col-date">{formatFullDateTime(tx.date)}</div>
            <div className="col-amount">${tx.amount.toFixed(2)}</div>
            <div className="col-balance">${tx.balanceAfter.toFixed(2)}</div>
            <div className="col-justification">
              {tx.justification || (tx.commission ? `Comisión: $${tx.commission.toFixed(2)}` : '-')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
