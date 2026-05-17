/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MainScene } from './components/MainScene';
import { DiaryView } from './components/DiaryView';
import { AchievementView } from './components/AchievementView';
import { CalendarView } from './components/CalendarView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DiaryEntry, Achievement, CharacterConfig } from './types';
import { Home, Book, StickyNote, Calendar, Settings, Heart } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'home' | 'diary' | 'achievement' | 'calendar';

const CHARACTERS: CharacterConfig[] = [
  { id: 'pink', name: 'ぴんく', color: '#FFE0B2', accessoryColor: '#FFAB91' },
  { id: 'yellow', name: 'きいろ', color: '#FFF9C4', accessoryColor: '#FFF176' },
  { id: 'blue', name: 'みずいろ', color: '#E1F5FE', accessoryColor: '#81D4FA' },
  { id: 'green', name: 'きみどり', color: '#E8F5E9', accessoryColor: '#A5D6A7' },
  { id: 'purple', name: 'むらさき', color: '#F3E5F5', accessoryColor: '#CE93D8' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [entries, setEntries] = useLocalStorage<DiaryEntry[]>('diary_entries', [
    {
      id: 'sample-3',
      date: '2026-05-17T10:00:00Z',
      content: '今日は美味しいオムライスを作った！自分で自分を労うの、大事。',
      emotion: 'happy'
    },
    {
      id: 'sample-2',
      date: '2026-05-16T15:30:00Z',
      content: '散歩に出かけたら空がすごく綺麗だった。深呼吸してリフレッシュ。',
      emotion: 'love'
    },
    {
      id: 'sample-1',
      date: '2026-05-15T08:00:00Z',
      content: '早起きして白湯を飲んだ。体が温まって、いい一日のスタート。',
      emotion: 'neutral'
    }
  ]);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', [
    { id: 'a-3', date: '2026-05-17T10:05:00Z', text: 'オムライスを自炊した' },
    { id: 'a-2', date: '2026-05-16T15:35:00Z', text: '15分間お散歩した' },
    { id: 'a-1', date: '2026-05-15T08:05:00Z', text: '朝起きて白湯を飲んだ' }
  ]);
  const [character, setCharacter] = useLocalStorage<CharacterConfig>('selected_character', CHARACTERS[0]);

  const addDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEntries([newEntry, ...entries]);
  };

  const deleteDiaryEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const addAchievement = (data: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setAchievements([newAch, ...achievements]);
  };

  const deleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-art-bg font-sans text-art-text pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md px-6 py-4 border-b-2 dashed-border border-art-border flex justify-between items-center">
        <h1 className="text-lg font-bold text-art-primary tracking-wider">
          自分を愛してみたっていい
          <span className="block text-[10px] text-art-secondary font-bold -mt-1">－成長見える化app―</span>
        </h1>
        <div className="text-[10px] font-bold text-art-text/60 hidden sm:block">
          今日もあなたは素敵です
        </div>
      </header>

      <div className="pt-24">
        {/* Main Content */}
        <main className="max-w-xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <MainScene 
                achievements={achievements} 
                character={character}
                onCharacterChange={setCharacter}
                availableCharacters={CHARACTERS}
              />
              
              <div className="bg-white p-6 rounded-2xl border-2 border-art-accent shadow-sm">
                <h3 className="font-bold flex items-center gap-2 text-art-primary mb-2">
                  <Heart size={18} fill="currentColor" />
                  今日のメッセージ
                </h3>
                <p className="text-art-text/80 leading-relaxed text-sm">
                  生きてるだけで100点満点！🌸 今日も一日、自分らしく過ごせたことが一番の成果ですよ。
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'diary' && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <DiaryView entries={entries} onAdd={addDiaryEntry} onDelete={deleteDiaryEntry} />
            </motion.div>
          )}

          {activeTab === 'achievement' && (
            <motion.div
              key="achievement"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AchievementView 
                achievements={achievements} 
                onAdd={addAchievement} 
                onDelete={deleteAchievement} 
              />
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CalendarView entries={entries} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-2xl border border-art-border shadow-xl px-6 py-2 flex justify-between items-center z-[100]">
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')}
          icon={<Home />}
          label="ホーム"
        />
        <NavButton 
          active={activeTab === 'diary'} 
          onClick={() => setActiveTab('diary')}
          icon={<Book />}
          label="日記"
        />
        <NavButton 
          active={activeTab === 'achievement'} 
          onClick={() => setActiveTab('achievement')}
          icon={<StickyNote />}
          label="記録"
        />
        <NavButton 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')}
          icon={<Calendar />}
          label="暦"
        />
      </nav>
    </div>
  </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-art-primary scale-110" : "text-art-text/40 hover:text-art-primary/60"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-all",
        active && "bg-art-accent/20"
      )}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

