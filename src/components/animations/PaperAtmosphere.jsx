import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Lightweight atmospheric paper motes using GPU-only transform/opacity.
 * Zero continuous canvas loops, zero blur filters, zero scroll/mouse listeners.
 */
export function PaperAtmosphere() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  const motes = [
    { left: '6%', top: '16%', delay: 0, dur: 12, rot: 12 },
    { left: '90%', top: '24%', delay: 1.5, dur: 14, rot: -16 },
    { left: '8%', top: '70%', delay: 2.2, dur: 13, rot: 20 },
    { left: '88%', top: '76%', delay: 0.8, dur: 15, rot: -10 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {motes.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.22, y: 0, rotate: m.rot }}
          animate={{
            y: [-8, 10, -8],
            rotate: [m.rot, m.rot + 6, m.rot],
          }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ left: m.left, top: m.top, willChange: 'transform' }}
          className="absolute hidden md:block"
        >
          <svg width="24" height="30" viewBox="0 0 26 32" fill="none" aria-hidden="true">
            <path
              d="M3 2H17L23 8V30H3V2Z"
              fill="#FCF9F0"
              fillOpacity="0.6"
              stroke="#1A1714"
              strokeOpacity="0.14"
            />
            <path d="M17 2V8H23" stroke="#1A1714" strokeOpacity="0.14" />
            <path d="M7 14H18M7 19H15" stroke="#1D5B3A" strokeOpacity="0.22" strokeLinecap="round" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
