import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

const SIZES = [
  { name: 'Instagram 1:1', w: 1080, h: 1080 },
  { name: 'Story 9:16', w: 1080, h: 1920 },
  { name: 'Twitter 16:9', w: 1200, h: 675 },
  { name: 'A4 Portrait', w: 794, h: 1123 },
];
const THEMES: [string, string][] = [
  ['#7c3aed', '#4f46e5'], ['#dc2626', '#f59e0b'], ['#059669', '#0891b2'],
  ['#1d4ed8', '#7c3aed'], ['#111827', '#7c3aed'], ['#db2777', '#f59e0b'],
];

export default function PosterMaker() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [footer, setFooter] = useState('');
  const [theme, setTheme] = useState(0);
  const [size, setSize] = useState(SIZES[0]);
  const prevRef = useRef<HTMLCanvasElement>(null);
  const fullRef = useRef<HTMLCanvasElement>(null);

  const renderTo = (canvas: HTMLCanvasElement, W: number, H: number) => {
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, THEMES[theme][0]); g.addColorStop(1, THEMES[theme][1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.07;
    for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.globalAlpha = 1;
    const fs = Math.min(W / 9, 100);
    if (title) {
      ctx.fillStyle = '#fff'; ctx.font = `bold ${fs}px Impact`;
      ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 12;
      ctx.fillText(title.toUpperCase(), W / 2, H * 0.44);
      ctx.shadowBlur = 0;
    }
    if (subtitle) {
      ctx.font = `${Math.min(W / 22, 42)}px Arial`; ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fillText(subtitle, W / 2, H * 0.56);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W*0.2, H*0.38); ctx.lineTo(W*0.8, H*0.38); ctx.stroke();
    if (footer) {
      ctx.font = `${Math.min(W / 36, 28)}px Arial`; ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillText(footer, W / 2, H * 0.92);
    }
  };

  useEffect(() => {
    if (!prevRef.current) return;
    const aspect = size.h / size.w;
    prevRef.current.width = 380; prevRef.current.height = Math.round(380 * aspect);
    const tmp = document.createElement('canvas');
    renderTo(tmp, size.w, size.h);
    prevRef.current.getContext('2d')!.drawImage(tmp, 0, 0, prevRef.current.width, prevRef.current.height);
  }, [title, subtitle, footer, theme, size]);

  const download = () => {
    renderTo(fullRef.current!, size.w, size.h);
    const a = document.createElement('a');
    a.download = `poster-${Date.now()}.png`;
    a.href = fullRef.current!.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Poster Maker</h2><p className="section-subtitle">Design stunning social media posters for any platform</p></div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-5 space-y-4">
          <input className="input-glass" placeholder="Title (e.g. SUMMER SALE 50% OFF)" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="input-glass" placeholder="Subtitle (optional)" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          <input className="input-glass" placeholder="Footer (e.g. @yourbrand · website.com)" value={footer} onChange={e => setFooter(e.target.value)} />
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-muted)' }}>Format</label>
            <select className="input-glass" value={size.name} onChange={e => setSize(SIZES.find(s => s.name === e.target.value) || SIZES[0])}>
              {SIZES.map(s => <option key={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Theme</label>
            <div className="flex gap-2">{THEMES.map((t, i) => <button key={i} onClick={() => setTheme(i)} className="w-10 h-10 rounded-lg transition-all" style={{ background: `linear-gradient(135deg,${t[0]},${t[1]})`, outline: theme===i?'2px solid white':'none', outlineOffset:'2px', transform: theme===i?'scale(1.1)':'scale(1)' }} />)}</div>
          </div>
          <button onClick={download} className="btn-primary w-full flex items-center justify-center gap-2"><Download size={14} /> Download Poster</button>
        </div>
        <div className="glass-card p-4 flex items-center justify-center">
          <canvas ref={prevRef} className="rounded-xl max-w-full max-h-[400px]" style={{ border: '1px solid var(--glass-border)' }} />
          <canvas ref={fullRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
