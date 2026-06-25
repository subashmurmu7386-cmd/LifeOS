import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data' | 'time';

const CONVERSIONS: Record<Category, { unit: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { unit: 'Meter (m)', toBase: v => v, fromBase: v => v },
    { unit: 'Kilometer (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { unit: 'Centimeter (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { unit: 'Millimeter (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { unit: 'Mile (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { unit: 'Yard (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { unit: 'Foot (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { unit: 'Inch (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  ],
  weight: [
    { unit: 'Kilogram (kg)', toBase: v => v, fromBase: v => v },
    { unit: 'Gram (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { unit: 'Milligram (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { unit: 'Pound (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { unit: 'Ounce (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { unit: 'Ton (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
  ],
  temperature: [
    { unit: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
    { unit: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { unit: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  area: [
    { unit: 'Square Meter (m²)', toBase: v => v, fromBase: v => v },
    { unit: 'Square Kilometer (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { unit: 'Square Foot (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { unit: 'Square Inch (in²)', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
    { unit: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { unit: 'Hectare (ha)', toBase: v => v * 10000, fromBase: v => v / 10000 },
  ],
  volume: [
    { unit: 'Liter (L)', toBase: v => v, fromBase: v => v },
    { unit: 'Milliliter (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { unit: 'Gallon (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    { unit: 'Quart (qt)', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    { unit: 'Pint (pt)', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    { unit: 'Cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    { unit: 'Fluid Ounce', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
  ],
  speed: [
    { unit: 'm/s', toBase: v => v, fromBase: v => v },
    { unit: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { unit: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { unit: 'knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  ],
  data: [
    { unit: 'Byte (B)', toBase: v => v, fromBase: v => v },
    { unit: 'Kilobyte (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
    { unit: 'Megabyte (MB)', toBase: v => v * 1024 ** 2, fromBase: v => v / 1024 ** 2 },
    { unit: 'Gigabyte (GB)', toBase: v => v * 1024 ** 3, fromBase: v => v / 1024 ** 3 },
    { unit: 'Terabyte (TB)', toBase: v => v * 1024 ** 4, fromBase: v => v / 1024 ** 4 },
  ],
  time: [
    { unit: 'Second (s)', toBase: v => v, fromBase: v => v },
    { unit: 'Minute (min)', toBase: v => v * 60, fromBase: v => v / 60 },
    { unit: 'Hour (h)', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { unit: 'Day (d)', toBase: v => v * 86400, fromBase: v => v / 86400 },
    { unit: 'Week (wk)', toBase: v => v * 604800, fromBase: v => v / 604800 },
    { unit: 'Month (approx)', toBase: v => v * 2592000, fromBase: v => v / 2592000 },
    { unit: 'Year (approx)', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
  ],
};

const CATEGORIES: Category[] = ['length', 'weight', 'temperature', 'area', 'volume', 'speed', 'data', 'time'];

export default function Converter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [inputVal, setInputVal] = useState('1');

  const units = CONVERSIONS[category];

  const convert = (val: string, from: number, to: number): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    const base = units[from].toBase(num);
    const result = units[to].fromBase(base);
    if (Math.abs(result) < 0.000001 && result !== 0) return result.toExponential(6);
    return parseFloat(result.toPrecision(8)).toString();
  };

  const swap = () => {
    const old = fromIdx;
    setFromIdx(toIdx);
    setToIdx(old);
    setInputVal(convert(inputVal, fromIdx, toIdx) || inputVal);
  };

  const result = convert(inputVal, fromIdx, toIdx);

  return (
    <div className="animate-fade-in space-y-6 max-w-lg mx-auto">
      {/* Category */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setFromIdx(0); setToIdx(1); }} className={cn('chip capitalize', category === c ? 'chip-active' : 'chip-inactive')}>
            {c}
          </button>
        ))}
      </div>

      {/* Converter card */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="section-title capitalize">{category} Converter</h2>

        <div className="space-y-4">
          {/* From */}
          <div className="glass-card p-4">
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>From</label>
            <select className="input-glass mb-3" value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))}>
              {units.map((u, i) => <option key={u.unit} value={i}>{u.unit}</option>)}
            </select>
            <input
              type="number"
              className="input-glass text-lg font-semibold"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Enter value..."
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button onClick={swap} className="btn-primary p-3 rounded-xl">
              <ArrowLeftRight size={18} />
            </button>
          </div>

          {/* To */}
          <div className="glass-card p-4">
            <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>To</label>
            <select className="input-glass mb-3" value={toIdx} onChange={e => setToIdx(Number(e.target.value))}>
              {units.map((u, i) => <option key={u.unit} value={i}>{u.unit}</option>)}
            </select>
            <div className="input-glass text-lg font-bold" style={{ color: 'var(--text-primary)', background: 'rgba(124,58,237,0.05)' }}>
              {result || '—'}
            </div>
          </div>
        </div>

        {result && (
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{inputVal} {units[fromIdx].unit}</span>
              {' = '}
              <span className="font-bold gradient-text">{result} {units[toIdx].unit}</span>
            </p>
          </div>
        )}
      </div>

      {/* All conversions */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>All Conversions</h3>
        <div className="space-y-2">
          {units.map((u, i) => {
            const val = convert(inputVal, fromIdx, i);
            return (
              <div key={u.unit} className={cn('flex items-center justify-between p-2.5 rounded-lg', i === toIdx ? 'bg-brand-500/10 border border-brand-500/30' : '')} style={{ background: i === fromIdx ? 'transparent' : undefined }}>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{u.unit}</span>
                <span className="font-semibold text-sm" style={{ color: i === fromIdx ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {i === fromIdx ? inputVal : val || '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
