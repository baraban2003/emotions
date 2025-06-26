"use client";

import { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { emotionStore, Emotion } from '../../store';
import styles from './EmotionBoard.module.css';
import { EmotionCard } from '../emotion-card';
import { AddEmotion } from '../add-emotion';
import { Modal } from '../ui/modal';
import { EmotionType } from '../../instruments/emotionTypes';
import { Button } from '../ui/button';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ===== СТАРИЙ drag-and-drop для мобільних (залишено для історії) =====
/*
const handleTouchStart = (idx: number) => () => {
  if (!isMobile()) return;
  document.body.style.overflow = 'hidden';
  setDragIndex(idx);
  dragItem.current = emotionStore.emotions[idx];
};
const handleTouchMove = () => (_e: React.TouchEvent) => {
  if (!isMobile() || dragIndex === null) return;
  _e.preventDefault();
  const touch = _e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (!target) return;
  const li = target.closest('li');
  if (!li) return;
  const overIdx = Number(li.getAttribute('data-idx'));
  if (overIdx !== dragOverIndex) setDragOverIndex(overIdx);
};
const handleTouchEnd = () => () => {
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
*/
// ===== END OLD DnD =====

// ===== DND-KIT DRAG-AND-DROP =====
function SortableEmotionCard({ emotion, onDelete }: { emotion: Emotion, onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: emotion.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 2 : 1,
  };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.item}>
      <EmotionCard emotion={emotion} onDelete={onDelete} />
    </li>
  );
}
// ===== END DND-KIT DRAG-AND-DROP =====


const EmotionBoard = observer(() => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  if (!isHydrated) return null;

  const handleAddEmotion = (type: EmotionType, comment: string) => {
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

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = emotionStore.emotions.findIndex(e => e.id === active.id);
      const newIndex = emotionStore.emotions.findIndex(e => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(emotionStore.emotions, oldIndex, newIndex);
        emotionStore.reorderEmotions(newOrder);
      }
    }
  }

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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={emotionStore.emotions.map(e => e.id)} strategy={verticalListSortingStrategy}>
              <ul className={styles.list}>
                {emotionStore.emotions.map((emotion) => (
                  <SortableEmotionCard key={emotion.id} emotion={emotion} onDelete={handleDeleteEmotion} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
});

export default EmotionBoard; 