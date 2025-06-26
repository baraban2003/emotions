import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { Button } from '../button';
import { CloseIcon } from '../close-icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <CloseIcon
          className={styles.closeBtn}
          onClick={onClose}
          ariaLabel="Закрити"
        />
        {children}
      </div>
    </div>
  );
};

export default Modal; 