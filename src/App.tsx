import { BankProvider } from './context/BankContext';
import {
  AccountForm,
  AccountSelectorModal,
  BalanceDisplay,
  DepositPanel,
  WithdrawPanel,
  InterestCalculator,
  TransactionHistory,
  MonthlyStatement,
  DataManager,
  FloatingButton,
} from './components';
import './App.css';

function AppContent() {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>🏦 Sistema de Gestión de Cuentas Bancarias</h1>
        <p className="subtitle">Administra tus cuentas, transacciones e intereses</p>
      </header>

      {/* Botón Flotante */}
      <FloatingButton />

      {/* Selector de Cuentas Modal */}
      <AccountSelectorModal />

      {/* Sección Principal */}
      <div className="main-content">
        {/* Columna Izquierda - Gestión de Cuentas */}
        <aside className="sidebar">
          <AccountForm />
          <hr />
          <BalanceDisplay />
          <DataManager />
        </aside>

        {/* Columna Derecha - Operaciones y Estados */}
        <main className="main-panel">
          {/* Operaciones Financieras */}
          <section className="operations-section">
            <div className="operations-grid">
              <div className="operation-card">
                <DepositPanel />
              </div>
              <div className="operation-card">
                <WithdrawPanel />
              </div>
              <div className="operation-card">
                <InterestCalculator />
              </div>
            </div>
          </section>

          <hr className="section-divider" />

          {/* Historial y Estado de Cuenta */}
          <section className="statements-section">
            <div className="statement-grid">
              <div className="statement-card">
                <TransactionHistory />
              </div>
              <div className="statement-card full-width">
                <MonthlyStatement />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 - Gestión de Cuentas Bancarias | React + TypeScript | Sin Base de Datos Externa</p>
        <p className="storage-note">💾 Datos persistidos en localStorage</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BankProvider>
      <AppContent />
    </BankProvider>
  );
}
