import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { BlurReveal, TactileCard } from '../animations/MotionPrimitives';
import {
  HandDrawnUnderline,
  StageInkIllustration,
} from '../illustrations/ArchivalIllustrations';
import { playPenClick } from '../../lib/paperSound';

const STAGES = [
  {
    num: '01',
    title: 'BURY',
    subtitle: 'Ceremonial Preservation',
    ctaLabel: 'Open Burial Wizard',
    to: '/bury',
    description:
      'Creators submit unfinished projects, link public GitHub repositories, and archive the context before it vanishes into forgotten folders.',
  },
  {
    num: '02',
    title: 'AUTOPSY',
    subtitle: 'Honest Technical Triage',
    ctaLabel: 'Inspect Sample Autopsy',
    to: '/projects/demo-campus-os',
    description:
      'Document what currently works, what remains unfinished, technical blockers, missing dependencies, and realistic next steps.',
  },
  {
    num: '03',
    title: 'DISCOVER',
    subtitle: 'Skill-Matched Exhumation',
    ctaLabel: 'Browse the Archive',
    to: '/explore',
    description:
      'Developers filter by stack, difficulty, abandonment reason, and explainable skill-match factors to find projects they can genuinely unblock.',
  },
  {
    num: '04',
    title: 'RESURRECT',
    subtitle: 'Permissioned Second Life',
    ctaLabel: 'Match Skills & Revive',
    to: '/community',
    description:
      'Contributors request access to collaborate or adopt. With the original creator’s approval, dormant ideas return to active shipping.',
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 60%'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-drafting-grid relative overflow-hidden border-y border-[#1A1714]/15 bg-[#F8F2E4] px-4 py-24 sm:px-6 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <BlurReveal className="max-w-2xl">
          <p className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#1D5B3A]">
            Folio 03 // The Resurrection Protocol
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#1A1714] sm:text-5xl">
            How an abandoned repo comes{' '}
            <span className="relative inline-block marker-highlight italic font-bold text-[#1D5B3A]">
              back from the dead.
              <HandDrawnUnderline color="#1D5B3A" className="absolute -bottom-1.5 left-0 w-full" />
            </span>
          </h2>
        </BlurReveal>

        <div className="relative mt-16">
          {/* Ink-drawn progress beam */}
          <div className="pointer-events-none absolute left-8 right-8 top-14 hidden h-[2px] bg-[#1A1714]/15 lg:block">
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: 'left' }}
              className="h-full w-full bg-[#1D5B3A]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((stage, idx) => {
              const isHighlighted = activeStage === stage.num;
              return (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TactileCard maxTilt={2.4} className="h-full">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveStage(stage.num)}
                      onMouseLeave={() => setActiveStage(null)}
                      onClick={() => {
                        playPenClick();
                        navigate(stage.to);
                      }}
                      className={`paper-dossier group relative flex h-full w-full flex-col justify-between rounded-[4px] p-6 text-left transition ${
                        isHighlighted ? 'border-[#1D5B3A]' : ''
                      }`}
                    >
                      <div className="washi-tape pointer-events-none absolute -top-2.5 right-6 h-3.5 w-14 rotate-2" />

                      <div>
                        <div className="relative z-10 flex items-center justify-between">
                          <StageInkIllustration stageNum={stage.num} />
                          <span className="font-typewriter text-xs font-bold tracking-[0.2em] text-[#5B5246] group-hover:text-[#1D5B3A]">
                            {stage.num}
                          </span>
                        </div>

                        <p className="mt-5 font-typewriter text-[10px] uppercase tracking-[0.18em] text-[#1E4A7A]">
                          {stage.subtitle}
                        </p>
                        <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#1A1714] group-hover:text-[#1D5B3A]">
                          {stage.num} — {stage.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-[#5B5246]">
                          {stage.description}
                        </p>
                      </div>

                      <div className="paper-divider mt-5 flex w-full items-center justify-between pt-3 text-xs font-bold text-[#1D5B3A]">
                        <span>{stage.ctaLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </button>
                  </TactileCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
