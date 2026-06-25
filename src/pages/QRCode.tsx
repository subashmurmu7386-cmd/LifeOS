import { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

const TYPES: { value: QRType; label: string }[] = [
  { value: 'url', label: 'URL' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'wifi', label: 'WiFi' },
];

// Simple QR code SVG generator using a public API
function getQRUrl(data: string, size: number = 256): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=svg&margin=10`;
}

export default function QRCodePage() {
  const [type, setType] = useState<QRType>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [generated, setGenerated] = useState('');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');

  const buildData = (): string => {
    switch (type) {
      case 'url': return url.startsWith('http') ? url : url ? `https://${url}` : '';
      case 'text': return text;
      case 'email': return email ? `mailto:${email}` : '';
      case 'phone': return phone ? `tel:${phone}` : '';
      case 'wifi': return ssid ? `WIFI:T:${wifiType};S:${ssid};P:${wifiPassword};;` : '';
      default: return '';
    }
  };

  const generate = () => {
    const data = buildData();
    if (!data) return;
    setQrData(data);
    setGenerated(getQRUrl(data, size));
  };

  const copy = () => {
    navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!generated) return;
    const link = document.createElement('a');
    link.href = generated;
    link.download = 'qrcode.svg';
    link.click();
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-lg mx-auto">
      <div className="glass-card p-6 space-y-5">
        <h2 className="section-title">QR Code Generator</h2>

        {/* Type selector */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)} className={cn('chip', type === t.value ? 'chip-active' : 'chip-inactive')}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          {type === 'url' && <input className="input-glass" placeholder="Enter URL (e.g. google.com)" value={url} onChange={e => setUrl(e.target.value)} />}
          {type === 'text' && <textarea className="input-glass resize-none" placeholder="Enter text..." rows={3} value={text} onChange={e => setText(e.target.value)} />}
          {type === 'email' && <input className="input-glass" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />}
          {type === 'phone' && <input className="input-glass" type="tel" placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />}
          {type === 'wifi' && (
            <>
              <input className="input-glass" placeholder="Network name (SSID)" value={ssid} onChange={e => setSsid(e.target.value)} />
              <input className="input-glass" type="password" placeholder="WiFi Password" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} />
              <select className="input-glass" value={wifiType} onChange={e => setWifiType(e.target.value)}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="">None (Open)</option>
              </select>
            </>
          )}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Size: {size}px</label>
            <input type="range" min="128" max="512" step="64" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Background</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Foreground</label>
            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer" />
          </div>
        </div>

        <button onClick={generate} className="btn-primary w-full flex items-center justify-center gap-2">
          <QrCode size={16} /> Generate QR Code
        </button>
      </div>

      {/* QR Output */}
      {generated && (
        <div className="glass-card p-6 flex flex-col items-center animate-scale-in">
          <div className="p-4 rounded-2xl mb-4" style={{ background: bgColor }}>
            <img src={generated} alt="QR Code" className="block" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
          </div>
          <p className="text-xs mb-4 text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
            {qrData.length > 60 ? qrData.slice(0, 60) + '...' : qrData}
          </p>
          <div className="flex gap-3">
            <button onClick={copy} className={cn('btn-ghost flex items-center gap-2 text-sm px-4 py-2', copied && 'text-green-400')}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Data'}
            </button>
            <button onClick={download} className="btn-primary flex items-center gap-2 text-sm">
              <Download size={14} /> Download SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
