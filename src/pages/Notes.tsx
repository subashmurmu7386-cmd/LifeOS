import { useState } from 'react';
import { Plus, Search, Trash2, Pin, X, Tag } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Note } from '@/types';

const NOTE_COLORS = ['#7c3aed', '#3b82f6', '#22c55e', '#f97316', '#ef4444', '#ec4899', '#14b8a6', '#f59e0b', 'default'];

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('lifeos-notes', []);
  const [search, setSearch] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('default');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState('');

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const saveNote = () => {
    if (!title.trim() && !content.trim()) return;
    if (activeNote) {
      setNotes(prev => prev.map(n => n.id === activeNote.id ? {
        ...n, title, content, color, tags, updatedAt: new Date().toISOString()
      } : n));
    } else {
      const note: Note = {
        id: generateId(), title: title.trim(), content, color, tags,
        pinned: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      };
      setNotes(prev => [note, ...prev]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false); setActiveNote(null);
    setTitle(''); setContent(''); setColor('default'); setTags([]);
  };

  const openNote = (note: Note) => {
    setActiveNote(note); setTitle(note.title); setContent(note.content);
    setColor(note.color); setTags(note.tags); setShowForm(true);
  };

  const togglePin = (id: string) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const deleteNote = (id: string) => { setNotes(prev => prev.filter(n => n.id !== id)); if (activeNote?.id === id) resetForm(); };
  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags(prev => [...prev, tagInput.trim()]); setTagInput(''); } };

  const filtered = notes
    .filter(n => {
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    })
    .filter(n => filterTag ? n.tags.includes(filterTag) : true)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const getNoteStyle = (c: string) => c === 'default'
    ? { background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }
    : { background: `${c}15`, borderColor: `${c}30` };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Search & add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-glass pl-9" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Note
        </button>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterTag('')} className={cn('chip', !filterTag ? 'chip-active' : 'chip-inactive')}>All</button>
          {allTags.map(t => (
            <button key={t} onClick={() => setFilterTag(t === filterTag ? '' : t)} className={cn('chip', filterTag === t ? 'chip-active' : 'chip-inactive')}>
              <Tag size={10} /> {t}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{activeNote ? 'Edit Note' : 'New Note'}</h3>
            <button onClick={resetForm} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input className="input-glass text-base font-semibold" placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} />
            <textarea
              className="input-glass resize-none min-h-[160px]"
              placeholder="Write your thoughts..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {NOTE_COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={cn('w-7 h-7 rounded-full border-2 transition-all',
                      color === c ? 'border-white scale-110' : 'border-transparent',
                      c === 'default' && 'border-gray-400'
                    )}
                    style={{ background: c === 'default' ? 'var(--glass-bg)' : c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex gap-2 mb-2">
                <input className="input-glass flex-1" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
                <button onClick={addTag} className="btn-primary px-3"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span key={t} className="tag flex items-center gap-1">
                    {t} <button onClick={() => setTags(tags.filter(tg => tg !== t))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveNote} className="btn-primary flex-1">Save Note</button>
              {activeNote && (
                <button onClick={() => deleteNote(activeNote.id)} className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all text-sm font-medium">
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
        {filtered.length === 0 && (
          <div className="col-span-full glass-card p-10 text-center">
            <p className="text-4xl mb-2">📝</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No notes yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start capturing your thoughts</p>
          </div>
        )}
        {filtered.map(note => (
          <div
            key={note.id}
            className="glass-card p-4 cursor-pointer group"
            style={getNoteStyle(note.color)}
            onClick={() => openNote(note)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                {note.title || 'Untitled'}
              </h4>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button onClick={() => togglePin(note.id)} className={cn('p-1 rounded-lg transition-all', note.pinned ? 'text-brand-400' : 'btn-ghost')}>
                  <Pin size={13} />
                </button>
                <button onClick={() => deleteNote(note.id)} className="btn-ghost p-1 text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <p className="text-xs line-clamp-3 mb-3" style={{ color: 'var(--text-secondary)' }}>
              {note.content || 'Empty note...'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map(t => <span key={t} className="tag text-xs">{t}</span>)}
                {note.tags.length > 2 && <span className="tag">+{note.tags.length - 2}</span>}
              </div>
              {note.pinned && <Pin size={11} className="text-brand-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
