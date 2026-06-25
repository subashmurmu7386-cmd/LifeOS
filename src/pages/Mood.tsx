import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, today, getLast7Days, MOOD_LABELS, MOOD_EMOJIS, MOOD_COLORS } from '@/lib/utils';
import { cn } from '@/lib/utils';
import MiniBarChart from '@/components/features/MiniBarChart';
import type { MoodEntry } from '@/types';

const MOOD_TAGS = ['Productive', 'Tired', 'Anxious', 'Grateful', 'Motivated', 'Stressed', 'Happy', 'Sad', 'Focused', 'Creative', 'Energetic', 'Calm'];

export default function Mood() {
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>('lifeos-moods', []);
  const [showForm, setShowForm] = useState(false);
  const [moodVal, setMoodVal] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const todayStr = today();
  const last7 = getLast7Days();
  const todayMood = moods.find(m => m.date === todayStr);

  const logMood = () => {
    const entry: MoodEntry = {
      id: generateId(), date: todayStr, mood: moodVal, energy, note: note.trim(), tags
    };
    setMoods(prev => {
      const filtered = prev.filter(m => m.date !== todayStr);
      return [entry, ...filtered];
    });
    setShowForm(false);
    setNote(''); setTags([]);
  };

  const moodData = last7.map(d => {
    const e = moods.find(m => m.date === d);
    return e ? e.mood : 0;
  });
  const energyData = last7.map(d => {
    const e = moods.find(m => m.date === d);
    return e ? e.energy : 0;
  });
  const dayLabels = last7.map(d => {
    const date = new Date(d + 'T00:00:00');
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()];
  });

  const avgMood = moods.length ? (moods.reduce((a, m) => a + m.mood, 0) / moods.length).toFixed(1) : '—';
  const avgEnergy = moods.length ? (moods.reduce((a, m) => a + m.energy, 0) / moods.length).toFixed(1) : '—';

  return (
    <div className="animate-fade-in space-y-6">
      {/* Today's status */}
      <div className="glass-card p-6">
        {todayMood ? (
          <div className="flex items-center gap-4">
            <span className="text-5xl">{MOOD_EMOJIS[todayMood.mood]}</span>
            <div className="flex-1">
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Feeling {MOOD_LABELS[todayMood.mood]} today
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Energy: {todayMood.energy}/5</p>
              {todayMood.note && <p className="text-sm italic mt-1" style={{ color: 'var(--text-secondary)' }}>"{todayMood.note}"</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                {todayMood.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-ghost text-sm py-2 px-3">Update</button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-3xl mb-2">🤔</p>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>How are you feeling?</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Track your mood for better self-awareness</p>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus size={16} /> Log Today's Mood
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Log Your Mood</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-xs mb-3 block font-medium" style={{ color: 'var(--text-muted)' }}>Mood</label>
              <div className="flex justify-between">
                {([1, 2, 3, 4, 5] as const).map(v => (
                  <button key={v} onClick={() => setMoodVal(v)}
                    className={cn('flex flex-col items-center gap-1 p-3 rounded-xl transition-all', moodVal === v && 'ring-2 ring-offset-2 ring-brand-500')}
                    style={{ background: moodVal === v ? `${MOOD_COLORS[v]}20` : 'var(--surface)' }}
                  >
                    <span className="text-2xl">{MOOD_EMOJIS[v]}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{MOOD_LABELS[v]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs mb-3 block font-medium" style={{ color: 'var(--text-muted)' }}>Energy Level: {energy}/5</label>
              <input type="range" min="1" max="5" value={energy} onChange={e => setEnergy(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)} className="w-full" />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Low</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>High</span>
              </div>
            </div>
            <div>
              <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Tags</label>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map(t => (
                  <button key={t} onClick={() => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                    className={cn('chip', tags.includes(t) ? 'chip-active' : 'chip-inactive')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <textarea className="input-glass resize-none" placeholder="Notes (optional)..." rows={2} value={note} onChange={e => setNote(e.target.value)} />
            <button onClick={logMood} className="btn-primary w-full">Save Mood</button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Mood (7d)</h3>
            <span className="text-xs font-bold text-brand-400">avg {avgMood}</span>
          </div>
          <MiniBarChart data={moodData} labels={dayLabels} color="#7c3aed" height={70} showLabels />
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Energy (7d)</h3>
            <span className="text-xs font-bold text-yellow-400">avg {avgEnergy}</span>
          </div>
          <MiniBarChart data={energyData} labels={dayLabels} color="#f59e0b" height={70} showLabels />
        </div>
      </div>

      {/* History */}
      <div className="space-y-2 stagger">
        {moods.slice(0, 10).map(entry => (
          <div key={entry.id} className="glass-card p-4 flex items-center gap-4">
            <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{MOOD_LABELS[entry.mood]}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>• Energy {entry.energy}/5</span>
              </div>
              {entry.note && <p className="text-xs italic truncate" style={{ color: 'var(--text-secondary)' }}>{entry.note}</p>}
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{entry.date}</span>
              <button onClick={() => setMoods(prev => prev.filter(m => m.id !== entry.id))} className="btn-ghost p-1 text-red-400">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
