import { Menu, Download, Search, Coffee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  onSearchOpen?: () => void;
}

export default function Header({ onMenuClick, title, onSearchOpen }: HeaderProps) {
  const [userName] = useLocalStorage('lifeos-username', 'Friend');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setCanInstall(false);
    setDeferredPrompt(null);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="btn-ghost p-2 rounded-xl lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
            {greeting}, {userName} ✨
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 hidden sm:flex"
          style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
          title="Search (⌘K)"
        >
          <Search size={14} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Search…</span>
          <kbd className="ml-1 text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>⌘K</kbd>
        </button>
        <button
          onClick={onSearchOpen}
          className="btn-ghost p-2 sm:hidden"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        {canInstall && (
          <button
            onClick={handleInstall}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-3"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}
        <a
          href="https://www.buymeacoffee.com/lifeos"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold py-2 px-3 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
          title="Enjoying LifeOS? Support the developer with a coffee ☕"
        >
          <Coffee size={14} />
          <span>Buy Me a Coffee</span>
        </a>
        <a
          href="https://www.buymeacoffee.com/lifeos"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost p-2 sm:hidden"
          title="Buy Me a Coffee ☕"
        >
          <Coffee size={18} />
        </a>
      </div>
    </header>
  );
}
