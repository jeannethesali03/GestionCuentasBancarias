import { useBankContext } from '../hooks';
import './AccountSelector.css';

export const AccountSelector = () => {
  const { accounts, selectedAccountId, selectAccount } = useBankContext();

  return (
    <div className="account-selector">
      <h3>Seleccionar Cuenta</h3>
      {accounts.length === 0 ? (
        <p className="no-accounts">No hay cuentas disponibles. Crea una nueva cuenta primero.</p>
      ) : (
        <div className="selector-options">
          {accounts.map((account) => (
            <button
              key={account.id}
              className={`selector-btn ${selectedAccountId === account.id ? 'active' : ''}`}
              onClick={() => selectAccount(account.id)}
            >
              <div className="btn-content">
                <strong>{account.name}</strong>
                <span className="btn-balance">${account.currentBalance.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
