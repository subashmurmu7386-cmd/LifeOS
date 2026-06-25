import { useState } from 'react';
import { Plus, Trash2, X, GraduationCap, Clock, Star } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { StudySession } from '@/types';
import MiniBarChart from '@/components/features/MiniBarChart';

export default function Study() {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('lifeos-study', []);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [filterSubject, setFilterSubject] = useState('All');

  const todayStr = today();
  const subjects = Array.from(new Set(sessions.map(s => s.subject)));
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const todayMinutes = todaySessions.reduce((a, s) => a + s.duration, 0);
  const totalHours = Math.floor(sessions.reduce((a, s) => a + s.duration, 0) / 60);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const chartData = last7.map(d => sessions.filter(s => s.date === d).reduce((a, s) => a + s.duration, 0));
  const chartLabels = last7.map(d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2));

  const addSession = () => {
    if (!subject.trim()) return;
    const session: StudySession = {
      id: generateId(), subject: subject.trim(), topic: topic.trim(),
      date: todayStr, duration: Number(duration), notes: notes.trim(),
      rating, completed: true,
    };
    setSessions(prev => [session, ...prev]);
    setSubject(''); setTopic(''); setDuration('60'); setNotes(''); setShowForm(false);
  };

  const filtered = sessions.filter(s => filterSubject === 'All' ? true : s.subject === filterSubject);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <GraduationCap size={20} className="mx-auto mb-1 text-brand-400" />
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Today</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Clock size={20} className="mx-auto mb-1 text-blue-400" />
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{totalHours}h</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Star size={20} className="mx-auto mb-1 text-yellow-400" />
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{subjects.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Subjects</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Study Minutes (7d)</h3>
        <MiniBarChart data={chartData} labels={chartLabels} color="#7c3aed" height={80} showLabels />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', ...subjects].map(s => (
            <button key={s} onClick={() => setFilterSubject(s)} className={cn('chip', filterSubject === s ? 'chip-active' : 'chip-inactive')}>{s}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 ml-2 flex-shrink-0">
          <Plus size={16} /> Log Study
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Log Study Session</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input className="input-glass" placeholder="Subject (e.g. Math)" value={subject} onChange={e => setSubject(e.target.value)} list="subjects-list" />
              <datalist id="subjects-list">{subjects.map(s => <option key={s} value={s} />)}</datalist>
              <input className="input-glass" placeholder="Topic (optional)" value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <input type="number" className="input-glass flex-1" placeholder="Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} min="1" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setRating(v as 1 | 2 | 3 | 4 | 5)}>
                    <Star size={18} fill={v <= rating ? '#f59e0b' : 'none'} className={v <= rating ? 'text-yellow-400' : 'text-gray-400'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea className="input-glass resize-none" placeholder="Notes..." rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
            <button onClick={addSession} className="btn-primary w-full">Log Session</button>
          </div>
        </div>
      )}

      <div className="space-y-2 stagger">
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center">
            <GraduationCap size={36} className="mx-auto mb-3 text-brand-400" />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No study sessions yet</p>
          </div>
        )}
        {filtered.map(s => (
          <div key={s.id} className="glass-card p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <GraduationCap size={18} className="text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.subject}</span>
                {s.topic && <span className="tag">{s.topic}</span>}
              </div>
              <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span><Clock size={10} className="inline mr-0.5" />{s.duration} min</span>
                <span>{s.date}</span>
                {s.rating && <div className="flex">{Array.from({ length: s.rating }, (_, i) => <Star key={i} size={10} fill="#f59e0b" className="text-yellow-400" />)}</div>}
              </div>
              {s.notes && <p className="text-xs mt-0.5 italic truncate" style={{ color: 'var(--text-secondary)' }}>{s.notes}</p>}
            </div>
            <button onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))} className="btn-ghost p-1.5 text-red-400 flex-shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
