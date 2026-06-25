import { useEffect, useRef } from 'react';

interface DonutChartProps {
  value: number;
  max: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function DonutChart({
  value,
  max,
  color = '#7c3aed',
  size = 80,
  strokeWidth = 8,
  label,
}: DonutChartProps) {
  const pct = Math.min(value / Math.max(max, 1), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124,58,237,0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{label}</span>
        </div>
      )}
    </div>
  );
}
