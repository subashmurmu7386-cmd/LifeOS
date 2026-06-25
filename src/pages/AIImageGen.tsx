import { useState } from 'react';
import { Sparkles, Download, RefreshCw } from 'lucide-react';

const STYLES = ['Photorealistic', 'Anime', 'Digital Art', 'Oil Painting', 'Watercolor', 'Cartoon', 'Sketch', 'Abstract'];
const ASPECTS = [
  { label: 'Square 1:1', w: 512, h: 512 },
  { label: 'Portrait 4:5', w: 512, h: 640 },
  { label: 'Landscape 16:9', w: 768, h: 432 },
];

export default function AIImageGen() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [aspect, setAspect] = useState(ASPECTS[0]);
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImgUrl('');
    const full = `${prompt.trim()}, ${style} style, ultra detailed, masterpiece`;
    const seed = Math.floor(Math.random() * 99999);
    setImgUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=${aspect.w}&height=${aspect.h}&nologo=true&seed=${seed}`);
  };

  const download = () => window.open(imgUrl, '_blank');

  return (
    <div className="animate-fade-in space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="section-title">AI Image Generator</h2>
        <p className="section-subtitle">Transform text descriptions into stunning AI artwork — free & unlimited</p>
      </div>
      <div className="glass-card p-5 space-y-4">
        <textarea className="input-glass resize-none" rows={3} placeholder="Describe your image… e.g. 'a cyberpunk city at night with neon lights reflecting in rain puddles'" value={prompt} onChange={e => setPrompt(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-muted)' }}>Art Style</label>
            <select className="input-glass" value={style} onChange={e => setStyle(e.target.value)}>
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-muted)' }}>Aspect Ratio</label>
            <select className="input-glass" value={aspect.label} onChange={e => setAspect(ASPECTS.find(a => a.label === e.target.value) || ASPECTS[0])}>
              {ASPECTS.map(a => <option key={a.label}>{a.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={!prompt.trim() || loading} className="btn-primary w-full flex items-center justify-center gap-2">
          <Sparkles size={16} />{loading ? 'Generating…' : 'Generate Image'}
        </button>
      </div>
      {imgUrl && (
        <div className="glass-card p-4 animate-scale-in space-y-3">
          <div className="relative rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center" style={{ background: 'var(--surface)' }}>
            {loading && <div className="absolute inset-0 flex flex-col items-center justify-center z-10"><div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" /><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Creating your masterpiece…</p></div>}
            <img src={imgUrl} alt="AI Generated" className="w-full rounded-xl" onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
          </div>
          <div className="flex gap-2">
            <button onClick={generate} className="btn-ghost flex items-center gap-2 text-sm flex-1 justify-center" style={{ border: '1px solid var(--glass-border)' }}><RefreshCw size={14} /> New Variation</button>
            <button onClick={download} className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center"><Download size={14} /> Download</button>
          </div>
        </div>
      )}
      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>Powered by Pollinations AI · Free & unlimited · No API key required</p>
    </div>
  );
}
