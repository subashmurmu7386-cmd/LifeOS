import { useState } from 'react';
import { Plus, Trash2, X, Image } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { VisionBoardItem } from '@/types';

const CATEGORIES = ['Career', 'Health', 'Travel', 'Relationship', 'Finance', 'Lifestyle', 'Learning', 'Other'];
const UNSPLASH_QUERIES = {
  Career: 'success office modern',
  Health: 'fitness wellness healthy',
  Travel: 'travel adventure landscape',
  Relationship: 'family love happiness',
  Finance: 'wealth abundance prosperity',
  Lifestyle: 'luxury lifestyle dream',
  Learning: 'education books knowledge',
  Other: 'inspiration motivation dream',
};

export default function VisionBoard() {
  const [items, setItems] = useLocalStorage<VisionBoardItem[]>('lifeos-vision', []);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Career');
  const [imageUrl, setImageUrl] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const getRandomUnsplash = (cat: string) => {
    const query = UNSPLASH_QUERIES[cat as keyof typeof UNSPLASH_QUERIES] || 'inspiration';
    const n = Math.floor(Math.random() * 50) + 1;
    return `https://images.unsplash.com/photo-${1550000000 + n * 1000000}?w=600&h=400&fit=crop&q=80`;
  };

  const addItem = () => {
    if (!title.trim()) return;
    const url = imageUrl.trim() || `https://source.unsplash.com/600x400/?${UNSPLASH_QUERIES[category as keyof typeof UNSPLASH_QUERIES]?.replace(' ', ',')}&sig=${Date.now()}`;
    const item: VisionBoardItem = {
      id: generateId(), title: title.trim(), description: description.trim(),
      imageUrl: url, category, createdAt: new Date().toISOString()
    };
    setItems(prev => [item, ...prev]);
    setTitle(''); setDescription(''); setImageUrl(''); setShowForm(false);
  };

  const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const filtered = items.filter(i => filterCat === 'All' ? true : i.category === filterCat);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Vision Board</h2>
          <p className="section-subtitle">Visualize your dreams and aspirations</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Vision
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={cn('chip', filterCat === c ? 'chip-active' : 'chip-inactive')}>{c}</button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Vision</h3>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input className="input-glass" placeholder="Title (e.g. Dream home in Bali)" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="input-glass resize-none" placeholder="Describe your vision..." rows={2} value={description} onChange={e => setDescription(e.target.value)} />
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select className="input-glass" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Image URL (optional)</label>
              <input className="input-glass" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <button onClick={addItem} className="btn-primary w-full">Add to Vision Board</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Image size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Your vision board is empty</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add images and goals to visualize your dreams</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map(item => (
            <div key={item.id} className="glass-card overflow-hidden group">
              <div className="relative h-48">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&h=400&fit=crop&q=80`; }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteItem(item.id)} className="w-8 h-8 bg-red-500/80 rounded-lg flex items-center justify-center text-white">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="tag text-xs mb-1 inline-block">{item.category}</span>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                </div>
              </div>
              {item.description && (
                <div className="p-3">
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
