import { useState, useRef, useEffect } from 'react';
import { Upload, Download, Laugh } from 'lucide-react';

const TEMPLATES = [
  { name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { name: 'Distracted BF', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { name: 'This Is Fine', url: 'https://i.imgflip.com/wxica.jpg' },
  { name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg' },
];
const COLORS = ['#ffffff', '#ffff00', '#ff4444', '#000000'];

export default function MemeGenerator() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#ffffff');
  const [imgLoaded, setImgLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const drawMeme = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const maxW = 560;
    const scale = img.naturalWidth > maxW ? maxW / img.naturalWidth : 1;
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px Impact`;
    ctx.textAlign = 'center';
    ctx.lineWidth = Math.max(2, fontSize / 12);
    ctx.strokeStyle = textColor === '#000000' ? '#ffffff' : '#000000';
    ctx.fillStyle = textColor;
    if (topText) {
      ctx.textBaseline = 'top';
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 8);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 8);
    }
    if (bottomText) {
      ctx.textBaseline = 'bottom';
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 8);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 8);
    }
  };

  useEffect(() => { if (imgLoaded) drawMeme(); }, [topText, bottomText, fontSize, textColor, imgLoaded]);

  const loadImg = (src: string) => {
    setImgLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgRef.current = img; setImgLoaded(true); };
    img.src = src;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => loadImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `meme-${Date.now()}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div><h2 className="section-title">Meme Generator</h2><p className="section-subtitle">Create viral memes with custom text — fully client-side</p></div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="glass-card p-4">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Meme Templates</p>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.name} onClick={() => loadImg(t.url)} className="glass-card p-1.5 overflow-hidden hover:border-brand-400 transition-all group">
                  <img src={t.url} alt={t.name} className="w-full h-14 object-cover rounded-lg group-hover:scale-105 transition-transform" loading="lazy" />
                  <p className="text-xs text-center mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{t.name}</p>
                </button>
              ))}
            </div>
            <button onClick={() => fileRef.current?.click()} className="btn-ghost w-full mt-2 text-sm flex items-center justify-center gap-2 py-2" style={{ border: '1px solid var(--glass-border)' }}><Upload size={14} /> Upload Custom Image</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          {imgLoaded && (
            <div className="glass-card p-4 space-y-3">
              <input className="input-glass" placeholder="Top text" value={topText} onChange={e => setTopText(e.target.value)} />
              <input className="input-glass" placeholder="Bottom text" value={bottomText} onChange={e => setBottomText(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}><span>Font Size</span><span>{fontSize}px</span></div>
                  <input type="range" min={20} max={80} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Text Color</p>
                  <div className="flex gap-2">{COLORS.map(c => <button key={c} onClick={() => setTextColor(c)} className="w-8 h-8 rounded-lg border-2 transition-all" style={{ background: c, borderColor: textColor===c?'rgba(124,58,237,0.8)':'rgba(255,255,255,0.2)' }} />)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center gap-3">
          {imgLoaded ? (
            <>
              <canvas ref={canvasRef} className="w-full max-h-[400px] rounded-xl object-contain" style={{ border: '1px solid var(--glass-border)' }} />
              <button onClick={download} className="btn-primary flex items-center gap-2 w-full justify-center"><Download size={14} /> Download Meme</button>
            </>
          ) : (
            <div className="text-center"><Laugh size={48} className="mx-auto mb-3 text-brand-400" /><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pick a template or upload an image to get started</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
