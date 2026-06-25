import { useState } from 'react';
import { Plus, Search, Trash2, ExternalLink, X, Bookmark } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Bookmark as BookmarkType } from '@/types';

const CATEGORIES = ['All', 'Work', 'Learning', 'Entertainment', 'Tools', 'News', 'Social', 'Other'];

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkType[]>('lifeos-bookmarks', []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [cat, setCat] = useState('Other');

  const addBookmark = () => {
    if (!url.trim()) return;
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    const domain = new URL(finalUrl).hostname;
    const bookmark: BookmarkType = {
      id: generateId(),
      title: title.trim() || domain,
      url: finalUrl,
      description: description.trim(),
      category: cat,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      createdAt: new Date().toISOString(),
    };
    setBookmarks(prev => [bookmark, ...prev]);
    setTitle(''); setUrl(''); setDescription(''); setShowForm(false);
  };

  const filtered = bookmarks
    .filter(b => {
      const q = search.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
    })
    .filter(b => category === 'All' ? true : b.category === category);

  return (
    <div className="animate-fade-in space-y-5">
      {/* Search & add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-glass pl-9" placeholder="Search bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={cn('chip', category === c ? 'chip-active' : 'chip-inactive')}>{c}</button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Add Bookmark</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input className="input-glass" placeholder="URL (required)" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addBookmark()} />
            <input className="input-glass" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="input-glass" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            <select className="input-glass" value={cat} onChange={e => setCat(e.target.value)}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addBookmark} className="btn-primary w-full">Save Bookmark</button>
          </div>
        </div>
      )}

      {/* Bookmarks grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Bookmark size={36} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No bookmarks yet</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Save your favorite websites here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger">
          {filtered.map(b => (
            <div key={b.id} className="glass-card p-4 flex items-start gap-3 group">
              <img src={b.favicon} alt="" className="w-8 h-8 rounded-lg flex-shrink-0 mt-0.5" onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="%237c3aed"/><text y="16" x="4" fill="white" font-size="12">🔗</text></svg>'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{b.title}</p>
                <p className="text-xs truncate mb-1" style={{ color: 'var(--text-muted)' }}>{b.url}</p>
                {b.description && <p className="text-xs line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{b.description}</p>}
                <span className="tag mt-1 inline-block">{b.category}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="btn-ghost p-1.5 text-brand-400">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => setBookmarks(prev => prev.filter(bm => bm.id !== b.id))} className="btn-ghost p-1.5 text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
