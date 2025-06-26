import { Emotion } from '../store';

export const getNextId = (emotions: Emotion[]): string => {
  if (emotions.length === 0) return '1';

  const maxId = Math.max(...emotions.map(e => parseInt(e.id) || 0));
  return (maxId + 1).toString();
}; 