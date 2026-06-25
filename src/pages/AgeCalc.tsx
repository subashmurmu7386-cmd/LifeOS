import { useState } from 'react';
import { Calendar, Gift } from 'lucide-react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: number;
  dayOfWeek: string;
  zodiac: string;
  birthstone: string;
}

const ZODIAC = [
  { sign: 'Capricorn', emoji: '♑', end: [1, 19] },
  { sign: 'Aquarius', emoji: '♒', end: [2, 18] },
  { sign: 'Pisces', emoji: '♓', end: [3, 20] },
  { sign: 'Aries', emoji: '♈', end: [4, 19] },
  { sign: 'Taurus', emoji: '♉', end: [5, 20] },
  { sign: 'Gemini', emoji: '♊', end: [6, 20] },
  { sign: 'Cancer', emoji: '♋', end: [7, 22] },
  { sign: 'Leo', emoji: '♌', end: [8, 22] },
  { sign: 'Virgo', emoji: '♍', end: [9, 22] },
  { sign: 'Libra', emoji: '♎', end: [10, 22] },
  { sign: 'Scorpio', emoji: '♏', end: [11, 21] },
  { sign: 'Sagittarius', emoji: '♐', end: [12, 21] },
  { sign: 'Capricorn', emoji: '♑', end: [12, 31] },
];

const BIRTHSTONES = ['Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl', 'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getZodiac(month: number, day: number) {
  for (const z of ZODIAC) {
    if (month < z.end[0] || (month === z.end[0] && day <= z.end[1])) {
      return `${z.emoji} ${z.sign}`;
    }
  }
  return '♑ Capricorn';
}

function calculateAge(birthDate: Date): AgeResult {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
  if (months < 0) { years--; months += 12; }

  const msPerDay = 86400000;
  const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / msPerDay);

  const nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
  const nextBirthday = Math.ceil((nextBday.getTime() - now.getTime()) / msPerDay);

  return {
    years, months, days,
    totalDays,
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 1440,
    nextBirthday,
    dayOfWeek: DAYS[birthDate.getDay()],
    zodiac: getZodiac(birthDate.getMonth() + 1, birthDate.getDate()),
    birthstone: BIRTHSTONES[birthDate.getMonth()],
  };
}

export default function AgeCalc() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculate = () => {
    if (!dob) return;
    const birthDate = new Date(dob + 'T00:00:00');
    if (birthDate > new Date()) return;
    setResult(calculateAge(birthDate));
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-md mx-auto">
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.15)' }}>
            <Calendar size={24} className="text-brand-500" />
          </div>
          <div>
            <h2 className="section-title mb-0">Age Calculator</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Find out your exact age and more</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>Date of Birth</label>
          <input
            type="date"
            className="input-glass"
            value={dob}
            onChange={e => setDob(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button onClick={calculate} className="btn-primary w-full flex items-center justify-center gap-2">
          <Gift size={16} /> Calculate Age
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Main age */}
          <div className="glass-card p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-indigo-500/5" />
            <div className="relative">
              <p className="text-6xl font-display font-bold gradient-text mb-2">{result.years}</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
                years, {result.months} months & {result.days} days old
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Days', value: result.totalDays.toLocaleString(), emoji: '📅' },
              { label: 'Total Hours', value: result.totalHours.toLocaleString(), emoji: '⏰' },
              { label: 'Total Minutes', value: result.totalMinutes.toLocaleString(), emoji: '⏱️' },
              { label: 'Next Birthday', value: `${result.nextBirthday} days`, emoji: '🎂' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl mb-1">{stat.emoji}</p>
                <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Fun facts */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Fun Facts</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Born on', value: result.dayOfWeek },
                { label: 'Zodiac Sign', value: result.zodiac },
                { label: 'Birthstone', value: `💎 ${result.birthstone}` },
              ].map(fact => (
                <div key={fact.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{fact.label}</span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
