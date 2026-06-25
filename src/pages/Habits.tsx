import { useState } from 'react';
import { Plus, Trash2, Flame, X, Check } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, today, getDayStreak, getLast7Days } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types';

const HABIT_ICONS = ['🏃', '💪', '📚', '🧘', '💧', '🥗', '😴', '✍️', '🎵', '🌿', '🧠', '💊', '🚴', '🤸', '🎯'];
const HABIT_COLORS = ['#7c3aed', '#3b82f6', '#22c55e', '#f97316', '#ef4444', '#ec4899', '#14b8a6', '#f59e0b'];

export default function Habits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('lifeos-habits', []);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏃');
  const [color, setColor] = useState('#7c3aed');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const todayStr = today();
  const last7 = getLast7Days();

  const addHabit = () => {
    if (!name.trim()) return;
    const habit: Habit = {
      id: generateId(),
      name: name.trim(),
      icon,
      color,
      frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
      streak: 0,
      goal: 7,
    };
    setHabits(prev => [...prev, habit]);
    setName('');
    setShowForm(false);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const alreadyDone = h.completedDates.includes(todayStr);
      const completedDates = alreadyDone
        ? h.completedDates.filter(d => d !== todayStr)
        : [...h.completedDates, todayStr];
      return { ...h, completedDates, streak: getDayStreak(completedDates) };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              {completedToday}/{habits.length}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>habits completed today</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Habit
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Habit</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-4">
            <input
              className="input-glass"
              placeholder="Habit name (e.g. Morning run)"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              autoFocus
            />
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Icon</label>
              <div className="flex flex-wrap gap-2">
                {HABIT_ICONS.map(ic => (
                  <button key={ic} onClick={() => setIcon(ic)}
                    className={cn('w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all',
                      icon === ic ? 'ring-2 ring-brand-500 bg-brand-500/20' : 'hover:bg-white/10'
                    )}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Color</label>
              <div className="flex gap-2">
                {HABIT_COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={cn('w-8 h-8 rounded-full transition-all', color === c && 'ring-2 ring-white ring-offset-2 ring-offset-transparent')}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              {(['daily', 'weekly'] as const).map(f => (
                <button key={f} onClick={() => setFrequency(f)}
                  className={cn('chip flex-1 justify-center', frequency === f ? 'chip-active' : 'chip-inactive')}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={addHabit} className="btn-primary w-full">Create Habit</button>
          </div>
        </div>
      )}

      {/* Habits list */}
      <div className="space-y-3 stagger">
        {habits.length === 0 && (
          <div className="glass-card p-10 text-center">
            <p className="text-4xl mb-2">🌱</p>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No habits yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Build your first habit and start streaking!</p>
          </div>
        )}
        {habits.map(habit => {
          const doneToday = habit.completedDates.includes(todayStr);
          const streak = getDayStreak(habit.completedDates);
          return (
            <div key={habit.id} className="glass-card p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 flex-shrink-0',
                    doneToday ? 'opacity-100 scale-100' : 'opacity-60'
                  )}
                  style={{ background: doneToday ? habit.color : `${habit.color}20` }}
                >
                  {habit.icon}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={cn('font-semibold text-sm', doneToday && 'line-through opacity-70')} style={{ color: 'var(--text-primary)' }}>
                      {habit.name}
                    </p>
                    {doneToday && <Check size={14} className="text-green-500" />}
                  </div>
                  {/* Last 7 days dots */}
                  <div className="flex gap-1">
                    {last7.map(d => (
                      <div
                        key={d}
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: habit.completedDates.includes(d) ? habit.color : `${habit.color}20`,
                        }}
                        title={d}
                      >
                        {habit.completedDates.includes(d) && <Check size={10} color="white" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Flame size={14} className="text-orange-400" />
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{streak}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>streak</p>
                  </div>
                  <button onClick={() => deleteHabit(habit.id)} className="btn-ghost p-1.5 text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
