'use client';

import { useEffect, useState } from 'react';

interface StarData {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

function EightPointStar({ x, y, size, opacity }: StarData) {
  // Восьмиконечная звезда кончиком ВВЕРХ — первая точка на 12 часов (-90 градусов)
  const cx = 50, cy = 50, R = 46, r = 19;
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const outer = (i * Math.PI * 2) / 8 - Math.PI / 2;
    const inner = outer + Math.PI / 8;
    pts.push(`${cx + R * Math.cos(outer)},${cy + R * Math.sin(outer)}`);
    pts.push(`${cx + r * Math.cos(inner)},${cy + r * Math.sin(inner)}`);
  }
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <path d={`M ${pts.join(' L ')} Z`} fill="none" stroke="#B8960C" strokeWidth="3" />
    </svg>
  );
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Фиксированная сетка + случайное смещение — гарантирует покрытие ВСЕЙ страницы
function generateStars(count: number): StarData[] {
  return Array.from({ length: count }, (_, i) => {
    const cols = 6;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const rows = Math.ceil(count / cols);
    return {
      x:       (col / cols) * 100 + rand(-6, 6),
      y:       (row / rows) * 100 + rand(-3, 3),
      size:    rand(20, 50),
      opacity: rand(0.02, 0.07),
    };
  });
}

export function IslamicStars() {
  const [stars, setStars] = useState<StarData[]>([]);

  useEffect(() => {
    setStars(generateStars(36));
  }, []);

  if (stars.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {stars.map((s, i) => <EightPointStar key={i} {...s} />)}
    </div>
  );
}