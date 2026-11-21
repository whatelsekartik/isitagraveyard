import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../animations/MotionPrimitives';

export function RevivalGauge({ score = 70, size = 128, strokeWidth = 8, label = 'Readiness' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 80 ? '#1D5B3A' : clamped >= 60 ? '#1E4A7A' : '#9A2F22';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#FCF9F0"
          stroke="rgba(26, 23, 20, 0.12)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-bold tracking-tight text-[#1A1714]">
          <AnimatedCounter value={clamped} duration={1} />
        </span>
        <span className="font-typewriter text-[10px] uppercase tracking-[0.16em] text-[#5B5246]">
          {label}
        </span>
      </div>
    </div>
  );
}
