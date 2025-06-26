import React from 'react';
import { EmotionType } from '../../instruments/emotionTypes';
import { emotionIcons, emotionColors } from '../../instruments/emotionInstruments';
import styles from './EmotionCardSmall.module.css';

interface EmotionCardSmallProps {
  type: EmotionType;
  isSelected: boolean;
  onClick: () => void;
}

const EmotionCardSmall: React.FC<EmotionCardSmallProps> = ({ type, isSelected, onClick }) => {
  const icon = emotionIcons[type];
  const bgColor = emotionColors[type];

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      style={{ background: bgColor }}
      onClick={onClick}
    >
      <span className={styles.icon}>{icon}</span>
      <div className={styles.type}>{type}</div>
    </div>
  );
};

export default EmotionCardSmall; 