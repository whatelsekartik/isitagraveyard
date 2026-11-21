import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { BlurReveal, MagneticButton } from '../animations/MotionPrimitives';
import {
  ArchivalWaxSeal,
  HandDrawnUnderline,
} from '../illustrations/ArchivalIllustrations';
import { playPenClick } from '../../lib/paperSound';

export function FinalCtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <BlurReveal>
          <div className="relative overflow-hidden rounded-[6px] border border-[#1A1714] bg-[#1A1714] px-6 py-14 text-center text-[#F8F2E4] shadow-[8px_8px_0_0_#D2C3A3] sm:px-14 sm:py-20">
            {/* Subtle Darkroom Sanctuary Background Blend */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{
                WebkitMaskImage:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.85) 10%, transparent 82%)',
                maskImage:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.85) 10%, transparent 82%)',
              }}
            >
              <img
                src="/images/archive-sanctuary.png"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-[0.14] sepia-[0.4] invert-[0.06]"
              />
            </div>

            <div className="relative z-10 mb-4 flex justify-center">
              <ArchivalWaxSeal
                label="ARCHIVE"
                color="#D7E5C8"
                bg="#1D5B3A"
                size={68}
              />
            </div>

            <p className="relative z-10 font-typewriter text-[11px] uppercase tracking-[0.22em] text-[#D7E5C8]">
              Give Your Work A Second Horizon
            </p>
            <h2 className="relative z-10 mx-auto mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#FCF9F0] sm:text-5xl">
              Your unfinished project isn&apos;t finished{' '}
              <span className="relative inline-block italic text-[#D7E5C8]">
                with the world.
                <HandDrawnUnderline color="#D7E5C8" className="absolute -bottom-1.5 left-0 w-full" />
              </span>
            </h2>
            <p className="relative z-10 mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#E4D7BE]/85 sm:text-base">
              Give your abandoned idea another chance. Someone out there might be looking for
              exactly what you started.
            </p>

            <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link to="/bury" onClick={playPenClick}>
                <MagneticButton className="inline-flex items-center gap-2 rounded-[4px] border border-[#D7E5C8] bg-[#D7E5C8] px-7 py-3.5 text-sm font-bold text-[#1A1714] shadow-[3px_3px_0_0_rgba(215,229,200,0.28)] transition hover:bg-[#FCF9F0]">
                  <Plus className="h-4 w-4 text-[#1D5B3A]" />
                  <span>Bury Your Project</span>
                </MagneticButton>
              </Link>

              <Link to="/explore" onClick={playPenClick}>
                <MagneticButton className="inline-flex items-center gap-2 rounded-[4px] border border-[#E4D7BE]/35 bg-[#2A2520] px-7 py-3.5 text-sm font-bold text-[#FCF9F0] transition hover:border-[#D7E5C8]">
                  <span>Explore the Graveyard</span>
                  <ArrowRight className="h-4 w-4 text-[#D7E5C8]" />
                </MagneticButton>
              </Link>
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
