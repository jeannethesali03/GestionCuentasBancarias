import { useBankContext } from '../hooks';
import './DataManager.css';

export const DataManager = () => {
  const { accounts, selectedAccountId, deleteAccount, clearAllData } = useBankContext();

  const handleDeleteAccount = () => {
    if (!selectedAccountId) {
      alert('Por favor selecciona una cuenta primero');
      return;
    }

    const account = accounts.find((a) => a.id === selectedAccountId);
    if (!account) return;

    const confirmed = window.confirm(
      `⚠️ ¿Estás seguro de que deseas eliminar la cuenta "${account.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      deleteAccount(selectedAccountId);
      alert('✅ Cuenta eliminada exitosamente');
    }
  };

  const handleClearAllData = () => {
    const confirmed = window.confirm(
      `⚠️ ¿Estás completamente seguro de que deseas BORRAR TODOS LOS DATOS?\n\nEsto eliminará:\n• Todas las cuentas\n• Todos las transacciones\n• Todo el historial\n\nEsta acción NO se puede deshacer.`
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        `🔥 ÚLTIMA CONFIRMACIÓN:\n\n¿Deseas borrar permanentemente todos los datos del sistema?`
      );

      if (doubleConfirm) {
        clearAllData();
        alert('✅ Todos los datos han sido eliminados. El sistema ha sido reiniciado.');
      }
    }
  };

  return (
    <div className="data-manager">
      <h3>⚙️ Gestión de Datos</h3>
      <div className="button-group">
        <button
          className="btn btn-danger"
          onClick={handleDeleteAccount}
          disabled={!selectedAccountId || accounts.length === 0}
          title="Eliminar la cuenta seleccionada"
        >
          🗑️ Eliminar Cuenta
        </button>
        <button
          className="btn btn-danger-critical"
          onClick={handleClearAllData}
          title="Borrar todos los datos del sistema"
        >
          🔥 Borrar Todo
        </button>
      </div>
    </div>
  );
};
