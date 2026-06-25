import { useState } from 'react';
import { Download, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

const FG_COLORS = ['000000', '7c3aed', '1d4ed8', 'dc2626', '059669', 'f59e0b', 'db2777', '111827'];
const BG_COLORS = ['ffffff', '0f0a1e', '1e1b4b', 'f0ebff', 'fef9c3', 'f0fdf4'];
const SIZES = [200, 300, 400, 600];

export default function QRDesigner() {
  const [text, setText] = useState('');
  const [fg, setFg] = useState('000000');
  const [bg, setBg] = useState('ffffff');
  const [size, setSize] = useState(300);
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!text.trim()) return;
    setLoading(true);
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text.trim())}&size=${size}x${size}&color=${fg}&bgcolor=${bg}&margin=2&format=png`;
    setGenerated(url);
  };

  const download = () => window.open(generated, '_blank');

  return (
    <div className="animate-fade-in space-y-5 max-w-2xl mx-auto">
      <div><h2 className="section-title">AI QR Code Designer</h2><p className="section-subtitle">Create beautiful, colorful QR codes for any URL or text</p></div>
      <div className="glass-card p-5 space-y-4">
        <textarea className="input-glass resize-none" rows={2} placeholder="Enter URL or text to encode (e.g. https://yoursite.com)" value={text} onChange={e => setText(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>QR Color</label>
            <div className="flex flex-wrap gap-1.5">
              {FG_COLORS.map(c => <button key={c} onClick={() => setFg(c)} className="w-8 h-8 rounded-lg border-2 transition-all" style={{ background: `#${c}`, borderColor: fg===c?'rgba(124,58,237,0.9)':'transparent' }} />)}
            </div>
          </div>
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Background</label>
            <div className="flex flex-wrap gap-1.5">
              {BG_COLORS.map(c => <button key={c} onClick={() => setBg(c)} className="w-8 h-8 rounded-lg border-2 transition-all" style={{ background: `#${c}`, borderColor: bg===c?'rgba(124,58,237,0.9)':'transparent', border: `2px solid ${bg===c?'rgba(124,58,237,0.9)':'var(--glass-border)'}` }} />)}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-muted)' }}>Size</label>
          <div className="flex gap-2">
            {SIZES.map(s => <button key={s} onClick={() => setSize(s)} className={cn('flex-1 py-2 rounded-xl text-sm font-medium transition-all', size===s?'bg-brand-600 text-white':'')} style={size!==s?{background:'var(--surface)',color:'var(--text-secondary)',border:'1px solid var(--glass-border)'}:{}}>{s}px</button>)}
          </div>
        </div>
        <button onClick={generate} disabled={!text.trim()} className="btn-primary w-full flex items-center justify-center gap-2"><QrCode size={16} /> Generate QR Code</button>
      </div>
      {generated && (
        <div className="glass-card p-6 animate-scale-in flex flex-col items-center gap-4">
          {loading && <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
          <div className="p-4 rounded-2xl shadow-glow" style={{ background: `#${bg}`, border: '1px solid var(--glass-border)' }}>
            <img src={generated} alt="QR Code" className="block" style={{ width: Math.min(size, 300), height: Math.min(size, 300) }} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
          </div>
          <button onClick={download} className="btn-primary flex items-center gap-2"><Download size={14} /> Download QR Code</button>
        </div>
      )}
    </div>
  );
}
