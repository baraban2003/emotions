import React from 'react';
import styles from './CloseIcon.module.css';

interface CloseIconProps {
  width?: number;
  height?: number;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  className?: string;
  tabIndex?: number;
  ariaLabel?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({
  width = 20,
  height = 20,
  onClick,
  className = '',
  tabIndex = 0,
  ariaLabel = 'Закрити',
}) => (
  <span
    className={`${styles.icon} ${className}`}
    onClick={onClick}
    tabIndex={tabIndex}
    role="button"
    aria-label={ariaLabel}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e as any);
      }
    }}
  >
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line className={styles.line} x1="5" y1="5" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" />
      <line className={styles.line} x1="15" y1="5" x2="5" y2="15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </span>
);

export default CloseIcon; 