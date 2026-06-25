import { useState } from 'react';
import { RefreshCw, Heart, Copy, Check, Share2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DAILY_QUOTES, getTodayQuote } from '@/constants/quotes';
import { cn } from '@/lib/utils';

export default function Quotes() {
  const [favorites, setFavorites] = useLocalStorage<number[]>('lifeos-quote-favorites', []);
  const [current, setCurrent] = useState(() => {
    const q = getTodayQuote();
    return DAILY_QUOTES.indexOf(q);
  });
  const [copied, setCopied] = useState(false);
  const [filterFav, setFilterFav] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const quote = DAILY_QUOTES[current];
  const categories = ['All', ...Array.from(new Set(DAILY_QUOTES.map(q => q.category)))];

  const toggleFav = (idx: number) => {
    setFavorites(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const randomQuote = () => {
    let next;
    do { next = Math.floor(Math.random() * DAILY_QUOTES.length); } while (next === current);
    setCurrent(next);
  };

  const copyQuote = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayList = DAILY_QUOTES
    .map((q, i) => ({ ...q, idx: i }))
    .filter(q => filterFav ? favorites.includes(q.idx) : true)
    .filter(q => filterCat === 'All' ? true : q.category === filterCat);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero quote */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-indigo-600/5 rounded-2xl" />
        <div className="relative text-center">
          <div className="text-6xl mb-4 opacity-20 font-display font-bold" style={{ color: 'var(--text-muted)' }}>"</div>
          <p className="text-lg lg:text-xl font-medium italic leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
            {quote.text}
          </p>
          <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>— {quote.author}</p>
          <span className="tag mt-2 inline-block">{quote.category}</span>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => toggleFav(current)} className={cn('btn-ghost p-3 rounded-xl transition-all', favorites.includes(current) && 'text-red-400')}>
              <Heart size={20} fill={favorites.includes(current) ? 'currentColor' : 'none'} />
            </button>
            <button onClick={randomQuote} className="btn-primary flex items-center gap-2">
              <RefreshCw size={16} /> New Quote
            </button>
            <button onClick={copyQuote} className="btn-ghost p-3 rounded-xl">
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterFav(!filterFav)} className={cn('chip', filterFav ? 'chip-active' : 'chip-inactive')}>
          <Heart size={12} /> Favorites ({favorites.length})
        </button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={cn('chip', filterCat === c && !filterFav ? 'chip-active' : 'chip-inactive')}>
            {c}
          </button>
        ))}
      </div>

      {/* Quote list */}
      <div className="space-y-3 stagger">
        {displayList.map(q => (
          <div key={q.idx} onClick={() => setCurrent(q.idx)} className={cn('glass-card p-4 cursor-pointer', current === q.idx && 'border-brand-500 border-2')}>
            <p className="text-sm italic mb-2" style={{ color: 'var(--text-secondary)' }}>"{q.text}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>— {q.author}</span>
                <span className="tag">{q.category}</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleFav(q.idx); }}
                className={cn('btn-ghost p-1', favorites.includes(q.idx) && 'text-red-400')}
              >
                <Heart size={14} fill={favorites.includes(q.idx) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
