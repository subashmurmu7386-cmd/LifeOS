import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Sliders } from 'lucide-react';

interface Filters { brightness: number; contrast: number; saturate: number; blur: number; hueRotate: number; }
const DEF: Filters = { brightness: 100, contrast: 100, saturate: 100, blur: 0, hueRotate: 0 };
const SLIDERS = [
  { key: 'brightness' as const, label: 'Brightness', min: 0, max: 200 },
  { key: 'contrast' as const, label: 'Contrast', min: 0, max: 200 },
  { key: 'saturate' as const, label: 'Saturation', min: 0, max: 300 },
  { key: 'hueRotate' as const, label: 'Hue Rotate', min: 0, max: 360 },
  { key: 'blur' as const, label: 'Blur', min: 0, max: 10 },
];

export default function AIImageEditor() {
  const [image, setImage] = useState('');
  const [f, setF] = useState<Filters>(DEF);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImage(ev.target?.result as string); setF(DEF); };
    reader.readAsDataURL(file);
  };

  const filterStr = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) hue-rotate(${f.hueRotate}deg)`;

  const download = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = filterStr;
    ctx.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.download = `edited-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Image Editor</h2><p className="section-subtitle">Edit and enhance images with professional filters</p></div>
      {!image ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <Upload size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload an Image</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP supported</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass-card p-3 flex items-center justify-center">
            <img ref={imgRef} src={image} alt="Edit" className="w-full rounded-xl object-contain max-h-[400px]" style={{ filter: filterStr }} />
          </div>
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}><Sliders size={15} /> Adjustments</h3>
              <button onClick={() => setF(DEF)} className="btn-ghost text-xs flex items-center gap-1 py-1 px-2"><RotateCcw size={12} /> Reset</button>
            </div>
            {SLIDERS.map(s => (
              <div key={s.key}>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}><span>{s.label}</span><span className="font-mono">{f[s.key]}</span></div>
                <input type="range" min={s.min} max={s.max} value={f[s.key]} onChange={e => setF(p => ({ ...p, [s.key]: +e.target.value }))} className="w-full" />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setImage(''); setF(DEF); fileRef.current?.click(); }} className="btn-ghost text-sm flex-1" style={{ border: '1px solid var(--glass-border)' }}>New Image</button>
              <button onClick={download} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"><Download size={14} /> Save</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
