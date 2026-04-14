import { useBankContext } from '../hooks';
import './BalanceDisplay.css';

export const BalanceDisplay = () => {
  const { selectedAccountId, accounts } = useBankContext();

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  if (!selectedAccountId || !selectedAccount) {
    return (
      <div className="balance-display empty">
        <p>Selecciona una cuenta para ver el saldo</p>
      </div>
    );
  }

  return (
    <div className="balance-display">
      <div className="balance-card">
        <h3>{selectedAccount.name}</h3>
        <p className="balance-label">Saldo Actual</p>
        <p className="balance-amount">${selectedAccount.currentBalance.toFixed(2)}</p>
        <p className="account-id">ID: {selectedAccount.id.substring(0, 8)}...</p>
        <p className="account-created">
          Creada: {new Date(selectedAccount.createdAt).toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
};
