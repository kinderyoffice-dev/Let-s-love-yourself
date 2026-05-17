import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement, CharacterConfig } from '../types';
import { Sun, Cloud, Shirt } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface MainSceneProps {
  achievements: Achievement[];
  character: CharacterConfig;
  onCharacterChange: (char: CharacterConfig) => void;
  availableCharacters: CharacterConfig[];
}

export const MainScene: React.FC<MainSceneProps> = ({ 
  achievements, 
  character, 
  onCharacterChange, 
  availableCharacters 
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Sort achievements by date ascending (oldest first) for left-to-right row
  const sortedAchievements = [...achievements].sort((a, b) => a.date.localeCompare(b.date));
  
  // Display the latest 3 achievements
  const displayAchievements = sortedAchievements.slice(-3);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden bg-gradient-to-b from-[#B3E5FC] via-[#E1F5FE] to-[#E1F5FE] rounded-2xl border-2 dashed-border border-art-border shadow-lg">
      {/* Sun */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-8 right-12 w-16 h-16 bg-[#FFF176] rounded-full shadow-[0_0_20px_#FFF59D]"
      />

      {/* Clouds */}
      <CloudComponent delay={0} top="20%" />
      <CloudComponent delay={5} top="40%" />
      <CloudComponent delay={10} top="15%" />

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-[20%] bg-gradient-to-b from-art-ground-start to-art-ground-end" />

      {/* Character and Bubbles Area */}
      <div className="absolute bottom-[10%] left-0 w-full flex flex-col items-center">
        {/* Achievements Row */}
        <div className="flex gap-3 mb-6 px-4 justify-center items-end max-w-full">
          <AnimatePresence mode="popLayout">
            {displayAchievements.map((ach, index) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="bg-white p-2.5 rounded-2xl shadow-md border-2 border-art-accent min-w-[80px] max-w-[120px] relative"
              >
                <div className="text-[9px] text-art-primary font-bold mb-1">
                  {format(parseISO(ach.date), 'M/d')}
                </div>
                <div className="text-[11px] text-art-text font-bold leading-tight line-clamp-3">
                  {ach.text}
                </div>
                {/* Bubble tail */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-art-accent rotate-45" />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {displayAchievements.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-art-primary/40 font-bold italic py-4"
            >
              今日のできたことを記録しよう！
            </motion.div>
          )}
        </div>

        {/* Character Visual */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
            rotate: [0, -2, 2, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ backgroundColor: character.color }}
          className="relative w-16 h-20 rounded-full flex flex-col items-center justify-center border-2 border-art-accent shadow-sm"
        >
          {/* Eyes */}
          <div className="flex gap-4 mt-2">
            <div className="w-1.5 h-1.5 bg-art-text rounded-full" />
            <div className="w-1.5 h-1.5 bg-art-text rounded-full" />
          </div>
          {/* Smile */}
          <div className="w-4 h-2 border-b-2 border-art-text rounded-full mt-1" />
          {/* Blush */}
          <div className="absolute top-[50%] left-2 w-2 h-1 bg-art-primary opacity-40 blur-[1px] rounded-full" />
          <div className="absolute top-[50%] right-2 w-2 h-1 bg-art-primary opacity-40 blur-[1px] rounded-full" />
          
          {/* Body/Clothes */}
          <div 
            style={{ backgroundColor: character.accessoryColor }}
            className="absolute -bottom-1 w-12 h-12 rounded-xl -z-10" 
          />

          {/* Feet */}
          <motion.div 
            animate={{ rotate: [-20, 20, -20] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ backgroundColor: character.color }}
            className="absolute -bottom-2 -left-1 w-4 h-3 rounded-full border border-art-accent/20" 
          />
          <motion.div 
            animate={{ rotate: [20, -20, 20] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ backgroundColor: character.color }}
            className="absolute -bottom-2 -right-1 w-4 h-3 rounded-full border border-art-accent/20" 
          />
        </motion.div>
      </div>

      {/* Change Character Button */}
      <div className="absolute bottom-4 left-4">
        <button 
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-art-accent shadow-sm text-art-primary hover:bg-art-accent hover:text-white transition-all flex flex-col items-center justify-center gap-0.5 text-[8px] font-bold"
        >
          <Shirt size={16} />
          <span>きせかえ</span>
        </button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-10 left-0 bg-white p-2 rounded-xl shadow-xl border-2 border-art-accent flex gap-2 z-50"
            >
              {availableCharacters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    onCharacterChange(char);
                    setShowPicker(false);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    character.id === char.id ? 'border-art-primary scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: char.accessoryColor }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CloudComponent = ({ delay, top }: { delay: number; top: string }) => (
  <motion.div
    initial={{ x: '-100%' }}
    animate={{ x: '100vw' }}
    transition={{
      duration: 30 + Math.random() * 20,
      repeat: Infinity,
      delay,
      ease: 'linear',
    }}
    style={{ top }}
    className="absolute text-white/60"
  >
    <Cloud size={48} fill="currentColor" />
  </motion.div>
);
