import React, { useState } from 'react';
import { EmotionType } from '../../instruments/emotionTypes';
import { emotionTypes } from '../../instruments/emotionTypes';
import { EmotionCardSmall } from '../emotion-card-small';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import styles from './AddEmotion.module.css';

interface AddEmotionProps {
  onAdd: (type: EmotionType, comment: string) => void;
  onCancel: () => void;
}

const AddEmotion: React.FC<AddEmotionProps> = ({ onAdd, onCancel }) => {
  const [selected, setSelected] = useState<EmotionType>('Радість');
  const [comment, setComment] = useState('');

  const handleAdd = () => {
    if (selected) {
      onAdd(selected, comment.trim());
      setComment('');
      setSelected('Радість');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={styles.root}>
      <h2>Додати емоцію</h2>
      <div className={styles.cardsRow}>
        {emotionTypes.map((type) => (
          <EmotionCardSmall
            key={type}
            type={type}
            isSelected={selected === type}
            onClick={() => setSelected(type)}
          />
        ))}
      </div>
      <Textarea
        className={styles.textarea}
        placeholder="Будьласка, напишіть щось про свою емоцію ..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.btnRow}>
        <Button type="button" onClick={handleAdd} disabled={!selected} className={styles.mainBtn}>
          Додати
        </Button>
        <Button type="button" onClick={onCancel} className={styles.mainBtn}>
          Скасувати
        </Button>
      </div>
    </div>
  );
};

export default AddEmotion; 