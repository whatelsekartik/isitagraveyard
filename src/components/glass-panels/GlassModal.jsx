import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export function GlassModal({ open, onClose, title, subtitle, maxWidth = 'max-w-lg', children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#181614]/45 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`paper-sheet-deep relative z-10 w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-[5px] p-6 sm:p-7`}
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-dashed border-[#181614]/15 pb-4">
              <div>
                {subtitle && (
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#17663F]">
                    {subtitle}
                  </p>
                )}
                {title && (
                  <h3 className="font-display text-xl font-semibold tracking-tight text-[#181614] sm:text-2xl">
                    {title}
                  </h3>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="paper-chip flex h-9 w-9 items-center justify-center rounded-full text-[#5E584E] hover:text-[#181614]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
