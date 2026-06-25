import { useState } from 'react';
import { Plus, Settings, X, Droplets, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { today } from '@/lib/utils';
import { cn } from '@/lib/utils';
import DonutChart from '@/components/features/DonutChart';
import type { WaterEntry } from '@/types';

const QUICK_AMOUNTS = [150, 200, 250, 300, 350, 500];

export default function Water() {
  const [waterData, setWaterData] = useLocalStorage<WaterEntry[]>('lifeos-water', []);
  const [goal, setGoal] = useLocalStorage('lifeos-water-goal', 2500);
  const [showSettings, setShowSettings] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [newGoal, setNewGoal] = useState(goal);

  const todayStr = today();
  const todayEntry = waterData.find(w => w.date === todayStr);
  const current = todayEntry?.amount ?? 0;
  const entries = todayEntry?.entries ?? [];
  const pct = Math.min(Math.round((current / goal) * 100), 100);

  const addWater = (amount: number) => {
    if (amount <= 0) return;
    setWaterData(prev => {
      const existing = prev.find(w => w.date === todayStr);
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      if (existing) {
        return prev.map(w => w.date === todayStr ? {
          ...w,
          amount: w.amount + amount,
          entries: [...w.entries, { time, amount }],
        } : w);
      }
      return [...prev, { date: todayStr, amount, goal, entries: [{ time, amount }] }];
    });
  };

  const removeEntry = (idx: number) => {
    setWaterData(prev => prev.map(w => {
      if (w.date !== todayStr) return w;
      const entries = w.entries.filter((_, i) => i !== idx);
      return { ...w, entries, amount: entries.reduce((a, e) => a + e.amount, 0) };
    }));
  };

  const saveSettings = () => {
    setGoal(newGoal);
    setWaterData(prev => prev.map(w => w.date === todayStr ? { ...w, goal: newGoal } : w));
    setShowSettings(false);
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  }).map(d => {
    const entry = waterData.find(w => w.date === d);
    return { date: d, amount: entry?.amount ?? 0, goal: entry?.goal ?? goal };
  });

  return (
    <div className="animate-fade-in space-y-6 max-w-md mx-auto">
      {/* Main tracker */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Water Intake</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={() => setShowSettings(true)} className="btn-ghost p-2"><Settings size={18} /></button>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <DonutChart value={current} max={goal} size={120} color="#3b82f6" label={`${pct}%`} />
          <div>
            <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>{current}<span className="text-base font-normal ml-1">ml</span></p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>of {goal} ml goal</p>
            <p className="text-sm font-medium mt-1" style={{ color: current >= goal ? '#22c55e' : '#3b82f6' }}>
              {current >= goal ? '🎉 Goal reached!' : `${goal - current} ml to go`}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-6">
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }} />
        </div>

        {/* Quick add */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {QUICK_AMOUNTS.map(amt => (
            <button key={amt} onClick={() => addWater(amt)}
              className="p-3 rounded-xl text-center transition-all hover:scale-105"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Droplets size={16} className="mx-auto mb-1 text-blue-400" />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{amt}ml</span>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="flex gap-2">
          <input
            type="number"
            className="input-glass flex-1"
            placeholder="Custom amount (ml)"
            value={customAmount}
            onChange={e => setCustomAmount(e.target.value)}
            min="1"
          />
          <button onClick={() => { addWater(Number(customAmount)); setCustomAmount(''); }} className="btn-primary px-4">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Today's log */}
      {entries.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Today's Log</h3>
          <div className="space-y-2">
            {entries.slice().reverse().map((e, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--surface)' }}>
                <div className="flex items-center gap-2">
                  <Droplets size={14} className="text-blue-400" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{e.amount} ml</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.time}</span>
                  <button onClick={() => removeEntry(entries.length - 1 - i)} className="btn-ghost p-1 text-red-400">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-day history */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>7-Day History</h3>
        <div className="flex items-end gap-2 h-20">
          {last7.map(d => {
            const pct = d.goal > 0 ? Math.min(d.amount / d.goal, 1) : 0;
            const label = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max(pct * 64, 4)}px`, background: d.date === todayStr ? '#3b82f6' : 'rgba(59,130,246,0.3)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Water Goal</h3>
              <button onClick={() => setShowSettings(false)} className="btn-ghost p-1.5"><X size={16} /></button>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Daily water intake goal (ml)</p>
            <input type="number" className="input-glass mb-4" value={newGoal} onChange={e => setNewGoal(Number(e.target.value))} min="500" max="10000" step="100" />
            <div className="flex gap-2">
              {[1500, 2000, 2500, 3000, 3500].map(g => (
                <button key={g} onClick={() => setNewGoal(g)} className={cn('chip flex-1 justify-center text-xs', newGoal === g ? 'chip-active' : 'chip-inactive')}>{g}</button>
              ))}
            </div>
            <button onClick={saveSettings} className="btn-primary w-full mt-4">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
