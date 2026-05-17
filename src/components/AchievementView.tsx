import React, { useState } from 'react';
import { Achievement } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Trash2, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface AchievementViewProps {
  achievements: Achievement[];
  onAdd: (data: Omit<Achievement, 'id'>) => void;
  onDelete: (id: string) => void;
}

const COLORS = [
  'bg-[#FFF9C4] border-yellow-200',
  'bg-[#F8BBD0] border-pink-200',
  'bg-[#E1F5FE] border-blue-200',
  'bg-[#FFF3E0] border-orange-200',
  'bg-[#E8F5E9] border-green-200',
];

export const AchievementView: React.FC<AchievementViewProps> = ({ achievements, onAdd, onDelete }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Preserve current time for sorting
    const now = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    onAdd({
      text: text.trim(),
      date: selectedDate.toISOString()
    });
    setText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-art-accent/20 rounded-2xl text-art-primary">
          <StickyNote size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-art-text">できたこと記録</h2>
          <p className="text-sm text-art-text/60 font-bold">どんなに小さくても、あなたは頑張りました。</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="今日できた素晴らしいことは？"
            className="flex-1 p-4 rounded-2xl border-2 border-art-accent focus:border-art-primary outline-none bg-white shadow-inner text-art-text"
          />
          <Button type="submit" disabled={!text.trim()} className="rounded-2xl aspect-square p-0 w-14 flex items-center justify-center">
            <Plus size={24} />
          </Button>
        </div>
        <div>
          <label className="text-[10px] font-bold text-art-primary ml-2 mb-1 block uppercase">日付を選択</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded-xl border-2 border-art-accent focus:border-art-primary outline-none bg-white text-art-text text-sm font-bold w-full sm:w-auto"
          />
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <AnimatePresence initial={false}>
          {achievements.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 italic">
              付箋を貼って、あなたの「できた」を可視化しましょう。
            </div>
          )}
          {achievements.map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8, rotate: idx % 2 === 0 ? -2 : 2 }}
              animate={{ opacity: 1, scale: 1, rotate: idx % 2 === 0 ? -1 : 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.02, rotate: 0 }}
              className={`${COLORS[idx % COLORS.length]} p-3 rounded-sm shadow-md border-t-4 relative aspect-square flex flex-col justify-between overflow-hidden`}
              style={{
                boxShadow: '2px 2px 5px rgba(0,0,0,0.05), inset 0 0 15px rgba(255,255,255,0.5)'
              }}
            >
              <div className="absolute top-1 right-1 flex items-center gap-1">
                 <span className="text-[8px] text-gray-400 bg-white/50 px-1 py-0.5 rounded-full font-medium">
                  {format(parseISO(ach.date), 'M/d')}
                </span>
                <button 
                  onClick={() => onDelete(ach.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-all hover:bg-white/80 rounded-full"
                >
                  <Trash2 size={10} />
                </button>
              </div>
              <p className="text-art-text font-bold text-[11px] leading-tight pt-3 break-words overflow-y-auto custom-scrollbar h-full">
                {ach.text}
              </p>
              <div className="flex justify-end mt-1 opacity-20 select-none">
                <StickyNote size={14} />
              </div>
              
              {/* Bottom right fold effect */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-black/5 rounded-tl-xl pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
