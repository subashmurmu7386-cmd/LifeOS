import { useState } from 'react';
import { User2, Download, Sparkles, RefreshCw } from 'lucide-react';

const STYLES = ['Professional headshot', 'Anime character', 'Cartoon avatar', 'Pixel art', 'Fantasy portrait', 'Cyberpunk', '3D render', 'Watercolor portrait'];
const BACKGROUNDS = ['Clean studio', 'Nature landscape', 'City skyline', 'Abstract gradient', 'Dark dramatic', 'Bokeh blur'];

export default function AvatarGenerator() {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('Professional headshot');
  const [bg, setBg] = useState('Clean studio');
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setImgUrl('');
    const prompt = `${description || 'attractive person'}, ${style}, ${bg} background, avatar portrait, ultra detailed, high quality, 8k`;
    const seed = Math.floor(Math.random() * 99999);
    setImgUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seed}`);
  };

  const download = () => window.open(imgUrl, '_blank');

  return (
    <div className="animate-fade-in space-y-5 max-w-xl mx-auto">
      <div><h2 className="section-title">AI Avatar Generator</h2><p className="section-subtitle">Create unique AI-powered profile pictures and avatars</p></div>
      <div className="glass-card p-5 space-y-4">
        <input className="input-glass" placeholder="Describe yourself or character (e.g. 'young woman with red hair')" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-muted)' }}>Avatar Style</label>
            <select className="input-glass" value={style} onChange={e => setStyle(e.target.value)}>
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-muted)' }}>Background</label>
            <select className="input-glass" value={bg} onChange={e => setBg(e.target.value)}>
              {BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          <Sparkles size={16} />{loading ? 'Generating Avatar…' : 'Generate Avatar'}
        </button>
      </div>
      {imgUrl && (
        <div className="glass-card p-5 animate-scale-in flex flex-col items-center gap-4">
          <div className="relative">
            {loading && <div className="absolute inset-0 flex items-center justify-center z-10 rounded-full" style={{ background: 'var(--glass-bg)' }}><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}
            <img src={imgUrl} alt="Avatar" className="w-56 h-56 rounded-full object-cover border-4" style={{ borderColor: 'rgba(124,58,237,0.5)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
          </div>
          <div className="flex gap-2 w-full">
            <button onClick={generate} className="btn-ghost flex items-center gap-2 text-sm flex-1 justify-center" style={{ border: '1px solid var(--glass-border)' }}><RefreshCw size={14} /> New Avatar</button>
            <button onClick={download} className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center"><Download size={14} /> Download</button>
          </div>
        </div>
      )}
      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>Powered by Pollinations AI · Free & unlimited</p>
    </div>
  );
}
