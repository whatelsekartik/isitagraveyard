import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const MOTION_TOKENS = {
  easeEditorial: [0.22, 1, 0.36, 1],
  springSnappy: { type: 'spring', stiffness: 340, damping: 28, mass: 0.6 },
  springGentle: { type: 'spring', stiffness: 200, damping: 24, mass: 0.7 },
};

/**
 * Fast, non-blocking GPU route entrance (no filter:blur or exit lockups).
 */
export function PageTransition({ children, className = '' }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: MOTION_TOKENS.easeEditorial }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Smooth GPU opacity + translateY reveal (no expensive CSS blur repaints).
 */
export function BlurReveal({ children, delay = 0, className = '', y = 14 }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.42, delay, ease: MOTION_TOKENS.easeEditorial }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Clean lightweight scene wrapper (zero heavy scroll-listener scaling).
 */
export function ScrollScene({ children, className = '', id }) {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
}

/**
 * Animated drafting hairline & compass divider between major scenes.
 */
export function SectionSeparator({ label }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6">
      <motion.div
        initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: MOTION_TOKENS.easeEditorial }}
        style={{ transformOrigin: 'left' }}
        className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#1A1714]/25 to-[#1D5B3A]/35"
      />
      {label && (
        <span className="font-typewriter text-[10px] uppercase tracking-[0.22em] text-[#5B5246]/85">
          {label}
        </span>
      )}
      <motion.div
        initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: MOTION_TOKENS.easeEditorial }}
        style={{ transformOrigin: 'right' }}
        className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#1A1714]/25 to-[#1D5B3A]/35"
      />
    </div>
  );
}

/**
 * Lightweight tactile elevation wrapper using pure CSS transforms (60fps).
 */
export function TactileCard({ children, className = '' }) {
  return (
    <div
      className={`transition-transform duration-200 ease-out hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Magnetic button with smooth GPU translate and crisp press feedback.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.14,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    if (prefersReduced || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      whileTap={prefersReduced || disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.5 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-[inherit]">{children}</span>
    </motion.button>
  );
}

/**
 * Animated number counter for readiness gauges and metrics.
 */
export function AnimatedCounter({ value = 0, duration = 0.75 }) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(value);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const to = Number(value) || 0;
    const ms = duration * 1000;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, prefersReduced]);

  return <span>{display}</span>;
}

export function MonumentLoader({ message = 'Exhuming archive folio...', compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? 'py-8' : 'py-20'
      }`}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg viewBox="0 0 64 64" className="relative h-12 w-12" fill="none" aria-hidden="true">
          <path
            d="M32 6L46 18V54H18V18L32 6Z"
            stroke="#1A1714"
            strokeWidth="2"
            fill="#F8F2E4"
          />
          <motion.path
            d="M32 16V44M24 27H40"
            stroke="#1D5B3A"
            strokeWidth="2.4"
            strokeLinecap="round"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <rect x="14" y="54" width="36" height="3.5" rx="1.5" fill="#1A1714" />
        </svg>
      </div>
      <p className="mt-4 font-typewriter text-xs uppercase tracking-[0.2em] text-[#1D5B3A]">
        {message}
      </p>
    </div>
  );
}
