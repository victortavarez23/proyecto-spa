import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button'; // Asegúrate de que la ruta sea correcta
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  // Efecto para manejar el escape key y el scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restaurar scroll
    };
  }, [isOpen, onClose]);

  // Manejar click fuera del modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Renderizar usando Portal
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal--${size}`}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <Button
            variant="text"
            className="modal__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </Button>
        </div>

        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;