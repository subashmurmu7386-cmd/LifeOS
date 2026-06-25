import { useState } from 'react';
import { Plus, Trash2, X, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { WorkoutSession, WorkoutExercise } from '@/types';

const EXERCISES = ['Push-ups', 'Pull-ups', 'Squats', 'Lunges', 'Plank', 'Bench Press', 'Deadlift', 'Running', 'Cycling', 'Rowing', 'Burpees', 'Jump Rope', 'Bicep Curl', 'Tricep Dip', 'Shoulder Press'];

export default function Workout() {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutSession[]>('lifeos-workouts', []);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('10');
  const [exWeight, setExWeight] = useState('');
  const [exUnit, setExUnit] = useState<'reps' | 'duration'>('reps');
  const [exDuration, setExDuration] = useState('');

  const todayStr = today();

  const addExercise = () => {
    if (!exName.trim()) return;
    const ex: WorkoutExercise = {
      id: generateId(), name: exName.trim(), sets: Number(exSets), reps: Number(exReps),
      weight: exWeight ? Number(exWeight) : undefined, unit: exUnit,
      duration: exDuration ? Number(exDuration) : undefined,
    };
    setExercises(prev => [...prev, ex]);
    setExName(''); setExSets('3'); setExReps('10'); setExWeight(''); setExDuration('');
  };

  const saveSession = () => {
    if (!sessionName.trim() || !exercises.length) return;
    const session: WorkoutSession = {
      id: generateId(), name: sessionName.trim(), date: todayStr,
      exercises, duration: exercises.reduce((a, e) => a + (e.sets * (e.duration || 0) + e.sets * 1), 0),
      notes: sessionNotes.trim(), completed: true,
    };
    setWorkouts(prev => [session, ...prev]);
    setSessionName(''); setSessionNotes(''); setExercises([]); setShowForm(false);
  };

  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((a, w) => a + w.exercises.length, 0);
  const thisWeek = workouts.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return d >= weekStart;
  }).length;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Workouts', value: totalWorkouts, color: 'text-brand-400' },
          { label: 'This Week', value: thisWeek, color: 'text-green-400' },
          { label: 'Exercises Logged', value: totalExercises, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn('font-bold text-xl', s.color)}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Log Workout
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Workout Session</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-4">
            <input className="input-glass" placeholder="Session name (e.g. Upper Body)" value={sessionName} onChange={e => setSessionName(e.target.value)} />

            <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--surface)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>ADD EXERCISE</p>
              <input className="input-glass" placeholder="Exercise name" value={exName} onChange={e => setExName(e.target.value)} list="ex-list" />
              <datalist id="ex-list">{EXERCISES.map(e => <option key={e} value={e} />)}</datalist>
              <div className="flex gap-2">
                {(['reps', 'duration'] as const).map(u => (
                  <button key={u} onClick={() => setExUnit(u)} className={cn('chip flex-1 justify-center capitalize', exUnit === u ? 'chip-active' : 'chip-inactive')}>{u}</button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" className="input-glass" placeholder="Sets" value={exSets} onChange={e => setExSets(e.target.value)} min="1" />
                {exUnit === 'reps' ? (
                  <input type="number" className="input-glass" placeholder="Reps" value={exReps} onChange={e => setExReps(e.target.value)} min="1" />
                ) : (
                  <input type="number" className="input-glass" placeholder="Sec" value={exDuration} onChange={e => setExDuration(e.target.value)} min="1" />
                )}
                <input type="number" className="input-glass" placeholder="kg (opt)" value={exWeight} onChange={e => setExWeight(e.target.value)} min="0" />
              </div>
              <button onClick={addExercise} className="btn-ghost w-full border border-dashed" style={{ borderColor: 'var(--glass-border)' }}>
                <Plus size={14} className="inline mr-1" /> Add Exercise
              </button>
            </div>

            {exercises.length > 0 && (
              <div className="space-y-1.5">
                {exercises.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg" style={{ background: 'rgba(124,58,237,0.08)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{ex.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {ex.sets} × {ex.unit === 'reps' ? `${ex.reps} reps` : `${ex.duration}s`}
                      {ex.weight ? ` @ ${ex.weight}kg` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <textarea className="input-glass resize-none" placeholder="Notes..." rows={2} value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} />
            <button onClick={saveSession} disabled={!exercises.length} className="btn-primary w-full disabled:opacity-50">Save Workout</button>
          </div>
        </div>
      )}

      <div className="space-y-3 stagger">
        {workouts.length === 0 && (
          <div className="glass-card p-10 text-center">
            <Dumbbell size={36} className="mx-auto mb-3 text-brand-400" />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No workouts logged yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start tracking your fitness journey</p>
          </div>
        )}
        {workouts.map(w => (
          <div key={w.id} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
                <Dumbbell size={18} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{w.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.exercises.length} exercises • {w.date}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setExpanded(expanded === w.id ? null : w.id)} className="btn-ghost p-1.5">
                  {expanded === w.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button onClick={() => setWorkouts(prev => prev.filter(x => x.id !== w.id))} className="btn-ghost p-1.5 text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {expanded === w.id && (
              <div className="mt-3 pt-3 border-t space-y-1.5" style={{ borderColor: 'var(--glass-border)' }}>
                {w.exercises.map(ex => (
                  <div key={ex.id} className="flex justify-between text-sm px-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{ex.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{ex.sets}×{ex.unit === 'reps' ? ex.reps : `${ex.duration}s`}{ex.weight ? ` @${ex.weight}kg` : ''}</span>
                  </div>
                ))}
                {w.notes && <p className="text-xs italic pt-1" style={{ color: 'var(--text-secondary)' }}>{w.notes}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
