import { useNavigate } from 'react-router-dom';
import { CheckSquare, TrendingUp, Target, Timer, Droplets, SmilePlus, BookOpen, Dumbbell, Calendar, Flame } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { today, getLast7Days, MOOD_EMOJIS, MOOD_COLORS } from '@/lib/utils';
import MiniBarChart from '@/components/features/MiniBarChart';
import DonutChart from '@/components/features/DonutChart';
import { getTodayQuote } from '@/constants/quotes';
import type { Todo, Habit, Goal, MoodEntry, WaterEntry, PomodoroSession, WorkoutSession } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [todos] = useLocalStorage<Todo[]>('lifeos-todos', []);
  const [habits] = useLocalStorage<Habit[]>('lifeos-habits', []);
  const [goals] = useLocalStorage<Goal[]>('lifeos-goals', []);
  const [moods] = useLocalStorage<MoodEntry[]>('lifeos-moods', []);
  const [waterData] = useLocalStorage<WaterEntry[]>('lifeos-water', []);
  const [pomodoroSessions] = useLocalStorage<PomodoroSession[]>('lifeos-pomodoro-sessions', []);
  const [workouts] = useLocalStorage<WorkoutSession[]>('lifeos-workouts', []);
  const [userName] = useLocalStorage('lifeos-username', 'Friend');

  const todayStr = today();
  const last7 = getLast7Days();
  const quote = getTodayQuote();

  // Stats
  const todayTodos = todos.filter(t => !t.completed);
  const completedToday = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const todayHabits = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const todayWater = waterData.find(w => w.date === todayStr);
  const waterPct = todayWater ? (todayWater.amount / todayWater.goal) * 100 : 0;
  const todayMood = moods.find(m => m.date === todayStr);
  const todayPomodoros = pomodoroSessions.filter(s => s.date === todayStr && s.type === 'work').length;
  const todayWorkout = workouts.find(w => w.date === todayStr);

  // Habit chart last 7 days
  const habitData = last7.map(d =>
    habits.filter(h => h.completedDates.includes(d)).length
  );

  // Mood chart last 7 days
  const moodData = last7.map(d => {
    const entry = moods.find(m => m.date === d);
    return entry ? entry.mood : 0;
  });

  // Pomodoro chart last 7 days
  const pomData = last7.map(d =>
    pomodoroSessions.filter(s => s.date === d && s.type === 'work').length
  );

  const dayLabels = last7.map(d => {
    const date = new Date(d + 'T00:00:00');
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()];
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const AI_TOOLS = [
    { path: '/ai-image', emoji: '🎨', label: 'AI Image Gen' },
    { path: '/ai-editor', emoji: '✏️', label: 'Image Editor' },
    { path: '/bg-remover', emoji: '✂️', label: 'BG Remover' },
    { path: '/photo-enhancer', emoji: '⚡', label: 'Enhancer' },
    { path: '/upscaler', emoji: '🔍', label: 'Upscaler' },
    { path: '/face-restore', emoji: '👤', label: 'Face Restore' },
    { path: '/obj-remover', emoji: '🧹', label: 'Obj Remover' },
    { path: '/colorizer', emoji: '🌈', label: 'Colorizer' },
    { path: '/avatar-gen', emoji: '🤖', label: 'Avatar Gen' },
    { path: '/logo-gen', emoji: '💎', label: 'Logo Gen' },
    { path: '/poster-maker', emoji: '📣', label: 'Poster Maker' },
    { path: '/thumbnail', emoji: '📺', label: 'Thumbnail' },
    { path: '/meme-gen', emoji: '😂', label: 'Meme Gen' },
    { path: '/qr-designer', emoji: '⬛', label: 'QR Designer' },
    { path: '/img-compress', emoji: '🗜️', label: 'Compressor' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero greeting */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-indigo-600/10 rounded-2xl" />
        <div className="relative">
          <p className="text-brand-400 font-semibold text-sm mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h2 className="font-display font-bold text-2xl lg:text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {userName}! ✨
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {todayHabits}/{habits.length} habits • {completedToday}/{totalTodos} tasks • {todayPomodoros} focus sessions
          </p>
        </div>
      </div>

      {/* Quote */}
      <div className="glass-card p-5 border-l-4 border-brand-500">
        <p className="text-sm italic mb-2" style={{ color: 'var(--text-secondary)' }}>"{quote.text}"</p>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>— {quote.author}</p>
          <span className="tag">{quote.category}</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <div onClick={() => navigate('/todos')} className="glass-card p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-500/15">
              <CheckSquare size={18} className="text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-blue-400">{completedToday}/{totalTodos}</span>
          </div>
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{todayTodos.length}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Pending tasks</p>
        </div>

        <div onClick={() => navigate('/habits')} className="glass-card p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-brand-500/15">
              <TrendingUp size={18} className="text-brand-500" />
            </div>
            <span className="text-xs font-semibold text-brand-400">{habits.length} total</span>
          </div>
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{todayHabits}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Habits done</p>
        </div>

        <div onClick={() => navigate('/goals')} className="glass-card p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-green-500/15">
              <Target size={18} className="text-green-500" />
            </div>
            <span className="text-xs font-semibold text-green-400">{goals.filter(g => g.status === 'completed').length} done</span>
          </div>
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{activeGoals}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Active goals</p>
        </div>

        <div onClick={() => navigate('/pomodoro')} className="glass-card p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-red-500/15">
              <Timer size={18} className="text-red-500" />
            </div>
            <span className="text-xs font-semibold text-red-400">today</span>
          </div>
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{todayPomodoros}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Focus sessions</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Habits (7d)</h3>
            <span className="tag">{habits.length} tracked</span>
          </div>
          <MiniBarChart data={habitData} labels={dayLabels} color="#7c3aed" height={80} showLabels />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Mood (7d)</h3>
            <span className="tag">{todayMood ? MOOD_EMOJIS[todayMood.mood] : '—'} today</span>
          </div>
          <MiniBarChart data={moodData} labels={dayLabels} color="#22c55e" height={80} showLabels />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Focus (7d)</h3>
            <span className="tag">{todayPomodoros} today</span>
          </div>
          <MiniBarChart data={pomData} labels={dayLabels} color="#f97316" height={80} showLabels />
        </div>
      </div>

      {/* Health row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water */}
        <div onClick={() => navigate('/water')} className="glass-card p-5 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={18} className="text-blue-400" />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Water Intake</h3>
              </div>
              <p className="font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
                {todayWater?.amount ?? 0}
                <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/ {todayWater?.goal ?? 2500} ml</span>
              </p>
              <div className="progress-bar mt-3 w-full">
                <div className="progress-fill" style={{ width: `${Math.min(waterPct, 100)}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
              </div>
            </div>
            <DonutChart
              value={todayWater?.amount ?? 0}
              max={todayWater?.goal ?? 2500}
              color="#3b82f6"
              size={72}
              label={`${Math.round(waterPct)}%`}
            />
          </div>
        </div>

        {/* Today Mood */}
        <div onClick={() => navigate('/mood')} className="glass-card p-5 cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <SmilePlus size={18} className="text-yellow-400" />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Today's Mood</h3>
          </div>
          {todayMood ? (
            <div className="flex items-center gap-4">
              <span className="text-4xl">{MOOD_EMOJIS[todayMood.mood]}</span>
              <div>
                <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {['', 'Awful', 'Bad', 'Okay', 'Good', 'Amazing'][todayMood.mood]}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Energy: {todayMood.energy}/5</p>
                {todayMood.note && <p className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)' }}>"{todayMood.note}"</p>}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-3xl mb-2">🤔</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>How are you feeling today?</p>
              <button className="btn-primary mt-3 text-xs py-1.5 px-3">Log Mood</button>
            </div>
          )}
        </div>
      </div>

      {/* Today's todos preview */}
      {todayTodos.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pending Tasks</h3>
            <button onClick={() => navigate('/todos')} className="text-xs text-brand-500 hover:text-brand-400 font-medium">View all</button>
          </div>
          <div className="space-y-2">
            {todayTodos.slice(0, 4).map(todo => (
              <div key={todo.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${todo.priority === 'high' ? 'bg-red-500' : todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{todo.text}</span>
                <span className="tag text-xs">{todo.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active goals */}
      {goals.filter(g => g.status === 'active').length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Active Goals</h3>
            <button onClick={() => navigate('/goals')} className="text-xs text-brand-500 hover:text-brand-400 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {goals.filter(g => g.status === 'active').slice(0, 3).map(goal => (
              <div key={goal.id} className="p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{goal.title}</span>
                  <span className="text-xs font-semibold text-brand-500">{goal.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Creator Tools */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>🎨 AI Creator Tools</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>15 AI-powered image tools — free &amp; offline-ready</p>
          </div>
          <span className="badge" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: 10, padding: '2px 8px' }}>NEW</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {AI_TOOLS.map(t => (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className="glass-card p-3 text-center transition-all hover:scale-105 hover:border-brand-400 active:scale-95"
              style={{ background: 'var(--surface)' }}
            >
              <span className="text-2xl block mb-1.5">{t.emoji}</span>
              <span className="text-xs font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
