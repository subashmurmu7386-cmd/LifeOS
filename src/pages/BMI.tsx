import { useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  advice: string;
  idealMin: number;
  idealMax: number;
}

function calcBMI(weight: number, height: number, unit: 'metric' | 'imperial'): BMIResult {
  let bmi: number;
  let idealMin: number, idealMax: number;
  if (unit === 'metric') {
    const hm = height / 100;
    bmi = weight / (hm * hm);
    idealMin = Math.round(18.5 * hm * hm);
    idealMax = Math.round(24.9 * hm * hm);
  } else {
    bmi = (703 * weight) / (height * height);
    const hm = (height * 0.0254);
    idealMin = Math.round(18.5 * hm * hm / 0.453592);
    idealMax = Math.round(24.9 * hm * hm / 0.453592);
  }

  let category: string, color: string, advice: string;
  if (bmi < 18.5) { category = 'Underweight'; color = '#3b82f6'; advice = 'Consider increasing caloric intake with nutritious foods.'; }
  else if (bmi < 25) { category = 'Normal weight'; color = '#22c55e'; advice = 'Great! Maintain your healthy lifestyle.'; }
  else if (bmi < 30) { category = 'Overweight'; color = '#f97316'; advice = 'Consider a balanced diet and regular exercise.'; }
  else { category = 'Obese'; color = '#ef4444'; advice = 'Consult a healthcare provider for personalized advice.'; }

  return { bmi: Math.round(bmi * 10) / 10, category, color, advice, idealMin, idealMax };
}

const BMI_RANGES = [
  { label: 'Underweight', range: '< 18.5', color: '#3b82f6' },
  { label: 'Normal', range: '18.5 – 24.9', color: '#22c55e' },
  { label: 'Overweight', range: '25 – 29.9', color: '#f97316' },
  { label: 'Obese', range: '≥ 30', color: '#ef4444' },
];

export default function BMI() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return;
    setResult(calcBMI(w, h, unit));
  };

  const bmiPct = result ? Math.min(((result.bmi - 10) / 30) * 100, 100) : 0;

  return (
    <div className="animate-fade-in space-y-6 max-w-md mx-auto">
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Activity size={24} className="text-green-500" />
          </div>
          <h2 className="section-title mb-0">BMI Calculator</h2>
        </div>

        <div className="flex gap-2">
          {(['metric', 'imperial'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)} className={cn('chip flex-1 justify-center capitalize', unit === u ? 'chip-active' : 'chip-inactive')}>
              {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/in)'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input type="number" className="input-glass" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} min="1" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Height ({unit === 'metric' ? 'cm' : 'inches'})
            </label>
            <input type="number" className="input-glass" placeholder={unit === 'metric' ? '170' : '67'} value={height} onChange={e => setHeight(e.target.value)} min="1" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Age (optional)</label>
            <input type="number" className="input-glass" placeholder="25" value={age} onChange={e => setAge(e.target.value)} min="1" max="120" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Gender (optional)</label>
            <select className="input-glass" value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <button onClick={calculate} className="btn-primary w-full">Calculate BMI</button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="glass-card p-6 text-center">
            <p className="text-6xl font-display font-bold mb-2" style={{ color: result.color }}>{result.bmi}</p>
            <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{result.category}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.advice}</p>
            <div className="mt-4">
              <div className="relative h-4 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #3b82f6 0%, #22c55e 25%, #f97316 60%, #ef4444 100%)' }}>
                <div className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-lg transition-all duration-500" style={{ left: `${bmiPct}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Your ideal weight range: <span className="font-bold" style={{ color: '#22c55e' }}>{result.idealMin}–{result.idealMax} {unit === 'metric' ? 'kg' : 'lbs'}</span>
            </p>
            <div className="space-y-2">
              {BMI_RANGES.map(r => (
                <div key={r.label} className={cn('flex items-center justify-between p-2.5 rounded-lg', result.category === r.label && 'border border-current')} style={{ background: result.category === r.label ? `${r.color}15` : 'var(--surface)', color: result.category === r.label ? r.color : undefined }}>
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-sm" style={{ color: r.color }}>{r.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
