import React, { useState } from 'react';
import { Sparkles, Check, Plus, X } from 'lucide-react';
import { useGraveyard } from '../../context/GraveyardContext';
import { PROJECT_CATEGORIES } from '../../data/seedProjects';

const SUGGESTED_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'Rust',
  'Go',
  'PostgreSQL',
  'Supabase',
  'Node.js',
  'Docker',
  'Tailwind CSS',
  'PostGIS',
  'FastAPI',
];

export function SkillMatcherPanel({ compact = false }) {
  const { activeProfile, updateProfile } = useGraveyard();

  const [skills, setSkills] = useState(activeProfile.skills || []);
  const [languages, setLanguages] = useState(activeProfile.languages || []);
  const [frameworks, setFrameworks] = useState(activeProfile.frameworks || []);
  const [interests, setInterests] = useState(activeProfile.interests || []);
  const [experienceLevel, setExperienceLevel] = useState(
    activeProfile.experienceLevel || 'Intermediate'
  );
  const [availability, setAvailability] = useState(
    activeProfile.availability || '5-10 hrs/week'
  );
  const [customInput, setCustomInput] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleItem = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setCustomInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      skills,
      languages,
      frameworks,
      interests,
      experienceLevel,
      availability,
    });
    setSaving(false);
  };

  return (
    <div className="paper-sheet rounded-3xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-[#181614]/15 pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#17663F]">
            Explainable Contributor Matching
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-[#181614]">
            Tune your Developer Index Card
          </h3>
          <p className="mt-1 text-xs text-[#5E584E]">
            Skill match scores are transparently computed from stack overlap, domain interests, and
            project difficulty — never opaque guesses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#181614] px-5 py-2.5 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#17663F] disabled:opacity-60"
        >
          <Check className="h-3.5 w-3.5 text-[#D8F29B]" />
          <span>{saving ? 'Updating...' : 'Apply Match Profile'}</span>
        </button>
      </div>

      <div className={`mt-6 grid gap-6 ${compact ? 'md:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {/* Skills & Stack */}
        <div className="space-y-3">
          <label className="block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
            Skills, Languages &amp; Frameworks
          </label>
          <form onSubmit={addCustomSkill} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add skill (e.g. WebRTC)"
              className="paper-input flex-1 rounded-xl px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="paper-chip flex items-center justify-center rounded-xl px-3 text-xs text-[#17663F]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {Array.from(new Set([...skills, ...languages, ...frameworks])).map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full border border-[#17663F]/30 bg-[#EAF5DC] px-2.5 py-1 font-mono text-[11px] font-medium text-[#17663F]"
              >
                {item}
                <button
                  type="button"
                  onClick={() => {
                    setSkills(skills.filter((s) => s !== item));
                    setLanguages(languages.filter((s) => s !== item));
                    setFrameworks(frameworks.filter((s) => s !== item));
                  }}
                  aria-label={`Remove ${item}`}
                  className="opacity-70 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleItem(skills, setSkills, s)}
                className="paper-chip rounded-full px-2.5 py-1 font-mono text-[10px] text-[#5E584E] hover:text-[#181614]"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
            Domain Interests
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PROJECT_CATEGORIES.map((cat) => {
              const active = interests.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleItem(interests, setInterests, cat)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-[#1E4E8C] bg-[#E8EEF5] text-[#1E4E8C]'
                      : 'border-[#181614]/15 bg-[#FAF7F0] text-[#5E584E] hover:text-[#181614]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience & Availability */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="paper-input w-full rounded-xl px-3.5 py-2.5 text-xs"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
              Collaboration Time
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="paper-input w-full rounded-xl px-3.5 py-2.5 text-xs"
            >
              <option value="2-5 hrs/week">2-5 hrs/week</option>
              <option value="5-10 hrs/week">5-10 hrs/week</option>
              <option value="10+ hrs/week">10+ hrs/week</option>
              <option value="Weekend sprint">Weekend sprint</option>
            </select>
          </div>

          <div className="paper-manila flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] text-[#5E584E]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#17663F]" />
            <span>Match badges update live across all dossiers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
