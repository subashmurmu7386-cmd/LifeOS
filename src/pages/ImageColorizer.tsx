import { useState, useRef } from 'react';
import { Upload, Download, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCHEMES = [
  { name: 'Warm Sepia', f: 'sepia(0.7) saturate(1.4) brightness(1.05)' },
  { name: 'Vintage', f: 'sepia(0.5) hue-rotate(-10deg) saturate(1.3) contrast(1.1)' },
  { name: 'Cool Blue', f: 'sepia(0.3) hue-rotate(200deg) saturate(1.5) brightness(1.1)' },
  { name: 'Sunset', f: 'sepia(0.4) hue-rotate(330deg) saturate(1.8) brightness(1.05)' },
  { name: 'Forest', f: 'sepia(0.3) hue-rotate(90deg) saturate(1.6)' },
  { name: 'Purple Haze', f: 'sepia(0.3) hue-rotate(250deg) saturate(1.5) brightness(1.1)' },
  { name: 'Golden Hour', f: 'sepia(0.6) saturate(1.8) brightness(1.1) contrast(1.1)' },
  { name: 'Neon', f: 'hue-rotate(180deg) saturate(2) contrast(1.2) brightness(1.1)' },
];

export default function ImageColorizer() {
  const [image, setImage] = useState('');
  const [scheme, setScheme] = useState('');
  const [active, setActive] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImage(ev.target?.result as string); setScheme(''); setActive(''); };
    reader.readAsDataURL(file);
  };

  const download = () => {
    const img = imgRef.current;
    if (!img || !scheme) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = scheme;
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = `colorized-${Date.now()}.jpg`;
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Image Colorizer</h2><p className="section-subtitle">Add beautiful color palettes to black & white or faded photos</p></div>
      {!image ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <Palette size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Photo to Colorize</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Best with black & white or monochrome images</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-3">
            <img ref={imgRef} src={image} alt="Colorize" className="w-full rounded-xl object-contain max-h-[360px]" style={{ filter: scheme || 'grayscale(0.8)' }} />
          </div>
          <div className="glass-card p-4">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Color Schemes</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {SCHEMES.map(s => (
                <button key={s.name} onClick={() => { setScheme(s.f); setActive(s.name); }} className={cn('text-xs py-2.5 px-2 rounded-xl font-medium transition-all text-center', active === s.name ? 'bg-brand-600 text-white' : '')} style={active !== s.name ? { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' } : {}}>
                  {s.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Photo</button>
              <button onClick={download} disabled={!scheme} className="btn-primary text-sm flex items-center gap-2 ml-auto"><Download size={14} /> Save Colorized</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
