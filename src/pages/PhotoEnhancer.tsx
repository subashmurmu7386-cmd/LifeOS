import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESETS = [
  { name: 'Auto Enhance', f: 'brightness(1.1) contrast(1.15) saturate(1.3)' },
  { name: 'Vivid', f: 'brightness(1.05) contrast(1.2) saturate(1.6)' },
  { name: 'Warm', f: 'brightness(1.1) sepia(0.2) saturate(1.4)' },
  { name: 'Cool', f: 'brightness(1.05) contrast(1.1) hue-rotate(15deg)' },
  { name: 'HDR', f: 'contrast(1.4) saturate(1.5) brightness(1.1)' },
  { name: 'Vintage', f: 'sepia(0.4) contrast(1.1) brightness(0.95)' },
  { name: 'B&W', f: 'grayscale(1) contrast(1.2)' },
  { name: 'Sharp', f: 'contrast(1.3) saturate(1.2) brightness(1.05)' },
];

export default function PhotoEnhancer() {
  const [image, setImage] = useState('');
  const [filter, setFilter] = useState('');
  const [active, setActive] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImage(ev.target?.result as string); setFilter(''); setActive(''); };
    reader.readAsDataURL(file);
  };

  const download = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = `enhanced-${Date.now()}.jpg`;
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">Photo Enhancer</h2><p className="section-subtitle">Instantly improve photo quality with professional-grade presets</p></div>
      {!image ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <Zap size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Photo to Enhance</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP supported</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-3">
            <img ref={imgRef} src={image} alt="Enhanced" className="w-full rounded-xl object-contain max-h-[380px]" style={{ filter }} />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Enhancement Presets</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => { setFilter(p.f); setActive(p.name); }} className={cn('text-xs py-2.5 px-2 rounded-xl font-medium transition-all', active === p.name ? 'bg-brand-600 text-white' : 'hover:bg-white/5')} style={active !== p.name ? { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' } : {}}>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFilter(''); setActive(''); }} className="btn-ghost text-sm flex items-center gap-1"><RotateCcw size={13} /> Reset</button>
              <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Photo</button>
              <button onClick={download} disabled={!filter} className="btn-primary text-sm flex items-center gap-2 ml-auto"><Download size={14} /> Save Enhanced</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
