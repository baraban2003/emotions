import { makeAutoObservable, runInAction } from 'mobx';
import { EmotionType } from './instruments/emotionTypes';
import { getNextId } from './services/idGenerator';

export interface Emotion {
  id: string;
  type: EmotionType;
  comment: string;
  createdAt: number;
}

class EmotionStore {
  emotions: Emotion[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  addEmotion(type: EmotionType, comment: string) {
    const newEmotion: Emotion = {
      id: getNextId(this.emotions),
      type,
      comment,
      createdAt: Date.now(),
    };
    this.emotions.unshift(newEmotion);
    this.saveToLocalStorage();
  }

  removeEmotion(id: string) {
    this.emotions = this.emotions.filter(e => e.id !== id);
    this.saveToLocalStorage();
  }

  reorderEmotions(newOrder: Emotion[]) {
    this.emotions = newOrder;
    this.saveToLocalStorage();
  }

  clearAll() {
    this.emotions = [];
    this.saveToLocalStorage();
  }

  loadFromLocalStorage() {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem('emotions');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        runInAction(() => {
          this.emotions = parsed;
        });
      } catch { }
    }
  }

  saveToLocalStorage() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('emotions', JSON.stringify(this.emotions));
  }
}

export const emotionStore = new EmotionStore(); 