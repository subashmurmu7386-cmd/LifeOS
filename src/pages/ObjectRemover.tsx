import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Eraser, RotateCcw } from 'lucide-react';

export default function ObjectRemover() {
  const [image, setImage] = useState('');
  const [brushSize, setBrushSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const origData = useRef<ImageData | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      const maxW = 600;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      origData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = image;
  }, [image]);

  const paint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = data.data;
    const r = brushSize;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const tx = Math.round(x + dx), ty = Math.round(y + dy);
        if (tx < 0 || tx >= canvas.width || ty < 0 || ty >= canvas.height) continue;
        // Sample adjacent region (content-aware fill approximation)
        const srcX = Math.min(Math.max(Math.round(x + dx + r * 2), 0), canvas.width - 1);
        const srcY = Math.min(Math.max(Math.round(y + dy), 0), canvas.height - 1);
        const ti = (ty * canvas.width + tx) * 4;
        const si = (srcY * canvas.width + srcX) * 4;
        d[ti] = d[si]; d[ti+1] = d[si+1]; d[ti+2] = d[si+2];
      }
    }
    ctx.putImageData(data, 0, 0);
  };

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas || !origData.current) return;
    canvas.getContext('2d')!.putImageData(origData.current, 0, 0);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `object-removed-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Object Remover</h2><p className="section-subtitle">Paint over objects to erase them from your images</p></div>
      {!image ? (
        <div className="glass-card p-12 text-center cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => fileRef.current?.click()}>
          <Eraser size={40} className="mx-auto mb-3 text-brand-400" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Upload Image</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Paint over unwanted objects to remove them</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-3 flex justify-center overflow-auto">
            <canvas ref={canvasRef} className="rounded-xl cursor-crosshair max-w-full" style={{ border: '2px solid var(--glass-border)' }}
              onMouseDown={() => { drawing.current = true; }}
              onMouseUp={() => { drawing.current = false; }}
              onMouseLeave={() => { drawing.current = false; }}
              onMouseMove={paint}
            />
          </div>
          <div className="glass-card p-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}><span>Brush Size</span><span>{brushSize}px</span></div>
              <input type="range" min={5} max={60} value={brushSize} onChange={e => setBrushSize(+e.target.value)} className="w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={reset} className="btn-ghost text-sm flex items-center gap-1"><RotateCcw size={13} /> Reset</button>
              <button onClick={() => { setImage(''); }} className="btn-ghost text-sm" style={{ border: '1px solid var(--glass-border)' }}>New Image</button>
              <button onClick={download} className="btn-primary text-sm flex items-center gap-2 ml-auto"><Download size={14} /> Save</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}
