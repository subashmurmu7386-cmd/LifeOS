import { useState } from 'react';
import { Plus, Trash2, Check, Filter, Flag, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types';

const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];
const PRIORITIES = ['low', 'medium', 'high'] as const;

const priorityColor: Record<string, string> = {
  low: 'text-green-500 bg-green-500/10',
  medium: 'text-yellow-500 bg-yellow-500/10',
  high: 'text-red-500 bg-red-500/10',
};

export default function Todos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('lifeos-todos', []);
  const [newText, setNewText] = useState('');
  const [newPriority, setNewPriority] = useState<Todo['priority']>('medium');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDue, setNewDue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [catFilter, setCatFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const addTodo = () => {
    if (!newText.trim()) return;
    const todo: Todo = {
      id: generateId(),
      text: newText.trim(),
      completed: false,
      priority: newPriority,
      category: newCategory,
      dueDate: newDue || undefined,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [todo, ...prev]);
    setNewText('');
    setNewDue('');
    setShowForm(false);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const filtered = todos
    .filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
    .filter(t => catFilter === 'All' ? true : t.category === catFilter)
    .sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return p[a.priority] - p[b.priority];
    });

  const completedCount = todos.filter(t => t.completed).length;
  const pct = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header stats */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedCount}/{todos.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tasks completed</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Task
          </button>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{pct}% complete</p>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Task</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input
              className="input-glass"
              placeholder="What needs to be done?"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              autoFocus
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Priority</label>
                <select className="input-glass" value={newPriority} onChange={e => setNewPriority(e.target.value as Todo['priority'])}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Category</label>
                <select className="input-glass" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Due Date</label>
                <input type="date" className="input-glass" value={newDue} onChange={e => setNewDue(e.target.value)} />
              </div>
            </div>
            <button onClick={addTodo} className="btn-primary w-full">Add Task</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={cn('chip', filter === f ? 'chip-active' : 'chip-inactive')}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="w-px h-6 self-center" style={{ background: 'var(--glass-border)' }} />
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={cn('chip', catFilter === c ? 'chip-active' : 'chip-inactive')}>
            {c}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <div className="space-y-2 stagger">
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center">
            <p className="text-3xl mb-2">✅</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No tasks here!</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add a new task to get started</p>
          </div>
        )}
        {filtered.map(todo => (
          <div key={todo.id} className={cn('glass-card p-4 flex items-center gap-3 transition-all', todo.completed && 'opacity-60')}>
            <button
              onClick={() => toggleTodo(todo.id)}
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                todo.completed ? 'bg-brand-600 border-brand-600' : 'border-brand-400'
              )}
            >
              {todo.completed && <Check size={12} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium truncate', todo.completed && 'line-through')} style={{ color: 'var(--text-primary)' }}>
                {todo.text}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {todo.dueDate && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>📅 {todo.dueDate}</span>}
                <span className={cn('badge text-xs', priorityColor[todo.priority])}>
                  <Flag size={10} className="inline mr-0.5" />{todo.priority}
                </span>
                <span className="tag">{todo.category}</span>
              </div>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-500 flex-shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
