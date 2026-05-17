import React, { useState } from 'react';
import { DiaryEntry, Emotion } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Smile, Meh, Frown, Heart, Coffee, Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';

interface DiaryViewProps {
  entries: DiaryEntry[];
  onAdd: (entry: Omit<DiaryEntry, 'id'>) => void;
  onDelete: (id: string) => void;
}

const EMOTION_ICONS: Record<Emotion, React.ReactNode> = {
  happy: <Smile className="text-yellow-500" />,
  neutral: <Meh className="text-blue-400" />,
  sad: <Frown className="text-indigo-400" />,
  love: <Heart className="text-red-400" />,
  tired: <Coffee className="text-amber-600" />,
};

export const DiaryView: React.FC<DiaryViewProps> = ({ entries, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState<Emotion>('happy');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // Combine selected date with current time for precise sorting if needed
    const now = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    onAdd({
      date: selectedDate.toISOString(),
      content: content.trim(),
      emotion,
    });
    setContent('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-art-primary flex items-center gap-2">
          <CalendarIcon size={24} />
          日記
        </h2>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full px-6 shadow-md"
        >
          {isAdding ? '閉じる' : '今日を記録する'}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-white border-art-border">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-art-primary mb-1 uppercase tracking-wider">日付</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 rounded-lg border-2 border-art-accent focus:border-art-primary outline-none bg-art-bg/30 text-art-text text-sm font-bold"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-[10px] font-bold text-art-primary mb-1 uppercase tracking-wider">気分</label>
                    <div className="flex gap-2">
                      {(Object.keys(EMOTION_ICONS) as Emotion[]).map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setEmotion(emo)}
                          className={`p-2 rounded-full transition-all ${
                            emotion === emo 
                              ? 'bg-art-accent scale-110 shadow-inner' 
                              : 'bg-white hover:bg-art-bg border border-transparent hover:border-art-accent'
                          }`}
                        >
                          {EMOTION_ICONS[emo]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="今の気持ちや出来事を書いてみましょう..."
                  className="w-full h-32 p-4 rounded-xl border-2 border-art-accent focus:border-art-primary outline-none resize-none bg-art-bg/30 text-art-text"
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={!content.trim()}>
                    保存する
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {entries.length === 0 && !isAdding && (
            <div className="text-center py-20 text-gray-400">
              まだ日記がありません。最初の思い出を刻みましょう。
            </div>
          )}
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative group"
            >
              <Card className="p-5 bg-white border-art-accent hover:border-art-primary transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-art-bg rounded-full">
                      {EMOTION_ICONS[entry.emotion]}
                    </div>
                    <div>
                      <div className="text-xs text-art-primary font-bold">
                        {format(parseISO(entry.date), 'yyyy年MM月dd日 (E)', { locale: ja })}
                      </div>
                      <div className="text-[10px] text-art-text/40 font-bold">
                        {format(parseISO(entry.date), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(entry.id)}
                    className="p-2 text-art-text/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-art-text text-sm whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
