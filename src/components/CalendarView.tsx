import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Smile, Meh, Frown, Heart, Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import { DiaryEntry, Emotion } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface CalendarViewProps {
  entries: DiaryEntry[];
}

const EMOTION_MAP: Record<Emotion, React.ReactNode> = {
  happy: <Emoji label="😊" color="bg-[#FFF9C4]" />,
  neutral: <Emoji label="😐" color="bg-[#E1F5FE]" />,
  sad: <Emoji label="😢" color="bg-[#EDE7F6]" />,
  love: <Emoji label="🥰" color="bg-[#F8BBD0]" />,
  tired: <Emoji label="😴" color="bg-[#FFF3E0]" />,
};

function Emoji({ label, color }: { label: string; color: string }) {
  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xl shadow-sm", color)}>
      {label}
    </div>
  );
}

export const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDayEmotion = (date: Date) => {
    // Find the last entry for this day
    const entriesOnDay = entries.filter(e => isSameDay(parseISO(e.date), date));
    if (entriesOnDay.length > 0) {
      return entriesOnDay[0].emotion;
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-art-accent shadow-[0_2px_8px_rgba(255,138,101,0.1)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-art-text">
          {format(currentDate, 'yyyy年 M月', { locale: ja })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
          <div key={d} className={cn(
            "text-center text-sm font-bold py-2",
            i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
          )}>
            {d}
          </div>
        ))}
        
        {/* Placeholder for days before the start of the month */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const emotion = getDayEmotion(day);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer relative",
                isToday ? "border-art-primary bg-art-primary/10" : "border-art-bg hover:border-art-accent"
              )}
            >
              <span className={cn(
                "text-[10px] font-bold",
                isToday ? "text-art-primary underline" : "text-art-text/40"
              )}>
                {format(day, 'd')}
              </span>
              {emotion && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {EMOTION_MAP[emotion]}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
