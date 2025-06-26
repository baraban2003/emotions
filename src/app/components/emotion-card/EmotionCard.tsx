import React, { useRef, useState } from 'react';
import { Emotion } from '../../store';
import styles from './EmotionCard.module.css';
import { emotionIcons, emotionColors } from '../../instruments/emotionInstruments';
import { CloseIcon } from '../ui/close-icon';

interface EmotionCardProps {
  emotion: Emotion;
  onDelete?: (id: string) => void;
}

const SWIPE_THRESHOLD = 80;

const EmotionCard: React.FC<EmotionCardProps> = ({ emotion, onDelete }) => {
  const icon = emotionIcons[emotion.type];
  const bgColor = emotionColors[emotion.type];

  // Swipe state
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current !== null) {
      const delta = e.touches[0].clientX - startX.current;
      if (delta < 0) setSwipeX(delta);
    }
  };

  const handleTouchEnd = () => {
    if (swipeX < -SWIPE_THRESHOLD && onDelete) {
      onDelete(emotion.id);
    }
    setSwipeX(0);
    setSwiping(false);
    startX.current = null;
  };

  return (
    <div
      className={styles.card + (swiping ? ' ' + styles.swiping : '')}
      style={{ background: bgColor, transform: swipeX ? `translateX(${swipeX}px)` : undefined }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <span className={styles.icon}>{icon}</span>
      <div className={styles.type}>{emotion.type}</div>
      <div className={styles.comment}>{emotion.comment}</div>
      {onDelete && (
        <CloseIcon
          className={styles.deleteBtn}
          onClick={() => onDelete(emotion.id)}
          ariaLabel="Видалити"
        />
      )}
    </div>
  );
};

export default EmotionCard; 