import { useState, useRef } from 'react';
import { Upload, Download, ZoomIn } from 'lucide-react';

export default function ImageUpscaler() {
  const [image, setImage] = useState('');
  const [result, setResult] = useState('');
  const [scale, setScale] = useState(2);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setImage(src); setResult('');
      const img = new Image();
      img.onload = () => setDims({ w: img.width, h: img.height });
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const upscale = () => {
    if (!image) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResult(canvas.toDataURL('image/jpeg', 0.95));
      setProcessing(false);
    };
    img.src = image;
  };

  const download = () => { const a = document.createElement('a'); a.href = result; a.download = `upscaled-${scale}x-${Date.now()}.jpg`; a.click(); };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">Image Upscaler</h2><p className="section-subtitle">Increase image resolution and quality up to 4×</p></div>
      {!image ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <ZoomIn size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Image to Upscale</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All image formats supported</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Original ({dims.w}×{dims.h}px)</p><div className="glass-card p-2"><img src={image} className="w-full rounded-lg object-contain max-h-[240px]" /></div></div>
            {result && <div><p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Upscaled ({dims.w*scale}×{dims.h*scale}px)</p><div className="glass-card p-2"><img src={result} className="w-full rounded-lg object-contain max-h-[240px]" /></div></div>}
          </div>
          <div className="glass-card p-4 space-y-3">
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scale Factor</p>
            <div className="flex gap-2">
              {[2, 3, 4].map(s => (
                <button key={s} onClick={() => setScale(s)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={scale === s ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff' } : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                  {s}× · {dims.w*s}×{dims.h*s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Image</button>
              <button onClick={upscale} disabled={processing} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"><ZoomIn size={14} />{processing ? 'Upscaling…' : `Upscale ${scale}×`}</button>
              {result && <button onClick={download} className="btn-primary text-sm px-3 flex items-center gap-1"><Download size={14} /></button>}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
