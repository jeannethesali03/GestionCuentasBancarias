import { useState } from 'react';
import { useBankContext } from '../hooks';
import './AccountSelector.css';

export const AccountSelector = () => {
  const { accounts, selectedAccountId, selectAccount } = useBankContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="account-selector">
      <h3>Seleccionar Cuenta</h3>
      {accounts.length === 0 ? (
        <p className="no-accounts">No hay cuentas disponibles. Crea una nueva cuenta primero.</p>
      ) : (
        <>
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar cuenta por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          <div className="selector-options">
            {filteredAccounts.length === 0 ? (
              <p className="no-results">No se encontraron cuentas con "{searchTerm}"</p>
            ) : (
              filteredAccounts.map((account) => (
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
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
