import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckSquare, BookOpen, Target, StickyNote, Link2, Dumbbell, Droplets, BookMarked, GraduationCap, X, ArrowRight, Hash, Clock, Smile, Zap, Sparkles, Pencil, Eraser, ZoomIn, Type, Monitor, Layout, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Todo, Note, Habit, Bookmark, Goal, ReadingBook, WorkoutSession, StudySession } from '@/types';

interface SearchResult {
  id: string;
  type: 'todo' | 'note' | 'habit' | 'bookmark' | 'goal' | 'book' | 'workout' | 'study' | 'nav';
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_SHORTCUTS: SearchResult[] = [
  { id: 'nav-dashboard', type: 'nav', title: 'Dashboard', subtitle: 'Overview of your life', path: '/', icon: <Zap size={15} /> },
  { id: 'nav-todos', type: 'nav', title: 'To-Do Manager', subtitle: 'Manage your tasks', path: '/todos', icon: <CheckSquare size={15} /> },
  { id: 'nav-habits', type: 'nav', title: 'Habit Tracker', subtitle: 'Build daily habits', path: '/habits', icon: <Target size={15} /> },
  { id: 'nav-goals', type: 'nav', title: 'Goal Planner', subtitle: 'Track long-term goals', path: '/goals', icon: <Target size={15} /> },
  { id: 'nav-notes', type: 'nav', title: 'Notes', subtitle: 'Capture your thoughts', path: '/notes', icon: <StickyNote size={15} /> },
  { id: 'nav-pomodoro', type: 'nav', title: 'Pomodoro Timer', subtitle: 'Focus sessions', path: '/pomodoro', icon: <Clock size={15} /> },
  { id: 'nav-mood', type: 'nav', title: 'Mood Tracker', subtitle: 'Track how you feel', path: '/mood', icon: <Smile size={15} /> },
  { id: 'nav-bookmarks', type: 'nav', title: 'Bookmarks', subtitle: 'Saved websites', path: '/bookmarks', icon: <Link2 size={15} /> },
  { id: 'nav-water', type: 'nav', title: 'Water Tracker', subtitle: 'Stay hydrated', path: '/water', icon: <Droplets size={15} /> },
  { id: 'nav-reading', type: 'nav', title: 'Reading Tracker', subtitle: 'Books and progress', path: '/reading', icon: <BookOpen size={15} /> },
  { id: 'nav-study', type: 'nav', title: 'Study Planner', subtitle: 'Learning sessions', path: '/study', icon: <GraduationCap size={15} /> },
  { id: 'nav-workout', type: 'nav', title: 'Workout Planner', subtitle: 'Fitness tracking', path: '/workout', icon: <Dumbbell size={15} /> },
  { id: 'nav-bmi', type: 'nav', title: 'BMI Calculator', subtitle: 'Health metrics', path: '/bmi', icon: <Hash size={15} /> },
  { id: 'nav-export', type: 'nav', title: 'Data Export', subtitle: 'Backup & restore data', path: '/export', icon: <ArrowRight size={15} /> },
  { id: 'nav-ai-image', type: 'nav', title: 'AI Image Generator', subtitle: 'Text to image AI art', path: '/ai-image', icon: <Sparkles size={15} /> },
  { id: 'nav-ai-editor', type: 'nav', title: 'AI Image Editor', subtitle: 'Filters & adjustments', path: '/ai-editor', icon: <Pencil size={15} /> },
  { id: 'nav-bg-remover', type: 'nav', title: 'Background Remover', subtitle: 'Remove image backgrounds', path: '/bg-remover', icon: <Eraser size={15} /> },
  { id: 'nav-enhancer', type: 'nav', title: 'Photo Enhancer', subtitle: 'Improve photo quality', path: '/photo-enhancer', icon: <Zap size={15} /> },
  { id: 'nav-upscaler', type: 'nav', title: 'Image Upscaler', subtitle: 'Increase resolution up to 4×', path: '/upscaler', icon: <ZoomIn size={15} /> },
  { id: 'nav-logo', type: 'nav', title: 'Logo Generator', subtitle: 'Create brand logos', path: '/logo-gen', icon: <Type size={15} /> },
  { id: 'nav-thumbnail', type: 'nav', title: 'Thumbnail Creator', subtitle: 'YouTube thumbnails 1280×720', path: '/thumbnail', icon: <Monitor size={15} /> },
  { id: 'nav-poster', type: 'nav', title: 'Poster Maker', subtitle: 'Social media posters', path: '/poster-maker', icon: <Layout size={15} /> },
  { id: 'nav-meme', type: 'nav', title: 'Meme Generator', subtitle: 'Create viral memes', path: '/meme-gen', icon: <Smile size={15} /> },
  { id: 'nav-qr-designer', type: 'nav', title: 'QR Code Designer', subtitle: 'Colorful styled QR codes', path: '/qr-designer', icon: <Palette size={15} /> },
];

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function buildResults(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();

  if (!q) return NAV_SHORTCUTS.slice(0, 6);

  const results: SearchResult[] = [];

  // Nav shortcuts
  NAV_SHORTCUTS.forEach(n => {
    if (n.title.toLowerCase().includes(q) || (n.subtitle ?? '').toLowerCase().includes(q)) {
      results.push(n);
    }
  });

  // Todos
  const todos = readLS<Todo[]>('lifeos-todos', []);
  todos.forEach(t => {
    if (t.text.toLowerCase().includes(q)) {
      results.push({
        id: `todo-${t.id}`,
        type: 'todo',
        title: t.text,
        subtitle: t.completed ? 'Completed' : `Priority: ${t.priority}`,
        badge: t.completed ? 'Done' : t.priority,
        badgeColor: t.completed ? '#22c55e' : t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#f97316' : '#3b82f6',
        path: '/todos',
        icon: <CheckSquare size={15} className="text-brand-400" />,
      });
    }
  });

  // Notes
  const notes = readLS<Note[]>('lifeos-notes', []);
  notes.forEach(n => {
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      results.push({
        id: `note-${n.id}`,
        type: 'note',
        title: n.title || 'Untitled Note',
        subtitle: n.content.slice(0, 60) || undefined,
        path: '/notes',
        icon: <StickyNote size={15} className="text-yellow-400" />,
      });
    }
  });

  // Habits
  const habits = readLS<Habit[]>('lifeos-habits', []);
  habits.forEach(h => {
    if (h.name.toLowerCase().includes(q)) {
      results.push({
        id: `habit-${h.id}`,
        type: 'habit',
        title: h.name,
        subtitle: `${h.streak} day streak`,
        badge: `${h.streak}🔥`,
        badgeColor: '#f59e0b',
        path: '/habits',
        icon: <span style={{ fontSize: 15 }}>{h.icon}</span>,
      });
    }
  });

  // Goals
  const goals = readLS<Goal[]>('lifeos-goals', []);
  goals.forEach(g => {
    if (g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)) {
      results.push({
        id: `goal-${g.id}`,
        type: 'goal',
        title: g.title,
        subtitle: g.description || `${g.progress}% complete`,
        badge: `${g.progress}%`,
        badgeColor: '#7c3aed',
        path: '/goals',
        icon: <Target size={15} className="text-brand-400" />,
      });
    }
  });

  // Bookmarks
  const bookmarks = readLS<Bookmark[]>('lifeos-bookmarks', []);
  bookmarks.forEach(b => {
    if (b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)) {
      results.push({
        id: `bm-${b.id}`,
        type: 'bookmark',
        title: b.title,
        subtitle: b.url,
        badge: b.category,
        badgeColor: '#06b6d4',
        path: '/bookmarks',
        icon: <Link2 size={15} className="text-cyan-400" />,
      });
    }
  });

  // Books
  const books = readLS<ReadingBook[]>('lifeos-books', []);
  books.forEach(b => {
    if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
      results.push({
        id: `book-${b.id}`,
        type: 'book',
        title: b.title,
        subtitle: b.author || undefined,
        badge: b.status === 'completed' ? 'Done' : b.status,
        badgeColor: b.status === 'completed' ? '#22c55e' : '#7c3aed',
        path: '/reading',
        icon: <BookMarked size={15} className="text-green-400" />,
      });
    }
  });

  // Workouts
  const workouts = readLS<WorkoutSession[]>('lifeos-workouts', []);
  workouts.forEach(w => {
    if (w.name.toLowerCase().includes(q) || w.exercises.some(e => e.name.toLowerCase().includes(q))) {
      results.push({
        id: `wk-${w.id}`,
        type: 'workout',
        title: w.name,
        subtitle: `${w.exercises.length} exercises • ${w.date}`,
        path: '/workout',
        icon: <Dumbbell size={15} className="text-orange-400" />,
      });
    }
  });

  // Study sessions
  const studySessions = readLS<StudySession[]>('lifeos-study', []);
  studySessions.forEach(s => {
    if (s.subject.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q)) {
      results.push({
        id: `st-${s.id}`,
        type: 'study',
        title: s.subject,
        subtitle: s.topic || `${s.duration} min • ${s.date}`,
        path: '/study',
        icon: <GraduationCap size={15} className="text-blue-400" />,
      });
    }
  });

  return results.slice(0, 10);
}

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  nav: 'Navigate',
  todo: 'Task',
  note: 'Note',
  habit: 'Habit',
  goal: 'Goal',
  bookmark: 'Bookmark',
  book: 'Book',
  workout: 'Workout',
  study: 'Study',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchSpotlight({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = buildResults(query);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[activeIdx]) { handleSelect(results[activeIdx]); }
    else if (e.key === 'Escape') { onClose(); }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl"
        style={{
          background: 'var(--sidebar-bg)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'var(--text-primary)', caretColor: '#7c3aed' }}
            placeholder="Search todos, notes, habits, bookmarks…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKey}
          />
          {query && (
            <button onClick={() => setQuery('')} className="btn-ghost p-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-lg flex-shrink-0"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="overflow-y-auto max-h-[420px] py-2">
          {results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No results for "{query}"</p>
            </div>
          ) : (
            <>
              {!query && (
                <p className="text-xs font-semibold px-4 pb-1.5 pt-0.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Quick Navigation
                </p>
              )}
              {results.map((r, i) => (
                <button
                  key={r.id}
                  data-idx={i}
                  onClick={() => handleSelect(r)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    i === activeIdx ? 'bg-brand-500/15' : 'hover:bg-white/5'
                  )}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}
                  >
                    {r.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                    {r.subtitle && (
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{r.subtitle}</p>
                    )}
                  </div>

                  {/* Badge & type */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.badge && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${r.badgeColor}20`, color: r.badgeColor }}
                      >
                        {r.badge}
                      </span>
                    )}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
                    >
                      {TYPE_LABELS[r.type]}
                    </span>
                    {i === activeIdx && (
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-t"
          style={{ borderColor: 'var(--glass-border)' }}
        >
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>↵</kbd>
              Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>Esc</kbd>
              Close
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
