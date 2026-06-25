import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

const BGS = ['#0f0a1e', '#1e1b4b', '#1a0533', '#0c1a2e', '#1a0a0a', '#0a1a0a'];
const ACCENTS = ['#7c3aed', '#dc2626', '#f59e0b', '#059669', '#3b82f6', '#ec4899'];

export default function ThumbnailCreator() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [emoji, setEmoji] = useState('🔥');
  const [bg, setBg] = useState(BGS[0]);
  const [accent, setAccent] = useState(ACCENTS[0]);
  const prevRef = useRef<HTMLCanvasElement>(null);
  const fullRef = useRef<HTMLCanvasElement>(null);

  const renderTo = (canvas: HTMLCanvasElement, W: number, H: number) => {
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = accent; ctx.fillRect(0, 0, 14, H);
    const gr = ctx.createLinearGradient(W*0.4, 0, W, 0);
    gr.addColorStop(0, 'transparent'); gr.addColorStop(1, accent + '44');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    if (emoji) {
      ctx.font = `${Math.min(W/5, 180)}px serif`; ctx.textAlign = 'right';
      ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff';
      ctx.textBaseline = 'bottom'; ctx.fillText(emoji, W - 20, H - 10);
      ctx.globalAlpha = 1; ctx.font = `${Math.min(W/10, 90)}px serif`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(emoji, 30, 30);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
    const tfs = Math.min(W / 12, 88);
    ctx.font = `bold ${tfs}px Impact`;
    ctx.shadowColor = accent; ctx.shadowBlur = 20;
    const words = (title || 'YOUR TITLE HERE').toUpperCase().split(' ');
    let line = '', lines: string[] = [];
    words.forEach(w => {
      const t = line + (line ? ' ' : '') + w;
      if (ctx.measureText(t).width > W * 0.7 && line) { lines.push(line); line = w; }
      else line = t;
    });
    if (line) lines.push(line);
    lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 30, H * 0.45 + i * (tfs + 8)));
    ctx.shadowBlur = 0;
    if (subtitle) {
      ctx.font = `${Math.min(W/24, 36)}px Arial`; ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(subtitle, 30, H * 0.78);
    }
  };

  useEffect(() => {
    if (!prevRef.current) return;
    prevRef.current.width = 640; prevRef.current.height = 360;
    const tmp = document.createElement('canvas');
    renderTo(tmp, 1280, 720);
    prevRef.current.getContext('2d')!.drawImage(tmp, 0, 0, 640, 360);
  }, [title, subtitle, emoji, bg, accent]);

  const download = () => {
    renderTo(fullRef.current!, 1280, 720);
    const a = document.createElement('a');
    a.download = `thumbnail-${Date.now()}.png`;
    a.href = fullRef.current!.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Thumbnail Creator</h2><p className="section-subtitle">Design eye-catching YouTube thumbnails at 1280×720 resolution</p></div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-5 space-y-4">
          <input className="input-glass" placeholder="Main Title (e.g. TOP 10 SECRETS)" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="input-glass" placeholder="Subtitle (optional)" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          <input className="input-glass" placeholder="Emoji (1-2 chars)" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} />
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Background</label>
            <div className="flex gap-2 flex-wrap">{BGS.map(c => <button key={c} onClick={() => setBg(c)} className="w-9 h-9 rounded-lg" style={{ background: c, outline: bg===c?'2px solid rgba(255,255,255,0.7)':'none', outlineOffset:'2px' }} />)}</div>
          </div>
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Accent Color</label>
            <div className="flex gap-2 flex-wrap">{ACCENTS.map(c => <button key={c} onClick={() => setAccent(c)} className="w-9 h-9 rounded-lg" style={{ background: c, outline: accent===c?'2px solid rgba(255,255,255,0.7)':'none', outlineOffset:'2px' }} />)}</div>
          </div>
          <button onClick={download} className="btn-primary w-full flex items-center justify-center gap-2"><Download size={14} /> Download 1280×720</button>
        </div>
        <div className="glass-card p-4 flex items-center justify-center">
          <canvas ref={prevRef} className="w-full rounded-xl" style={{ border: '1px solid var(--glass-border)' }} />
          <canvas ref={fullRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
