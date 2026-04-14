import { useState, useEffect } from 'react';
import './FloatingButton.css';

export const FloatingButton = () => {
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Mostrar botón "Ir Abajo" si estás en la parte superior (menos de 30% del documento)
      setShowScrollDown(scrollTop < documentHeight * 0.3);

      // Mostrar botón "Ir Arriba" si estás en la parte inferior o en el medio
      setShowScrollUp(scrollTop > windowHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    const statementElement = document.querySelector('.monthly-statement');
    if (statementElement) {
      statementElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Si no encuentra la sección, scroll al final del documento
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showScrollDown && (
        <button
          className="floating-btn scroll-down"
          onClick={scrollToBottom}
          title="Ir a Estado de Cuenta"
          aria-label="Ir abajo"
        >
          ⬇️ Estado de Cuenta
        </button>
      )}

      {showScrollUp && (
        <button
          className="floating-btn scroll-up"
          onClick={scrollToTop}
          title="Volver al inicio"
          aria-label="Ir arriba"
        >
          ⬆️
        </button>
      )}
    </>
  );
};
