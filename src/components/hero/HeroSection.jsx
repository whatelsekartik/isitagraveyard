import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Plus, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { MagneticButton } from '../animations/MotionPrimitives';
import {
  BrassPaperclip,
  HandDrawnUnderline,
  MarginArrowSvg,
} from '../illustrations/ArchivalIllustrations';
import { playPaperRustle, playPenClick } from '../../lib/paperSound';

const HEADLINE_WORDS_TOP = ['Every', 'great', 'idea'];
const HEADLINE_WORDS_BOTTOM = ['deserves', 'a', 'second', 'life.'];

const DECK_FILES = [
  {
    id: 'demo-campus-os',
    fileLabel: 'CASE #01',
    restingSince: 'RESTING SINCE AUG 2024',
    status: 'AWAITING REVIVAL',
    statusTone: '#1E4A7A',
    name: 'CampusOS',
    meta: 'Buried by Aarav Kulkarni · 68% Built',
    epitaph:
      '"Stalled waiting on university SSO keys. The booking core and club ledger still beat cleanly."',
    score: 82,
  },
  {
    id: 'demo-dev-vault',
    fileLabel: 'CASE #03',
    restingSince: 'RESTING SINCE NOV 2024',
    status: 'IN REVIVAL',
    statusTone: '#9A7532',
    name: 'DevVault',
    meta: 'Buried by Devon Sato · 74% Built',
    epitaph:
      '"Encrypted Yjs knowledge graph hit an IndexedDB blob wall. Architecture notes wait inside."',
    score: 87,
  },
  {
    id: 'demo-eco-route',
    fileLabel: 'CASE #02',
    restingSince: 'RESTING SINCE MAY 2024',
    status: 'AWAITING REVIVAL',
    statusTone: '#1E4A7A',
    name: 'EcoRoute',
    meta: 'Buried by Maya Lindqvist · 54% Built',
    epitaph:
      '"Rust + PostGIS routing core survived; only the paid tile server bill ran out."',
    score: 75,
  },
];

export function HeroSection({ onExploreClick }) {
  const prefersReduced = useReducedMotion();
  const [deckIndex, setDeckIndex] = useState(0);

  const cycleDeck = () => {
    playPaperRustle();
    setDeckIndex((i) => (i + 1) % DECK_FILES.length);
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-4 pb-24 pt-28 sm:px-6">
      {/* Subtly Blended Ink-and-Wash Archival Backdrop (Melted right into the parchment) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 80% at 64% 48%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.35) 62%, transparent 90%)',
          maskImage:
            'radial-gradient(ellipse 85% 80% at 64% 48%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.35) 62%, transparent 90%)',
        }}
      >
        <img
          src="/images/hero-memorial-plate.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-[0.22] mix-blend-multiply"
        />
      </div>

      {/* Soft Parchment Readability Wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#EFE7D6]/90 via-[#EFE7D6]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EFE7D6] to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-12">
        {/* Left Archivist Column */}
        <div className="lg:col-span-6">
          {/* Typewriter Case Ledger Stamp */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="paper-chip mb-6 inline-flex items-center gap-2.5 rounded-[3px] px-3.5 py-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-[#1D5B3A]" />
            <span className="font-typewriter text-[11px] tracking-[0.14em] text-[#1A1714]">
              ARCHIVE LEDGER // DIGITAL AFTERLIFE FOR CODE
            </span>
          </motion.div>

          {/* Expressive Handwritten Ink Headline */}
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.01em] text-[#1A1714] sm:text-7xl xl:text-[5.15rem]">
            <span className="block">
              {HEADLINE_WORDS_TOP.map((word, idx) => (
                <motion.span
                  key={word}
                  initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.42,
                    delay: 0.05 + idx * 0.055,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mr-[0.22em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="mt-1 block">
              {HEADLINE_WORDS_BOTTOM.map((word, idx) => {
                const isSecond = word === 'second';
                const isLife = word === 'life.';
                return (
                  <motion.span
                    key={word}
                    initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.22 + idx * 0.055,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`relative mr-[0.2em] inline-block ${
                      isSecond || isLife
                        ? 'marker-highlight italic font-bold text-[#1D5B3A]'
                        : ''
                    }`}
                  >
                    {word}
                    {isLife && (
                      <HandDrawnUnderline
                        color="#1D5B3A"
                        className="absolute -bottom-2 left-0 w-full"
                      />
                    )}
                  </motion.span>
                );
              })}
            </span>
          </h1>

          {/* Handwritten Field Journal Prose */}
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.36 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-[#463F35] sm:text-lg"
          >
            Thousands of thoughtful repositories are quietly buried before they ever meet the world.
            Here, unfinished work isn&apos;t deleted — it is preserved with its full autopsy, waiting
            for the builder who can wake it.
          </motion.p>

          {/* Letterpress Ink Action Buttons */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.44 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={() => {
                playPenClick();
                onExploreClick?.();
              }}
              className="ink-press-btn group inline-flex items-center gap-2.5 rounded-[4px] border border-[#1A1714] bg-[#1A1714] px-6 py-3 text-sm font-bold text-[#FCF9F0] hover:bg-[#1D5B3A]"
            >
              <span>Enter the Graveyard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>

            <Link to="/bury" onClick={playPenClick}>
              <MagneticButton className="ink-press-btn paper-sheet inline-flex items-center gap-2 rounded-[4px] border border-[#1A1714]/40 px-6 py-3 text-sm font-bold text-[#1A1714] hover:border-[#1D5B3A]">
                <Plus className="h-4 w-4 text-[#1D5B3A]" />
                <span>Bury a Project</span>
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Clean 3-Step Ledger Strip */}
          <div className="paper-sheet relative mt-10 grid max-w-xl grid-cols-1 gap-2 rounded-[4px] p-3 sm:grid-cols-3">
            <div className="paper-manila rounded-[3px] px-3 py-2">
              <p className="font-typewriter text-[10px] tracking-wider text-[#5B5246]">01 · BURY</p>
              <p className="mt-0.5 text-xs font-bold text-[#1A1714]">Seal the Context</p>
            </div>
            <div className="paper-manila rounded-[3px] px-3 py-2">
              <p className="font-typewriter text-[10px] tracking-wider text-[#5B5246]">02 · AUTOPSY</p>
              <p className="mt-0.5 text-xs font-bold text-[#1A1714]">Map the Blockers</p>
            </div>
            <div className="rounded-[3px] border border-[#1D5B3A]/35 bg-[#DCE7CE]/75 px-3 py-2">
              <p className="font-typewriter text-[10px] tracking-wider text-[#1D5B3A]">03 · RESURRECT</p>
              <p className="mt-0.5 text-xs font-bold text-[#1A1714]">Ship Second Life</p>
            </div>
          </div>
        </div>

        {/* Right Clean Interactive 3-Folder Case Stack */}
        <div className="relative hidden lg:col-span-6 lg:block">
          {/* Handwritten Margin Annotation */}
          <button
            type="button"
            onClick={cycleDeck}
            className="absolute -left-6 -top-11 z-40 flex items-center gap-1 select-none transition hover:scale-105"
          >
            <span className="font-display text-xl font-bold text-[#1D5B3A] -rotate-6">
              flip the case folder!
            </span>
            <MarginArrowSvg color="#1D5B3A" className="h-9 w-16 translate-y-2" />
          </button>

          {/* Physical 3-Folder Stacked Deck (Uncluttered, always mounted) */}
          <div className="relative z-10 mt-4 mr-6 min-h-[410px]">
            {DECK_FILES.map((card, idx) => {
              const pos = (idx - deckIndex + DECK_FILES.length) % DECK_FILES.length;
              const isFront = pos === 0;

              return (
                <motion.div
                  key={card.id}
                  initial={false}
                  animate={{
                    x: pos * 14,
                    y: pos * 12,
                    rotate: pos * 2,
                    scale: 1 - pos * 0.03,
                    opacity: isFront ? 1 : pos === 1 ? 0.94 : 0.86,
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  style={{
                    zIndex: 30 - pos * 10,
                    transformOrigin: 'bottom left',
                  }}
                  className={`${isFront ? 'relative' : 'absolute inset-0'} select-none`}
                >
                  {/* Folder Ear Tab */}
                  <button
                    type="button"
                    onClick={cycleDeck}
                    className={`inline-flex items-center gap-2 rounded-t-[4px] border border-b-0 border-[#1A1714]/22 px-4 py-1.5 font-typewriter text-[11px] tracking-wider transition ${
                      isFront
                        ? 'bg-[#FBF7EE] text-[#1A1714] hover:bg-[#DCE7CE]'
                        : 'paper-manila text-[#5B5246] hover:bg-[#DCE7CE]'
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 text-[#1D5B3A] ${isFront ? '' : 'opacity-70'}`} />
                    <span>
                      {card.fileLabel} ({idx + 1}/{DECK_FILES.length})
                    </span>
                  </button>

                  {isFront && (
                    <BrassPaperclip className="absolute -top-1 right-8 z-30 h-14 w-7 rotate-6 drop-shadow-sm" />
                  )}

                  <div
                    onClick={!isFront ? cycleDeck : undefined}
                    className={`paper-dossier rounded-[4px] rounded-tl-none p-7 ${
                      !isFront ? 'cursor-pointer bg-[#E9DEC7]' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-typewriter text-[10px] tracking-[0.14em] text-[#5B5246]">
                        {card.restingSince}
                      </span>

                      <span
                        className="paper-stamp rounded-[2px] px-2.5 py-0.5 font-typewriter text-[10px] uppercase tracking-wider -rotate-1"
                        style={{
                          color: card.statusTone,
                          borderColor: card.statusTone,
                          backgroundColor:
                            card.statusTone === '#9A7532' ? '#F6ECD8' : '#E6ECF3',
                        }}
                      >
                        {card.status}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${card.id}`}
                      onClick={playPenClick}
                      tabIndex={isFront ? 0 : -1}
                      className={`block ${!isFront ? 'pointer-events-none' : ''}`}
                    >
                      <div className="mt-4 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] border border-[#1A1714]/25 bg-[#E6ECF3]">
                          <FileText className="h-5 w-5 text-[#1E4A7A]" />
                        </div>
                        <div>
                          <h3 className="font-display text-4xl font-bold leading-none text-[#1A1714]">
                            {card.name}
                          </h3>
                          <p className="mt-1 font-mono text-xs text-[#5B5246]">{card.meta}</p>
                        </div>
                      </div>

                      {/* Handwritten Epitaph Quote Box */}
                      <div className="bg-ruled-paper mt-4 rounded-[3px] border-l-2 border-[#1D5B3A] bg-[#F8F2E4]/85 px-4 py-3">
                        <p className="font-display text-xl italic leading-snug text-[#1A1714]">
                          {card.epitaph}
                        </p>
                      </div>

                      <div className="paper-divider mt-5 pt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-typewriter text-[11px] text-[#5B5246]">
                            REVIVAL READINESS
                          </span>
                          <span className="font-typewriter font-bold text-[#1D5B3A]">
                            {card.score} / 100
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-[2px] border border-[#1A1714]/15 bg-[#E4D7BE]">
                          <div
                            className="h-full bg-[#1D5B3A] transition-all duration-300"
                            style={{ width: `${card.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between text-xs font-bold text-[#1D5B3A]">
                        <span className="inline-flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          Open Full Technical Autopsy
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        type="button"
        onClick={() => {
          playPenClick();
          onExploreClick?.();
        }}
        aria-label="Scroll to content"
        className="paper-chip absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[3px] px-4 py-1.5 font-typewriter text-[10px] uppercase tracking-[0.18em] text-[#5B5246] transition hover:text-[#1A1714]"
      >
        <span>Open the Archive</span>
        <ArrowDown className="h-3 w-3 text-[#1D5B3A]" />
      </button>
    </section>
  );
}
