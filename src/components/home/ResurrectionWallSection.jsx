import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Calendar } from 'lucide-react';
import { useGraveyard } from '../../context/GraveyardContext';
import { ProjectLogoMark } from '../glass-panels/ProjectLogoMark';
import { BlurReveal, TactileCard } from '../animations/MotionPrimitives';
import { ArchivalWaxSeal, HandDrawnUnderline } from '../illustrations/ArchivalIllustrations';
import { playPenClick } from '../../lib/paperSound';

export function ResurrectionWallSection() {
  const { allProjects } = useGraveyard();
  const resurrected = allProjects.filter((p) => p.completionStatus === 'Resurrected');

  return (
    <section id="resurrection-wall" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      {/* Subtly Blended Botanical Notebook Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-6 h-[420px] w-full max-w-3xl overflow-hidden"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 72% 45%, rgba(0,0,0,0.9) 15%, transparent 82%)',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 72% 45%, rgba(0,0,0,0.9) 15%, transparent 82%)',
        }}
      >
        <img
          src="/images/resurrection-botanical.png"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-center opacity-[0.2] mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <BlurReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#1D5B3A]">
              Folio 04 // The Resurrection Wall
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#1A1714] sm:text-5xl">
              Back from the dead.{' '}
              <span className="relative inline-block marker-highlight italic font-bold text-[#1D5B3A]">
                Shipped into the world.
                <HandDrawnUnderline color="#1D5B3A" className="absolute -bottom-1.5 left-0 w-full" />
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-[#5B5246]">
            Folios below include clearly labelled sample resurrection stories alongside any projects
            you transition to <span className="font-bold text-[#1D5B3A]">Resurrected</span>.
          </p>
        </BlurReveal>

        {resurrected.length === 0 ? (
          <div className="paper-sheet mt-10 rounded-[4px] p-10 text-center">
            <p className="font-display text-2xl font-bold text-[#1A1714]">
              No live resurrections yet — adopt a project to claim the first folio.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {resurrected.map((project, idx) => {
              const resDate = project.resurrectedAt
                ? new Date(project.resurrectedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TactileCard
                    maxTilt={2.2}
                    glowColor="rgba(29, 91, 58, 0.16)"
                    className="paper-dossier relative overflow-hidden rounded-[4px] border-[#1D5B3A]/40 p-6 sm:p-7"
                  >
                  <div className="washi-tape-moss pointer-events-none absolute -top-2.5 left-10 h-4 w-20 -rotate-1" />

                  <div className="flex flex-wrap items-start justify-between gap-4 pt-1">
                    <div className="flex items-center gap-3.5">
                      <ProjectLogoMark
                        seed={project.logoSeed}
                        logoUrl={project.logoUrl}
                        name={project.name}
                        status="Resurrected"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-3xl font-bold text-[#1A1714]">
                            {project.name}
                          </h3>
                          {project.isDemo && (
                            <span className="rounded-[2px] border border-[#1D5B3A]/35 bg-[#DCE7CE] px-2 py-0.5 font-typewriter text-[9px] uppercase tracking-wider text-[#1D5B3A]">
                              Sample Story
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xs text-[#5B5246]">
                          Originally buried by {project.creatorName}
                        </p>
                      </div>
                    </div>

                    <ArchivalWaxSeal label="RESURRECTED" size={64} />
                  </div>

                  {/* Previous -> Current State */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="paper-manila rounded-[3px] p-4">
                      <p className="font-typewriter text-[10px] uppercase tracking-wider text-[#5B5246]">
                        Previous State
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#5B5246]">
                        {project.previousState || `Abandoned (${project.abandonmentReason})`}
                      </p>
                    </div>
                    <div className="rounded-[3px] border border-[#1D5B3A]/35 bg-[#DCE7CE]/75 p-4">
                      <p className="font-typewriter text-[10px] uppercase tracking-wider text-[#1D5B3A]">
                        Current State
                      </p>
                      <p className="mt-1.5 text-xs font-bold leading-relaxed text-[#1A1714]">
                        {project.currentState || 'Active development & live release restored.'}
                      </p>
                    </div>
                  </div>

                  {project.whatChanged && (
                    <div className="bg-ruled-paper mt-4 rounded-[3px] border border-[#1A1714]/15 bg-[#F8F2E4] p-4">
                      <p className="font-typewriter text-[10px] uppercase tracking-wider text-[#1E4A7A]">
                        What Changed
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#1A1714]">
                        {project.whatChanged}
                      </p>
                    </div>
                  )}

                  <div className="paper-divider mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-[#5B5246]">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#1D5B3A]" />
                        {(project.newContributors || ['Community Squad']).join(', ')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-[#1E4A7A]" />
                        {resDate}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      onClick={playPenClick}
                      className="inline-flex items-center gap-1 font-bold text-[#1D5B3A] hover:underline"
                    >
                      <span>View Autopsy</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  </TactileCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
