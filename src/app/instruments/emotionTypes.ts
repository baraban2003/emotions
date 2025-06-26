export const emotionTypes = [
  'Радість',
  'Смуток',
  'Злість',
  'Подив',
  'Спокій',
  'Страх',
  'Відраза',
  'Інше',
] as const;

export type EmotionType = typeof emotionTypes[number]; 