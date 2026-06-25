import { useState, useRef } from 'react';
import { Upload, Download, Scissors, Info } from 'lucide-react';

export default function BackgroundRemover() {
  const [original, setOriginal] = useState('');
  const [result, setResult] = useState('');
  const [processing, setProcessing] = useState(false);
  const [threshold, setThreshold] = useState(30);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setOriginal(ev.target?.result as string); setResult(''); };
    reader.readAsDataURL(file);
  };

  const removeBackground = () => {
    if (!original) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = data.data;
      // Sample multiple corners for bg color
      const corners = [[0,0],[1,0],[0,1]] as const;
      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(([cx,cy]) => { const i = (cy * canvas.width + cx) * 4; bgR += d[i]; bgG += d[i+1]; bgB += d[i+2]; });
      bgR = Math.round(bgR / corners.length); bgG = Math.round(bgG / corners.length); bgB = Math.round(bgB / corners.length);
      for (let i = 0; i < d.length; i += 4) {
        const dist = Math.abs(d[i]-bgR) + Math.abs(d[i+1]-bgG) + Math.abs(d[i+2]-bgB);
        if (dist < threshold * 3) d[i+3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      setResult(canvas.toDataURL('image/png'));
      setProcessing(false);
    };
    img.src = original;
  };

  const download = () => { const a = document.createElement('a'); a.href = result; a.download = `no-bg-${Date.now()}.png`; a.click(); };
  const checker = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="16" height="16" fill="%23ccc"/%3E%3Crect x="8" width="8" height="8" fill="%23aaa"/%3E%3Crect y="8" width="8" height="8" fill="%23aaa"/%3E%3C/svg%3E';

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">Background Remover</h2><p className="section-subtitle">Remove image backgrounds automatically with one click</p></div>
      {!original ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <Scissors size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Image</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Best results with solid-color backgrounds</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Original</p><div className="glass-card p-2"><img src={original} className="w-full rounded-lg object-contain max-h-[260px]" /></div></div>
            {result && (
              <div><p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Result (transparent)</p>
                <div className="glass-card p-2 rounded-xl" style={{ backgroundImage: `url("${checker}")`, backgroundSize: '16px 16px' }}>
                  <img src={result} className="w-full rounded-lg object-contain max-h-[260px]" />
                </div>
              </div>
            )}
          </div>
          <div className="glass-card p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}><span>Detection Sensitivity</span><span>{threshold}</span></div>
              <input type="range" min={5} max={80} value={threshold} onChange={e => setThreshold(+e.target.value)} className="w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setOriginal(''); setResult(''); }} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Image</button>
              <button onClick={removeBackground} disabled={processing} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"><Scissors size={14} />{processing ? 'Processing…' : 'Remove Background'}</button>
              {result && <button onClick={download} className="btn-primary text-sm px-3 flex items-center gap-1"><Download size={14} /></button>}
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
            <Info size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Adjust sensitivity for best results. Higher = more aggressive removal. Works best with white/solid backgrounds.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
