"use client";

import { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { emotionStore, Emotion } from '../../store';
import styles from './EmotionBoard.module.css';
import { EmotionCard } from '../emotion-card';
import { AddEmotion } from '../add-emotion';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640;

const EmotionBoard = observer(() => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const dragItem = useRef<Emotion | null>(null);


  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return null;

  const handleAddEmotion = (type: any, comment: string) => {
    emotionStore.addEmotion(type, comment);
    setModalOpen(false);
  };

  const handleDeleteEmotion = (id: string) => {
    emotionStore.removeEmotion(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Ви впевнені, що хочете видалити всі емоції?')) {
      emotionStore.clearAll();
    }
  };

  // Drag-and-drop для мобільних (touch)
  const handleTouchStart = (idx: number) => (e: React.TouchEvent) => {
    if (!isMobile()) return;
    document.body.style.overflow = 'hidden';
    setDragIndex(idx);
    dragItem.current = emotionStore.emotions[idx];
  };

  const handleTouchMove = (idx: number) => (e: React.TouchEvent) => {
    if (!isMobile() || dragIndex === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target) return;
    const li = target.closest('li');
    if (!li) return;
    const overIdx = Number(li.getAttribute('data-idx'));
    if (overIdx !== dragOverIndex) setDragOverIndex(overIdx);
  };

  const handleTouchEnd = (idx: number) => (e: React.TouchEvent) => {
    document.body.style.overflow = '';
    if (!isMobile() || dragIndex === null || dragOverIndex === null) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    if (dragIndex !== dragOverIndex) {
      const newOrder = [...emotionStore.emotions];
      const [removed] = newOrder.splice(dragIndex, 1);
      newOrder.splice(dragOverIndex, 0, removed);
      emotionStore.reorderEmotions(newOrder);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <section className={styles.board}>
      <h1 className={styles.title}>Дошка емоцій <br /> ┏( ͡❛ ͜ʖ ͡❛)┛</h1>
      <div className={styles.btnRow}>
        <Button type="button" onClick={() => setModalOpen(true)} className={styles.mainBtn}>
          Додати емоцію
        </Button>
        <Button type="button" onClick={handleClearAll} disabled={emotionStore.emotions.length === 0} className={styles.mainBtn}>
          Очистити всі емоції
        </Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddEmotion
          onAdd={handleAddEmotion}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
      <div className={styles.listWrapper}>
        {emotionStore.emotions.length === 0 ? (
          <p className={styles.empty}>Поки що немає жодної емоції.</p>
        ) : (
          <ul className={styles.list}>
            {emotionStore.emotions.map((emotion, idx) => (
              <li
                key={emotion.id}
                className={
                  styles.item +
                  (dragIndex === idx ? ' ' + styles.dragging : '') +
                  (dragOverIndex === idx && dragIndex !== null ? ' ' + styles.dragOver : '')
                }
                data-idx={idx}
                onTouchStart={handleTouchStart(idx)}
                onTouchMove={handleTouchMove(idx)}
                onTouchEnd={handleTouchEnd(idx)}
              >
                <EmotionCard emotion={emotion} onDelete={handleDeleteEmotion} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
});

export default EmotionBoard; 