import React from 'react';
import { motion } from 'framer-motion';
import { ABANDONMENT_REASONS } from '../../data/seedProjects';
import { BlurReveal, TactileCard } from '../animations/MotionPrimitives';
import {
  AbandonmentSketchIcon,
  HandDrawnUnderline,
} from '../illustrations/ArchivalIllustrations';
import { ArrowUpRight } from 'lucide-react';
import { playPenClick } from '../../lib/paperSound';

export function ForgottenWorldSection({ onSelectReason }) {
  return (
    <section className="relative overflow-hidden border-t border-[#1A1714]/15 bg-[#F4ECDC] px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BlurReveal>
              <p className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#1D5B3A]">
                Folio 01 // Causes of Burial
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-[#1A1714] sm:text-5xl">
                Not every abandoned project{' '}
                <span className="relative inline-block marker-highlight italic font-bold text-[#1D5B3A]">
                  was a bad idea.
                  <HandDrawnUnderline color="#1D5B3A" className="absolute -bottom-1.5 left-0 w-full" />
                </span>
              </h2>
            </BlurReveal>
          </div>

          <div className="lg:col-span-5">
            <BlurReveal delay={0.1}>
              <p className="text-sm leading-relaxed text-[#5B5246] sm:text-base">
                Great repositories rarely die from flawed concepts. They stall when semesters end,
                co-founders scatter, or a single infrastructure bottleneck stops momentum cold.
              </p>
              <p className="mt-2 font-mono text-[11px] text-[#5B5246]">
                * Figures below are illustrative archive notes, not live platform telemetry.
              </p>
            </BlurReveal>
          </div>
        </div>

        {/* Taped Archival Index Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ABANDONMENT_REASONS.map((reason, idx) => {
            const accentColor =
              reason.accent === 'acid'
                ? '#1D5B3A'
                : reason.accent === 'cyan'
                  ? '#1E4A7A'
                  : '#9A2F22';
            const chipBg =
              reason.accent === 'acid'
                ? '#DCE7CE'
                : reason.accent === 'cyan'
                  ? '#E6ECF3'
                  : '#F4DFDA';
            const subtleTilt =
              idx % 3 === 0 ? '-rotate-[0.6deg]' : idx % 3 === 1 ? 'rotate-[0.5deg]' : '-rotate-[0.3deg]';

            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <TactileCard maxTilt={2.6} className={`h-full ${subtleTilt} hover:rotate-0 transition-transform duration-300`}>
                  <button
                    type="button"
                    onClick={() => {
                      playPenClick();
                      onSelectReason?.(reason.id);
                    }}
                    className="paper-dossier group relative flex h-full w-full flex-col justify-between rounded-[4px] p-6 text-left"
                  >
                    {/* Masking Tape Strip */}
                    <div className="washi-tape pointer-events-none absolute -top-2.5 left-7 h-4 w-16 -rotate-2" />

                    <div>
                      <div className="flex items-center justify-between pt-1">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-[3px] border border-[#1A1714]/20"
                          style={{ backgroundColor: chipBg }}
                        >
                          <AbandonmentSketchIcon reasonId={reason.id} accentColor={accentColor} />
                        </div>
                        <div className="text-right">
                          <span
                            className="font-display text-3xl font-bold"
                            style={{ color: accentColor }}
                          >
                            {reason.illustrativeShare}
                          </span>
                          <span className="block font-typewriter text-[9px] uppercase tracking-widest text-[#5B5246]">
                            Illustrative
                          </span>
                        </div>
                      </div>

                      <p className="mt-5 font-typewriter text-[10px] uppercase tracking-[0.18em] text-[#5B5246]">
                        {reason.code}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#1A1714] transition group-hover:text-[#1D5B3A]">
                        {reason.label}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#5B5246]">
                        {reason.shortNote}
                      </p>
                    </div>

                    <div className="paper-divider mt-5 flex w-full items-center justify-between pt-3 text-xs font-bold text-[#5B5246] group-hover:text-[#1D5B3A]">
                      <span>Filter archive by cause</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </button>
                </TactileCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
