import { useState } from 'react';
import { Download, Upload, Trash2, Check, AlertTriangle, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

const DATA_KEYS = [
  { key: 'lifeos-todos', label: 'To-Do Tasks', icon: '✅' },
  { key: 'lifeos-habits', label: 'Habits', icon: '🔥' },
  { key: 'lifeos-goals', label: 'Goals', icon: '🎯' },
  { key: 'lifeos-notes', label: 'Notes', icon: '📝' },
  { key: 'lifeos-moods', label: 'Mood Entries', icon: '😊' },
  { key: 'lifeos-water', label: 'Water Intake', icon: '💧' },
  { key: 'lifeos-pomodoro-sessions', label: 'Pomodoro Sessions', icon: '⏱️' },
  { key: 'lifeos-books', label: 'Reading List', icon: '📚' },
  { key: 'lifeos-study', label: 'Study Sessions', icon: '🎓' },
  { key: 'lifeos-workouts', label: 'Workout Sessions', icon: '💪' },
  { key: 'lifeos-bookmarks', label: 'Bookmarks', icon: '🔖' },
  { key: 'lifeos-vision', label: 'Vision Board', icon: '🖼️' },
  { key: 'lifeos-passwords', label: 'Saved Passwords', icon: '🔑' },
  { key: 'lifeos-quote-favorites', label: 'Quote Favorites', icon: '💬' },
  { key: 'lifeos-theme', label: 'Theme Setting', icon: '🎨' },
  { key: 'lifeos-username', label: 'Username', icon: '👤' },
  { key: 'lifeos-water-goal', label: 'Water Goal', icon: '⚙️' },
  { key: 'lifeos-pomodoro-settings', label: 'Pomodoro Settings', icon: '⚙️' },
];

function getStorageSize(): string {
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += localStorage.getItem(key)?.length ?? 0;
  }
  if (total < 1024) return `${total} B`;
  if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
  return `${(total / 1024 / 1024).toFixed(2)} MB`;
}

export default function DataExport() {
  const [imported, setImported] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(DATA_KEYS.map(d => d.key)));
  const [importError, setImportError] = useState('');

  const toggleKey = (key: string) => {
    setSelectedKeys(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const exportData = () => {
    const data: Record<string, unknown> = { _meta: { version: '1.0', exportedAt: new Date().toISOString(), app: 'LifeOS' } };
    for (const { key } of DATA_KEYS) {
      if (selectedKeys.has(key)) {
        try { data[key] = JSON.parse(localStorage.getItem(key) ?? 'null'); } catch { data[key] = null; }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data._meta || data._meta.app !== 'LifeOS') {
          setImportError('Invalid LifeOS backup file.');
          return;
        }
        for (const { key } of DATA_KEYS) {
          if (data[key] !== undefined && data[key] !== null) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        }
        setImported(true);
        setTimeout(() => { setImported(false); window.location.reload(); }, 1500);
      } catch {
        setImportError('Failed to parse backup file. Please use a valid LifeOS export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAll = () => {
    for (const { key } of DATA_KEYS) localStorage.removeItem(key);
    setCleared(true);
    setShowClearConfirm(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  const storageSize = getStorageSize();
  const itemCounts = DATA_KEYS.map(d => {
    try {
      const val = JSON.parse(localStorage.getItem(d.key) ?? 'null');
      const count = Array.isArray(val) ? val.length : val !== null ? 1 : 0;
      return { ...d, count };
    } catch { return { ...d, count: 0 }; }
  });

  return (
    <div className="animate-fade-in space-y-6 max-w-lg mx-auto">
      {/* Overview */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.15)' }}>
            <Database size={24} className="text-brand-500" />
          </div>
          <div>
            <h2 className="section-title mb-0">Data Management</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Storage used: {storageSize}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={exportData} className="btn-primary flex items-center justify-center gap-2 py-3">
            <Download size={18} /> Export Backup
          </button>
          <label className="btn-ghost flex items-center justify-center gap-2 py-3 cursor-pointer border rounded-xl transition-all" style={{ borderColor: 'var(--glass-border)' }}>
            <Upload size={18} />
            <span className="font-medium text-sm">Import Backup</span>
            <input type="file" accept=".json" className="hidden" onChange={importData} />
          </label>
        </div>
        {imported && <p className="text-green-400 text-sm text-center mt-3 flex items-center justify-center gap-2"><Check size={14} /> Data imported! Reloading...</p>}
        {importError && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertTriangle size={14} /> {importError}</p>}
      </div>

      {/* Username setting */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Your Name</h3>
        <div className="flex gap-2">
          <input
            className="input-glass flex-1"
            placeholder="Enter your name..."
            defaultValue={localStorage.getItem('lifeos-username')?.replace(/"/g, '') ?? ''}
            onBlur={e => { localStorage.setItem('lifeos-username', JSON.stringify(e.target.value || 'Friend')); }}
          />
          <button onClick={() => window.location.reload()} className="btn-primary px-4">Save</button>
        </div>
      </div>

      {/* Select data */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Select Data to Export</h3>
          <div className="flex gap-2">
            <button onClick={() => setSelectedKeys(new Set(DATA_KEYS.map(d => d.key)))} className="text-xs text-brand-400 hover:text-brand-300">All</button>
            <button onClick={() => setSelectedKeys(new Set())} className="text-xs text-brand-400 hover:text-brand-300">None</button>
          </div>
        </div>
        <div className="space-y-1.5">
          {itemCounts.map(d => (
            <label key={d.key} className={cn('flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all', selectedKeys.has(d.key) ? 'bg-brand-500/10 border border-brand-500/20' : '')} style={{ background: selectedKeys.has(d.key) ? undefined : 'var(--surface)' }}>
              <div className="flex items-center gap-2.5">
                <input type="checkbox" checked={selectedKeys.has(d.key)} onChange={() => toggleKey(d.key)} />
                <span className="text-base">{d.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
              </div>
              {d.count > 0 && <span className="badge-purple badge">{d.count} items</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass-card p-5 border border-red-500/20">
        <h3 className="font-semibold text-sm text-red-400 mb-2">Danger Zone</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>This will permanently delete all your LifeOS data. This action cannot be undone.</p>
        {!showClearConfirm ? (
          <button onClick={() => setShowClearConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium">
            <Trash2 size={15} /> Clear All Data
          </button>
        ) : (
          <div className="flex gap-3 items-center">
            <p className="text-sm text-red-400 flex-1">Are you absolutely sure?</p>
            <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all">
              {cleared ? 'Clearing...' : 'Yes, Delete All'}
            </button>
            <button onClick={() => setShowClearConfirm(false)} className="btn-ghost px-3 py-2 text-sm">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
