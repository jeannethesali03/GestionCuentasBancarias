import { useState } from 'react';
import { useBankContext } from '../hooks';
import './AccountSelectorModal.css';

export const AccountSelectorModal = () => {
  const { accounts, selectedAccountId } = useBankContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAccount = (accountId: string) => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {/* Botón para abrir modal */}
      <div className="account-selector-button-container">
        <button className="account-selector-open-btn" onClick={() => setIsOpen(true)}>
          <span className="btn-icon">📋</span>
          <span className="btn-text">
            {selectedAccount ? selectedAccount.name : 'Seleccionar Cuenta'}
          </span>
          <span className="btn-count">
            {accounts.length > 0 && `(${accounts.length})`}
          </span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <h2>Cuentas Registradas</h2>
              <button
                className="modal-close-btn"
                onClick={() => setIsOpen(false)}
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {accounts.length === 0 ? (
                <p className="no-accounts-msg">No hay cuentas disponibles. Crea una nueva cuenta primero.</p>
              ) : (
                <>
                  {/* Search Box */}
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="🔍 Buscar cuenta por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      autoFocus
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

                  {/* Accounts List */}
                  <div className="accounts-list">
                    {filteredAccounts.length === 0 ? (
                      <p className="no-results">No se encontraron cuentas con "{searchTerm}"</p>
                    ) : (
                      filteredAccounts.map((account) => (
                        <AccountButton
                          key={account.id}
                          account={account}
                          isSelected={selectedAccountId === account.id}
                          onSelect={() => handleSelectAccount(account.id)}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function AccountButton({
  account,
  isSelected,
  onSelect,
}: {
  account: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { selectAccount } = useBankContext();

  const handleClick = () => {
    selectAccount(account.id);
    onSelect();
  };

  return (
    <button
      className={`account-btn ${isSelected ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="account-btn-content">
        <div className="account-info">
          <strong>{account.name}</strong>
          <span className="account-id">ID: {account.id.slice(0, 8)}...</span>
        </div>
        <span className="account-balance">${account.currentBalance.toFixed(2)}</span>
      </div>
    </button>
  );
}
