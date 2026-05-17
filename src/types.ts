export type Emotion = 'happy' | 'neutral' | 'sad' | 'love' | 'tired';

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  emotion: Emotion;
}

export interface Achievement {
  id: string;
  date: string;
  text: string;
}

export interface DailyEmotion {
  date: string; // ISO string YYYY-MM-DD
  emotion: Emotion;
}

export interface CharacterConfig {
  id: string;
  name: string;
  color: string;
  accessoryColor: string;
}
