import { useState } from 'react';
import { Plus, Trash2, X, Star, BookMarked } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ReadingBook } from '@/types';

const STATUS_COLORS = {
  'to-read': 'text-blue-400 bg-blue-400/10',
  'reading': 'text-brand-400 bg-brand-400/10',
  'completed': 'text-green-400 bg-green-400/10',
};
const STATUS_LABELS = { 'to-read': 'To Read', 'reading': 'Reading', 'completed': 'Completed' };

export default function Reading() {
  const [books, setBooks] = useLocalStorage<ReadingBook[]>('lifeos-books', []);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | ReadingBook['status']>('all');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [notes, setNotes] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const saveBook = () => {
    if (!title.trim()) return;
    if (editId) {
      setBooks(prev => prev.map(b => b.id === editId ? { ...b, title, author, totalPages: Number(totalPages), notes } : b));
      setEditId(null);
    } else {
      const book: ReadingBook = {
        id: generateId(), title: title.trim(), author: author.trim(),
        totalPages: Number(totalPages) || 0, currentPage: 0,
        status: 'to-read', notes: notes.trim(),
      };
      setBooks(prev => [book, ...prev]);
    }
    setTitle(''); setAuthor(''); setTotalPages(''); setNotes(''); setShowForm(false);
  };

  const updatePage = (id: string, page: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== id) return b;
      const completed = b.totalPages > 0 && page >= b.totalPages;
      return {
        ...b, currentPage: Math.min(page, b.totalPages),
        status: completed ? 'completed' : page > 0 ? 'reading' : b.status,
        completedDate: completed ? new Date().toISOString().split('T')[0] : b.completedDate,
      };
    }));
  };

  const rateBook = (id: string, rating: number) => setBooks(prev => prev.map(b => b.id === id ? { ...b, rating } : b));
  const deleteBook = (id: string) => setBooks(prev => prev.filter(b => b.id !== id));

  const filtered = books.filter(b => filter === 'all' ? true : b.status === filter);
  const stats = { total: books.length, reading: books.filter(b => b.status === 'reading').length, completed: books.filter(b => b.status === 'completed').length, pages: books.reduce((a, b) => a + b.currentPage, 0) };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Books', value: stats.total, color: 'text-brand-400' },
          { label: 'Reading', value: stats.reading, color: 'text-blue-400' },
          { label: 'Completed', value: stats.completed, color: 'text-green-400' },
          { label: 'Pages Read', value: stats.pages, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn('font-bold text-xl', s.color)}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'to-read', 'reading', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('chip', filter === f ? 'chip-active' : 'chip-inactive')}>
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Book
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{editId ? 'Edit Book' : 'Add Book'}</h3>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="btn-ghost p-1.5"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input className="input-glass" placeholder="Book title" value={title} onChange={e => setTitle(e.target.value)} />
            <input className="input-glass" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
            <input type="number" className="input-glass" placeholder="Total pages" value={totalPages} onChange={e => setTotalPages(e.target.value)} min="1" />
            <textarea className="input-glass resize-none" placeholder="Notes..." rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
            <button onClick={saveBook} className="btn-primary w-full">Save Book</button>
          </div>
        </div>
      )}

      <div className="space-y-3 stagger">
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center">
            <BookMarked size={36} className="mx-auto mb-3 text-brand-400" />
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No books yet</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start your reading journey</p>
          </div>
        )}
        {filtered.map(book => {
          const pct = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
          return (
            <div key={book.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{book.title}</h3>
                  {book.author && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{book.author}</p>}
                  {book.status === 'completed' && (
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => rateBook(book.id, star)}>
                          <Star size={14} fill={book.rating && star <= book.rating ? '#f59e0b' : 'none'} className={book.rating && star <= book.rating ? 'text-yellow-400' : 'text-gray-400'} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('badge text-xs', STATUS_COLORS[book.status])}>{STATUS_LABELS[book.status]}</span>
                  <button onClick={() => deleteBook(book.id)} className="btn-ghost p-1 text-red-400"><Trash2 size={13} /></button>
                </div>
              </div>

              {book.totalPages > 0 && (
                <>
                  <div className="flex items-center justify-between mb-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Page {book.currentPage} / {book.totalPages}</span>
                    <span className="font-semibold text-brand-400">{pct}%</span>
                  </div>
                  <div className="progress-bar mb-3">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  {book.status !== 'completed' && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="input-glass flex-1 text-sm"
                        placeholder="Current page"
                        defaultValue={book.currentPage}
                        onBlur={e => updatePage(book.id, Number(e.target.value))}
                        min="0"
                        max={book.totalPages}
                      />
                    </div>
                  )}
                </>
              )}

              {book.notes && <p className="text-xs mt-2 italic" style={{ color: 'var(--text-secondary)' }}>📝 {book.notes}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
