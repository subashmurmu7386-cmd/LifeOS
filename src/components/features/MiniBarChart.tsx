import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface MiniBarChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showLabels?: boolean;
}

export default function MiniBarChart({
  data,
  labels,
  color = '#7c3aed',
  height = 80,
  showLabels = false,
}: MiniBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const max = Math.max(...data, 1);
    const barCount = data.length;
    const gap = 4;
    const totalGap = gap * (barCount - 1);
    const barW = (w - totalGap) / barCount;
    const chartH = showLabels ? h - 20 : h;

    data.forEach((val, i) => {
      const x = i * (barW + gap);
      const barH = (val / max) * chartH * 0.9;
      const y = chartH - barH;

      const grad = ctx.createLinearGradient(0, y, 0, chartH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '40');

      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 3);
      ctx.fillStyle = grad;
      ctx.fill();

      if (showLabels && labels?.[i]) {
        ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
        ctx.font = '8px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, h - 4);
      }
    });
  }, [data, labels, color, height, showLabels, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px` }}
      className="block"
    />
  );
}
