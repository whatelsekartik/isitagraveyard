import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Zap } from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { calculateSkillMatch } from '../lib/revivalScore';
import { SkillMatcherPanel } from '../components/forms/SkillMatcherPanel';
import { ResurrectionWallSection } from '../components/home/ResurrectionWallSection';
import { ProjectLogoMark } from '../components/glass-panels/ProjectLogoMark';
import { ResurrectionRequestModal } from '../components/forms/ResurrectionRequestModal';
import { PageTransition, BlurReveal, TactileCard } from '../components/animations/MotionPrimitives';

export default function CommunityPage() {
  const { allProjects, activeProfile } = useGraveyard();
  const [selectedProject, setSelectedProject] = useState(null);

  const rankedMatches = useMemo(() => {
    return allProjects
      .filter((p) => p.completionStatus !== 'Resurrected')
      .map((project) => ({
        project,
        match: calculateSkillMatch(activeProfile, project),
      }))
      .sort((a, b) => (b.match.score || 0) - (a.match.score || 0));
  }, [allProjects, activeProfile]);

  return (
    <PageTransition className="pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BlurReveal className="mb-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1E4E8C]">
            Community &amp; Skill Matching
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#181614] sm:text-5xl">
            Find the project{' '}
            <span className="marker-highlight italic font-normal text-[#17663F]">
              built for your stack.
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5E584E]">
            Configure your engineering strengths below to rank dormant dossiers by transparent,
            explainable skill overlap.
          </p>
        </BlurReveal>

        <SkillMatcherPanel />

        {/* Explainable Ranked Matches */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-[#181614]">
            Ranked Revival Matches
          </h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {rankedMatches.map(({ project, match }, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.38, delay: Math.min(idx * 0.05, 0.2) }}
              >
                <TactileCard className="paper-dossier flex h-full flex-col justify-between rounded-[4px] p-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <ProjectLogoMark
                        seed={project.logoSeed}
                        logoUrl={project.logoUrl}
                        name={project.name}
                        status={project.completionStatus}
                      />
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[#1A1714]">
                          {project.name}
                        </h3>
                        <p className="text-xs text-[#5B5246]">
                          {project.category} · {project.difficulty}
                        </p>
                      </div>
                    </div>

                    {match.score !== null && (
                      <div className="rounded-[3px] border border-[#1D5B3A]/35 bg-[#DCE7CE] px-3.5 py-2 text-right">
                        <span className="font-display text-2xl font-bold text-[#1D5B3A]">
                          {match.score}%
                        </span>
                        <span className="block font-typewriter text-[9px] uppercase tracking-wider text-[#5B5246]">
                          Skill Match
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-[#5B5246]">{project.tagline}</p>

                  {/* Explainable Matching Factors */}
                  <div className="paper-manila mt-4 space-y-2 rounded-[3px] p-3.5">
                    <div className="flex items-center gap-1.5 font-typewriter text-[10px] uppercase tracking-wider text-[#1E4A7A]">
                      <Sparkles className="h-3 w-3" />
                      <span>Why this matches: {match.summary}</span>
                    </div>
                    <div className="grid gap-2 pt-1 sm:grid-cols-3">
                      {match.factors.map((f) => (
                        <div key={f.label} className="rounded-[3px] border border-[#1A1714]/12 bg-[#FCF9F0] p-2 text-[11px]">
                          <p className="font-bold text-[#1A1714]">{f.label}</p>
                          <p className="mt-0.5 text-[#5B5246]">{f.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    to={`/projects/${project.id}`}
                    className="paper-chip inline-flex flex-1 items-center justify-center gap-1.5 rounded-[3px] px-4 py-2.5 text-xs font-bold text-[#1A1714]"
                  >
                    <span>Inspect Autopsy</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="ink-press-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-[3px] border border-[#1A1714] bg-[#1A1714] px-4 py-2.5 text-xs font-bold text-[#FCF9F0] transition hover:bg-[#1D5B3A]"
                  >
                    <Zap className="h-3.5 w-3.5 text-[#D7E5C8]" />
                    <span>Request to Revive</span>
                  </button>
                </div>
                </TactileCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ResurrectionWallSection />

      <ResurrectionRequestModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </PageTransition>
  );
}
