import React from 'react';
import { PageTransition, BlurReveal } from '../components/animations/MotionPrimitives';
import { GraveyardExplorerSection } from '../components/home/GraveyardExplorerSection';
import { SkillMatcherPanel } from '../components/forms/SkillMatcherPanel';

export default function ExplorePage() {
  return (
    <PageTransition className="relative overflow-hidden pb-16 pt-28">
      {/* Subtle Blended Sanctuary Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.8) 15%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.8) 15%, transparent 100%)',
        }}
      >
        <img
          src="/images/archive-sanctuary.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-[0.16] mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <BlurReveal className="mb-8">
          <p className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#1D5B3A]">
            The Digital Archive
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#1A1714] sm:text-5xl">
            Explore the{' '}
            <span className="marker-highlight italic font-bold text-[#1D5B3A]">Graveyard.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5B5246] sm:text-base">
            Scan abandoned architectures, open any manila folder dossier, match your engineering
            strengths against blockers, and inspect full Project Autopsies.
          </p>
        </BlurReveal>

        <SkillMatcherPanel compact />
      </div>

      <GraveyardExplorerSection showHeader={false} defaultExpandedFilters />
    </PageTransition>
  );
}
