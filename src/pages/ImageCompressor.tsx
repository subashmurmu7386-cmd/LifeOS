import { useState, useRef } from 'react';
import { Upload, Download, Minimize2 } from 'lucide-react';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [original, setOriginal] = useState('');
  const [result, setResult] = useState('');
  const [quality, setQuality] = useState(75);
  const [origSize, setOrigSize] = useState(0);
  const [compSize, setCompSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrigSize(file.size);
    setResult(''); setCompSize(0);
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setOriginal(src);
      const img = new Image();
      img.onload = () => setDims({ w: img.width, h: img.height });
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!original) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      setResult(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setCompSize(Math.round((base64.length * 3) / 4));
      setProcessing(false);
    };
    img.src = original;
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = result;
    a.download = `compressed-q${quality}-${Date.now()}.jpg`;
    a.click();
  };

  const saved = origSize > 0 && compSize > 0 ? Math.round((1 - compSize / origSize) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">Image Compressor</h2><p className="section-subtitle">Reduce image file size without visible quality loss</p></div>
      {!original ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <Minimize2 size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Image to Compress</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WebP — all formats supported</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Original</p>
                <span className="text-xs font-semibold text-red-400">{formatBytes(origSize)}</span>
              </div>
              <div className="glass-card p-2"><img src={original} className="w-full rounded-lg object-contain max-h-[220px]" /></div>
            </div>
            {result && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Compressed</p>
                  <span className="text-xs font-semibold text-green-400">{formatBytes(compSize)}</span>
                </div>
                <div className="glass-card p-2"><img src={result} className="w-full rounded-lg object-contain max-h-[220px]" /></div>
              </div>
            )}
          </div>
          {saved > 0 && (
            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="font-bold text-green-400 text-lg">🎉 Saved {saved}%</p>
              <p className="text-xs text-green-300">{formatBytes(origSize)} → {formatBytes(compSize)} · {dims.w}×{dims.h}px</p>
            </div>
          )}
          <div className="glass-card p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}><span>Quality</span><span className="font-semibold">{quality}% {quality > 85 ? '(High)' : quality > 60 ? '(Medium)' : '(Low)'}</span></div>
              <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Image</button>
              <button onClick={compress} disabled={processing} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"><Minimize2 size={14} />{processing ? 'Compressing…' : 'Compress Now'}</button>
              {result && <button onClick={download} className="btn-primary text-sm px-3 flex items-center gap-1"><Download size={14} /></button>}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
