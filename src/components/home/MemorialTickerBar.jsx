import React from 'react';
import { Link } from 'react-router-dom';
import { useGraveyard } from '../../context/GraveyardContext';
import { playPenClick } from '../../lib/paperSound';

export function MemorialTickerBar() {
  const { allProjects } = useGraveyard();
  const items = allProjects.slice(0, 8);

  if (items.length === 0) return null;

  return (
    <div
      aria-label="Live Archive Inscriptions"
      className="relative z-20 overflow-hidden border-y border-[#1A1714] bg-[#1A1714] py-3 text-[#F8F2E4]"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap hover:[animation-play-state:paused]">
        {[...items, ...items].map((project, idx) => {
          const isRevived = project.completionStatus === 'Resurrected';
          const isInRevival = project.completionStatus === 'In Revival';
          return (
            <Link
              key={`${project.id}-${idx}`}
              to={`/projects/${project.id}`}
              onClick={playPenClick}
              className="group inline-flex items-center gap-3 text-xs transition hover:text-[#D7E5C8]"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isRevived
                    ? 'bg-[#D7E5C8]'
                    : isInRevival
                      ? 'bg-[#E6B86A]'
                      : 'bg-[#8FA9C9]'
                }`}
              />
              <span className="font-typewriter text-[10px] uppercase tracking-[0.16em] text-[#D7E5C8]/85">
                {isRevived ? 'EXHUMED' : isInRevival ? 'IN REVIVAL' : 'RESTING'}
              </span>
              <span className="font-display text-xl font-bold tracking-wide text-[#FCF9F0] group-hover:underline">
                {project.name}
              </span>
              <span className="font-mono text-[11px] text-[#E4D7BE]/75">
                ({project.completionPercent}% built · {project.abandonmentReason})
              </span>
              <span className="pl-2 text-[#9A7532]" aria-hidden="true">
                ✦
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
