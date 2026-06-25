import { useState, useCallback } from 'react';
import { Copy, RefreshCw, Check, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SavedPassword {
  id: string;
  label: string;
  password: string;
  createdAt: string;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 4) return { score, label: 'Fair', color: '#f97316' };
  if (score <= 5) return { score, label: 'Good', color: '#eab308' };
  return { score, label: 'Strong', color: '#22c55e' };
}

export default function PasswordGen() {
  const [saved, setSaved] = useLocalStorage<SavedPassword[]>('lifeos-passwords', []);
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSaved, setShowSaved] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const generate = useCallback(() => {
    let chars = '';
    if (options.uppercase) chars += CHAR_SETS.uppercase;
    if (options.lowercase) chars += CHAR_SETS.lowercase;
    if (options.numbers) chars += CHAR_SETS.numbers;
    if (options.symbols) chars += CHAR_SETS.symbols;
    if (!chars) return;
    let pwd = '';
    // Ensure at least one of each selected type
    if (options.uppercase) pwd += CHAR_SETS.uppercase[Math.floor(Math.random() * CHAR_SETS.uppercase.length)];
    if (options.lowercase) pwd += CHAR_SETS.lowercase[Math.floor(Math.random() * CHAR_SETS.lowercase.length)];
    if (options.numbers) pwd += CHAR_SETS.numbers[Math.floor(Math.random() * CHAR_SETS.numbers.length)];
    if (options.symbols) pwd += CHAR_SETS.symbols[Math.floor(Math.random() * CHAR_SETS.symbols.length)];
    while (pwd.length < length) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    // Shuffle
    setPassword(pwd.split('').sort(() => Math.random() - 0.5).join('').slice(0, length));
  }, [length, options]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savePassword = () => {
    if (!password || !saveLabel.trim()) return;
    setSaved(prev => [{ id: generateId(), label: saveLabel, password, createdAt: new Date().toISOString() }, ...prev]);
    setSaveLabel(''); setShowSaveForm(false);
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="animate-fade-in space-y-6 max-w-lg mx-auto">
      {/* Generator */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="section-title">Password Generator</h2>

        {/* Password display */}
        <div className="relative">
          <div className="input-glass py-4 px-4 font-mono text-sm break-all min-h-[56px] flex items-center pr-12" style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
            {password || <span style={{ color: 'var(--text-muted)' }}>Click Generate to create a password</span>}
          </div>
          <button onClick={copy} className={cn('absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-2', copied && 'text-green-400')}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {/* Strength */}
        {strength && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Strength</span>
              <span className="text-xs font-bold" style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <div className="progress-bar">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(strength.score / 7) * 100}%`, background: strength.color }} />
            </div>
          </div>
        )}

        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Length</label>
            <span className="font-bold text-brand-500">{length}</span>
          </div>
          <input type="range" min="6" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>6</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>64</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(options) as (keyof typeof options)[]).map(key => (
            <label key={key} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl transition-all" style={{ background: options[key] ? 'rgba(124,58,237,0.1)' : 'var(--surface)' }}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={e => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
              />
              <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{key}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={generate} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RefreshCw size={16} /> Generate
          </button>
          {password && (
            <button onClick={() => setShowSaveForm(true)} className="btn-ghost flex items-center gap-2 px-4">
              <Plus size={16} /> Save
            </button>
          )}
        </div>

        {showSaveForm && (
          <div className="flex gap-2">
            <input className="input-glass flex-1" placeholder="Label (e.g. Gmail)" value={saveLabel} onChange={e => setSaveLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && savePassword()} />
            <button onClick={savePassword} className="btn-primary px-4">Save</button>
          </div>
        )}
      </div>

      {/* Saved passwords */}
      {saved.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Saved Passwords ({saved.length})</h3>
          <div className="space-y-2">
            {saved.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl group" style={{ background: 'var(--surface)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                  <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                    {visiblePasswords.has(s.id) ? s.password : '••••••••••••••••'}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setVisiblePasswords(prev => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })} className="btn-ghost p-1.5">
                    {visiblePasswords.has(s.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(s.password); }} className="btn-ghost p-1.5 text-brand-400">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => setSaved(prev => prev.filter(p => p.id !== s.id))} className="btn-ghost p-1.5 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
