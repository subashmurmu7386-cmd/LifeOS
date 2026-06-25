import { useState } from 'react';
import { Plus, Trash2, Check, X, Target, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import DonutChart from '@/components/features/DonutChart';
import type { Goal, Milestone } from '@/types';

const CATEGORIES = ['Career', 'Health', 'Finance', 'Learning', 'Personal', 'Travel', 'Relationship', 'Other'];
const STATUS_COLORS: Record<string, string> = {
  active: 'text-blue-400 bg-blue-400/10',
  completed: 'text-green-400 bg-green-400/10',
  paused: 'text-yellow-400 bg-yellow-400/10',
};

export default function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('lifeos-goals', []);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [deadline, setDeadline] = useState('');
  const [milestoneText, setMilestoneText] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const addGoal = () => {
    if (!title.trim()) return;
    const goal: Goal = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      deadline,
      progress: 0,
      milestones,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setGoals(prev => [goal, ...prev]);
    setTitle(''); setDescription(''); setDeadline(''); setMilestones([]);
    setShowForm(false);
  };

  const addMilestone = () => {
    if (!milestoneText.trim()) return;
    setMilestones(prev => [...prev, { id: generateId(), text: milestoneText.trim(), completed: false }]);
    setMilestoneText('');
  };

  const toggleMilestone = (goalId: string, msId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const ms = g.milestones.map(m => m.id === msId ? { ...m, completed: !m.completed } : m);
      const progress = ms.length ? Math.round((ms.filter(m => m.completed).length / ms.length) * 100) : g.progress;
      return { ...g, milestones: ms, progress, status: progress === 100 ? 'completed' : g.status };
    }));
  };

  const updateProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress } : g));
  };

  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const filtered = goals.filter(g => filterStatus === 'all' ? true : g.status === filterStatus);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {['active', 'completed', 'paused'].map(s => (
          <div key={s} className="glass-card p-4 text-center">
            <p className="font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              {goals.filter(g => g.status === s).length}
            </p>
            <p className="text-xs mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>{s}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'active', 'completed', 'paused'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={cn('chip', filterStatus === s ? 'chip-active' : 'chip-inactive')}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Goal</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input className="input-glass" placeholder="Goal title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="input-glass resize-none" placeholder="Description (optional)" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Category</label>
                <select className="input-glass" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Deadline</label>
                <input type="date" className="input-glass" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Milestones</label>
              <div className="flex gap-2 mb-2">
                <input className="input-glass flex-1" placeholder="Add milestone..." value={milestoneText} onChange={e => setMilestoneText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMilestone()} />
                <button onClick={addMilestone} className="btn-primary px-3"><Plus size={16} /></button>
              </div>
              {milestones.map(m => (
                <div key={m.id} className="flex items-center gap-2 mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check size={12} className="text-brand-400" /> {m.text}
                </div>
              ))}
            </div>
            <button onClick={addGoal} className="btn-primary w-full">Create Goal</button>
          </div>
        </div>
      )}

      {/* Goals */}
      <div className="space-y-3 stagger">
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center">
            <Target size={36} className="mx-auto mb-3 text-brand-400" />
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No goals yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Set a goal and start making progress!</p>
          </div>
        )}
        {filtered.map(goal => {
          const expanded = expandedId === goal.id;
          return (
            <div key={goal.id} className="glass-card p-5">
              <div className="flex items-start gap-4">
                <DonutChart value={goal.progress} max={100} size={56} label={`${goal.progress}%`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                      {goal.description && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{goal.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={cn('badge text-xs capitalize', STATUS_COLORS[goal.status])}>{goal.status}</span>
                      <span className="tag">{goal.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
                      {goal.deadline && ` • Due ${goal.deadline}`}
                    </span>
                  </div>
                  {/* Progress slider */}
                  {goal.milestones.length === 0 && (
                    <div className="mt-2">
                      <input
                        type="range" min="0" max="100" value={goal.progress}
                        onChange={e => updateProgress(goal.id, Number(e.target.value))}
                        className="w-full"
                        style={{ accentColor: '#7c3aed' }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setExpandedId(expanded ? null : goal.id)} className="btn-ghost p-1.5">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className="btn-ghost p-1.5 text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {expanded && goal.milestones.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--glass-border)' }}>
                  {goal.milestones.map(m => (
                    <div key={m.id} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleMilestone(goal.id, m.id)}>
                      <div className={cn('w-5 h-5 rounded flex items-center justify-center border transition-all',
                        m.completed ? 'bg-brand-600 border-brand-600' : 'border-brand-400'
                      )}>
                        {m.completed && <Check size={11} className="text-white" />}
                      </div>
                      <span className={cn('text-sm', m.completed && 'line-through opacity-60')} style={{ color: 'var(--text-secondary)' }}>
                        {m.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
