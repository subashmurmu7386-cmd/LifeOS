import { useState, useRef } from 'react';
import { Upload, Download, User, Sparkles } from 'lucide-react';

const RESTORE_MODES = [
  { name: 'Restore & Sharpen', f: 'contrast(1.15) brightness(1.08) saturate(1.1)' },
  { name: 'Denoise', f: 'contrast(1.1) brightness(1.05) blur(0.3px) saturate(1.05)' },
  { name: 'Color Fix', f: 'contrast(1.1) saturate(1.3) brightness(1.05)' },
  { name: 'Portrait Glow', f: 'brightness(1.12) contrast(1.08) saturate(1.15)' },
];

export default function FaceRestoration() {
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
    ctx.filter = filter || 'none';
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = `restored-${Date.now()}.jpg`;
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Face Restoration</h2><p className="section-subtitle">Restore, sharpen, and enhance portrait photos and old images</p></div>
      {!image ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <User size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Portrait Photo</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ideal for old, blurry, or faded photos</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-3 flex justify-center">
            <div className="relative inline-block">
              <img ref={imgRef} src={image} alt="Restore" className="max-w-full max-h-[380px] rounded-xl object-contain" style={{ filter: filter || 'none' }} />
              {active && <div className="absolute top-3 left-3"><span className="badge bg-brand-600 text-white text-xs px-2 py-1 rounded-full">✨ {active}</span></div>}
            </div>
          </div>
          <div className="glass-card p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Restoration Modes</p>
            <div className="grid grid-cols-2 gap-2">
              {RESTORE_MODES.map(m => (
                <button key={m.name} onClick={() => { setFilter(m.f); setActive(m.name); }} className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2" style={active === m.name ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff' } : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                  <Sparkles size={13} /> {m.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFilter(''); setActive(''); }} className="btn-ghost text-sm">Reset</button>
              <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Photo</button>
              {filter && <button onClick={download} className="btn-primary text-sm flex items-center gap-2 ml-auto"><Download size={14} /> Save</button>}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
