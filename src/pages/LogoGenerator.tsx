import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

const FONTS = ['Impact', 'Arial Black', 'Georgia', 'Courier New', 'Verdana'];
const GRADIENTS: [string, string][] = [
  ['#7c3aed', '#4f46e5'], ['#dc2626', '#f59e0b'], ['#059669', '#0891b2'],
  ['#db2777', '#7c3aed'], ['#1d4ed8', '#0891b2'], ['#111827', '#374151'],
];

export default function LogoGenerator() {
  const [company, setCompany] = useState('');
  const [tagline, setTagline] = useState('');
  const [font, setFont] = useState('Impact');
  const [grad, setGrad] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 600; canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    const bg = ctx.createLinearGradient(0, 0, 600, 200);
    bg.addColorStop(0, '#0f0a1e'); bg.addColorStop(1, '#1a0533');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 600, 200);
    // Icon circle
    const ig = ctx.createLinearGradient(55, 35, 145, 165);
    ig.addColorStop(0, GRADIENTS[grad][0]); ig.addColorStop(1, GRADIENTS[grad][1]);
    ctx.beginPath(); ctx.arc(100, 100, 58, 0, Math.PI * 2);
    ctx.fillStyle = ig; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `bold 56px ${font}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText((company.charAt(0) || 'L').toUpperCase(), 100, 102);
    // Name
    ctx.font = `bold 46px ${font}`; ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(company || 'Your Brand', 172, tagline ? 82 : 102);
    if (tagline) {
      ctx.font = `18px Arial`; ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText(tagline, 174, 120);
    }
    // Subtle line accent
    const lg = ctx.createLinearGradient(172, 0, 580, 0);
    lg.addColorStop(0, GRADIENTS[grad][0] + '66'); lg.addColorStop(1, 'transparent');
    ctx.fillStyle = lg; ctx.fillRect(172, tagline ? 135 : 115, 380, 2);
  };

  useEffect(() => { draw(); }, [company, tagline, font, grad]);

  const download = () => {
    draw();
    const a = document.createElement('a');
    a.download = `${company || 'logo'}-${Date.now()}.png`;
    a.href = canvasRef.current!.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">AI Logo Generator</h2><p className="section-subtitle">Create professional logos for your brand in seconds</p></div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-5 space-y-4">
          <input className="input-glass" placeholder="Company / Brand Name" value={company} onChange={e => setCompany(e.target.value)} />
          <input className="input-glass" placeholder="Tagline (optional)" value={tagline} onChange={e => setTagline(e.target.value)} />
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-muted)' }}>Font Style</label>
            <select className="input-glass" value={font} onChange={e => setFont(e.target.value)}>
              {FONTS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Color Theme</label>
            <div className="flex gap-2">
              {GRADIENTS.map((g, i) => (
                <button key={i} onClick={() => setGrad(i)} className="w-9 h-9 rounded-lg transition-all" style={{ background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`, outline: grad === i ? '2px solid white' : 'none', outlineOffset: '2px', transform: grad === i ? 'scale(1.15)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <button onClick={download} className="btn-primary w-full flex items-center justify-center gap-2"><Download size={14} /> Download PNG</button>
        </div>
        <div className="glass-card p-4 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full rounded-xl" style={{ border: '1px solid var(--glass-border)', maxWidth: 500 }} />
        </div>
      </div>
    </div>
  );
}
