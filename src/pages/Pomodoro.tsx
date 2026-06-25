import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, X, SkipForward } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, formatTime, today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { PomodoroSession, PomodoroSettings } from '@/types';

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLong: 4,
};

type Mode = 'work' | 'shortBreak' | 'longBreak';

export default function Pomodoro() {
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('lifeos-pomodoro-sessions', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('lifeos-pomodoro-settings', DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getDuration = useCallback((m: Mode) => {
    if (m === 'work') return settings.workDuration * 60;
    if (m === 'shortBreak') return settings.shortBreak * 60;
    return settings.longBreak * 60;
  }, [settings]);

  useEffect(() => {
    setTimeLeft(getDuration(mode));
    setRunning(false);
  }, [mode, settings]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (mode === 'work') {
              const newCount = sessionCount + 1;
              setSessionCount(newCount);
              setSessions(prev => [...prev, {
                id: generateId(), date: today(),
                duration: settings.workDuration, type: 'work', task: currentTask || undefined
              }]);
              const nextMode = newCount % settings.sessionsBeforeLong === 0 ? 'longBreak' : 'shortBreak';
              setTimeout(() => setMode(nextMode), 500);
            } else {
              setTimeout(() => setMode('work'), 500);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running, mode, sessionCount, settings, currentTask]);

  const reset = () => { setRunning(false); setTimeLeft(getDuration(mode)); };
  const skip = () => { setRunning(false); setMode(mode === 'work' ? 'shortBreak' : 'work'); };

  const saveSettings = () => {
    setSettings(tempSettings);
    setShowSettings(false);
  };

  const progress = 1 - timeLeft / getDuration(mode);
  const todayCount = sessions.filter(s => s.date === today() && s.type === 'work').length;
  const totalFocusTime = sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.duration, 0);

  const modeColors: Record<Mode, string> = {
    work: '#7c3aed',
    shortBreak: '#22c55e',
    longBreak: '#3b82f6',
  };

  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="animate-fade-in space-y-6 max-w-lg mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{todayCount}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Today</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{sessions.filter(s => s.type === 'work').length}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{Math.round(totalFocusTime / 60)}h</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Focus time</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="glass-card p-1.5 flex gap-1">
        {(['work', 'shortBreak', 'longBreak'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} className={cn(
            'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
            mode === m ? 'text-white' : 'btn-ghost'
          )} style={mode === m ? { background: modeColors[m] } : {}}>
            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="glass-card p-8 flex flex-col items-center">
        <div className="relative mb-6">
          <svg width={260} height={260} className="-rotate-90">
            <circle cx={130} cy={130} r={radius} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth={12} />
            <circle
              cx={130} cy={130} r={radius} fill="none"
              stroke={modeColors[mode]}
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={`${circumference * progress} ${circumference}`}
              style={{ transition: 'stroke-dasharray 1s linear', filter: `drop-shadow(0 0 8px ${modeColors[mode]}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-5xl" style={{ color: 'var(--text-primary)' }}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </span>
          </div>
        </div>

        {/* Task input */}
        <input
          className="input-glass w-full mb-6 text-center"
          placeholder="What are you working on?"
          value={currentTask}
          onChange={e => setCurrentTask(e.target.value)}
        />

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={reset} className="btn-ghost p-3 rounded-xl">
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setRunning(!running)}
            className="w-16 h-16 rounded-2xl text-white font-bold flex items-center justify-center transition-all shadow-glow hover:shadow-glow-lg"
            style={{ background: `linear-gradient(135deg, ${modeColors[mode]}, ${modeColors[mode]}cc)` }}
          >
            {running ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={skip} className="btn-ghost p-3 rounded-xl">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Session dots */}
        <div className="flex gap-2 mt-6">
          {Array.from({ length: settings.sessionsBeforeLong }).map((_, i) => (
            <div key={i} className={cn('w-3 h-3 rounded-full transition-all', i < sessionCount % settings.sessionsBeforeLong ? 'bg-brand-500' : 'bg-brand-500/20')} />
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex justify-end">
        <button onClick={() => setShowSettings(true)} className="btn-ghost flex items-center gap-2 text-sm">
          <Settings size={16} /> Timer Settings
        </button>
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Timer Settings</h3>
              <button onClick={() => setShowSettings(false)} className="btn-ghost p-1.5"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Focus Duration (min)', key: 'workDuration' as keyof PomodoroSettings },
                { label: 'Short Break (min)', key: 'shortBreak' as keyof PomodoroSettings },
                { label: 'Long Break (min)', key: 'longBreak' as keyof PomodoroSettings },
                { label: 'Sessions before long break', key: 'sessionsBeforeLong' as keyof PomodoroSettings },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                  <input
                    type="number"
                    className="input-glass w-20 text-center"
                    value={tempSettings[key]}
                    onChange={e => setTempSettings(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    min={1} max={60}
                  />
                </div>
              ))}
              <button onClick={saveSettings} className="btn-primary w-full mt-2">Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {sessions.filter(s => s.date === today()).length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Today's Sessions</h3>
          <div className="space-y-1.5">
            {sessions.filter(s => s.date === today()).slice(-5).reverse().map(s => (
              <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg" style={{ background: 'var(--surface)' }}>
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', s.type === 'work' ? 'bg-brand-500' : 'bg-green-500')} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.task || (s.type === 'work' ? 'Focus session' : 'Break')}</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.duration} min</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
