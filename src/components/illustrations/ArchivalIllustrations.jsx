import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated hand-drawn ink underline stroke.
 */
export function HandDrawnUnderline({ className = '', color = '#17663F' }) {
  const prefersReduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 240 18"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={`pointer-events-none h-3.5 w-full ${className}`}
    >
      <motion.path
        d="M3 11.5C46 5.5 118 3.5 236 9.5C184 12.5 92 14.5 14 14"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/**
 * Tactile brass paperclip SVG to pin archival cards.
 */
export function BrassPaperclip({ className = '' }) {
  return (
    <svg
      viewBox="0 0 36 72"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M12 18V50C12 56.6274 17.3726 62 24 62C30.6274 62 34 56.6274 34 50V14C34 7.37258 28.6274 2 22 2C15.3726 2 10 7.37258 10 14V44C10 47.866 13.134 51 17 51C20.866 51 24 47.866 24 44V16"
        stroke="#8C6D3B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M11 18V49C11 55.6274 16.3726 61 23 61"
        stroke="#D4B475"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Embossed archival wax / ink seal SVG.
 */
export function ArchivalWaxSeal({
  label = 'RESURRECTED',
  color = '#1D5B3A',
  bg = '#DCE7CE',
  size = 84,
  className = '',
}) {
  return (
    <motion.div
      initial={{ scale: 1.15, rotate: -14, opacity: 0 }}
      whileInView={{ scale: 1, rotate: -6, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden="true">
        <path
          d="M60 6L69 11L79 8L85 17L96 18L98 29L108 34L106 45L114 54L108 64L112 75L103 82L103 93L92 96L88 106L77 105L69 114L60 109L51 114L43 105L32 106L28 96L17 93L17 82L8 75L12 64L6 54L14 45L12 34L22 29L24 18L35 17L41 8L51 11L60 6Z"
          fill={bg}
          stroke={color}
          strokeWidth="2.2"
        />
        <circle cx="60" cy="60" r="39" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="60" cy="60" r="31" stroke={color} strokeWidth="1.2" />
        <path
          d="M60 36V66M49 48H71"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M60 66C60 66 53 58 46 60C48 67 55 69 60 66ZM60 66C60 66 67 58 74 60C72 67 65 69 60 66Z"
          fill={color}
          opacity="0.85"
        />
        <text
          x="60"
          y="85"
          textAnchor="middle"
          fill={color}
          fontSize="9"
          fontFamily="Courier Prime, monospace"
          fontWeight="700"
          letterSpacing="1.1"
        >
          {label.slice(0, 11)}
        </text>
      </svg>
    </motion.div>
  );
}

/**
 * Hand-inked botanical memorial monument plate (used inside pinned specimen cards).
 */
export function MemorialPlateIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 260 150" fill="none" aria-hidden="true" className={className}>
      {/* Fine crosshatched sky & hill */}
      <path d="M22 126C62 115 198 115 238 126" stroke="#1A1714" strokeOpacity="0.35" strokeWidth="1.3" />
      <path d="M40 134H220" stroke="#1A1714" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />

      {/* Arched stone monolith with carved code-bracket */}
      <path
        d="M94 122V56C94 37 110 24 130 24C150 24 166 37 166 56V122"
        fill="#F8F2E4"
        stroke="#1A1714"
        strokeWidth="1.9"
      />
      <path
        d="M102 122V58C102 44 114 33 130 33C146 33 158 44 158 58V122"
        stroke="#1A1714"
        strokeOpacity="0.25"
        strokeWidth="1.1"
      />
      {/* Carved </> emblem */}
      <path
        d="M119 60L111 67L119 74M141 60L149 67L141 74M133 57L127 77"
        stroke="#1D5B3A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Epitaph lines */}
      <path d="M113 89H147M118 97H142" stroke="#5B5246" strokeWidth="1.3" strokeLinecap="round" />

      {/* Creeping ivy & living sprout climbing the stone */}
      <path
        d="M94 118C85 102 88 86 98 76C106 68 104 54 96 47"
        stroke="#1D5B3A"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M89 96C78 93 74 84 82 78C89 80 92 89 89 96Z"
        fill="#D7E5C8"
        stroke="#1D5B3A"
        strokeWidth="1.2"
      />
      <path
        d="M166 116C174 104 176 92 169 83"
        stroke="#1D5B3A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M172 98C183 96 187 87 180 82C173 83 170 91 172 98Z"
        fill="#D7E5C8"
        stroke="#1D5B3A"
        strokeWidth="1.2"
      />

      {/* Tiny firefly / star sparks */}
      <circle cx="56" cy="48" r="2" fill="#9A7532" fillOpacity="0.65" />
      <circle cx="204" cy="44" r="2.2" fill="#1D5B3A" fillOpacity="0.55" />
      <path d="M196 64L198 69L203 71L198 73L196 78L194 73L189 71L194 69Z" fill="#9A7532" fillOpacity="0.45" />
    </svg>
  );
}

/**
 * Hand-sketched drafting architectural monument & botanical sprout watermark for the Hero.
 */
export function DraftingMonumentScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 640 480"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Compass rose & orbital drafting arcs */}
      <circle cx="320" cy="240" r="196" stroke="#181614" strokeOpacity="0.08" strokeDasharray="6 6" />
      <circle cx="320" cy="240" r="144" stroke="#17663F" strokeOpacity="0.11" />
      <path d="M90 240H550M320 30V450" stroke="#181614" strokeOpacity="0.06" />

      {/* Central Digital Monument Elevation */}
      <path
        d="M270 390V172L320 116L370 172V390"
        stroke="#181614"
        strokeOpacity="0.16"
        strokeWidth="2"
        fill="#FAF7F0"
        fillOpacity="0.45"
      />
      <path d="M240 390H400" stroke="#181614" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M256 372H384" stroke="#181614" strokeOpacity="0.12" strokeWidth="1.5" />

      {/* Flanking geometric monolith silhouettes */}
      <path
        d="M174 390V235L204 205L234 235V390"
        stroke="#1E4E8C"
        strokeOpacity="0.15"
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />
      <path
        d="M406 390V218L438 188L470 218V390"
        stroke="#17663F"
        strokeOpacity="0.16"
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />

      {/* Botanical vine / living sprout emerging from the monument */}
      <path
        d="M320 278C320 236 322 204 344 180C356 167 372 162 384 166"
        stroke="#17663F"
        strokeOpacity="0.34"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M343 181C332 166 336 146 355 144C361 158 355 174 343 181Z"
        fill="#D7E5C8"
        fillOpacity="0.6"
        stroke="#1D5B3A"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M322 232C306 221 300 202 316 192C328 202 330 220 322 232Z"
        fill="#D7E5C8"
        fillOpacity="0.45"
        stroke="#1D5B3A"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />

      {/* Drafting dimension callouts */}
      <path d="M392 116H420M392 390H420M408 116V390" stroke="#181614" strokeOpacity="0.11" strokeWidth="1" />
      <text
        x="416"
        y="256"
        fill="#5B5246"
        fillOpacity="0.42"
        fontSize="10"
        fontFamily="Courier Prime, monospace"
      >
        ELEV. 274mm
      </text>
    </svg>
  );
}

/**
 * Hand-sketched ink illustration for the 4 stages of How Resurrection Works.
 */
export function StageInkIllustration({ stageNum }) {
  if (stageNum === '01') {
    // Folded archival folio + wax stamp
    return (
      <svg viewBox="0 0 80 64" className="h-14 w-16" fill="none" aria-hidden="true">
        <rect x="10" y="14" width="48" height="38" rx="4" fill="#FFFDF9" stroke="#181614" strokeWidth="1.8" />
        <path d="M10 22H58" stroke="#181614" strokeWidth="1.4" strokeDasharray="3 2" />
        <path d="M18 31H42M18 39H35" stroke="#5E584E" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="56" cy="42" r="11" fill="#F9EAE6" stroke="#B4432C" strokeWidth="1.8" />
        <path d="M56 37V47M51 42H61" stroke="#B4432C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (stageNum === '02') {
    // Forensic magnifying glass over code blueprint
    return (
      <svg viewBox="0 0 80 64" className="h-14 w-16" fill="none" aria-hidden="true">
        <rect x="10" y="10" width="44" height="44" rx="5" fill="#FFFDF9" stroke="#181614" strokeWidth="1.8" />
        <path d="M18 22H36M18 30H44M18 38H30" stroke="#1E4E8C" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="48" cy="36" r="13" fill="#E8EEF5" stroke="#1E4E8C" strokeWidth="2" />
        <path d="M57 46L67 56" stroke="#181614" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M44 36L47 39L53 33" stroke="#1E4E8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (stageNum === '03') {
    // Drafting compass + constellation nodes
    return (
      <svg viewBox="0 0 80 64" className="h-14 w-16" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="6" fill="#F9EFDC" stroke="#A36218" strokeWidth="1.8" />
        <circle cx="56" cy="18" r="5" fill="#FFFDF9" stroke="#181614" strokeWidth="1.8" />
        <circle cx="48" cy="46" r="6.5" fill="#EAF5DC" stroke="#17663F" strokeWidth="1.8" />
        <path d="M29 22L51 19M28 28L43 42M54 23L50 40" stroke="#181614" strokeWidth="1.6" strokeDasharray="3 2.5" />
      </svg>
    );
  }
  // 04: Sprout breaking out of monolith
  return (
    <svg viewBox="0 0 80 64" className="h-14 w-16" fill="none" aria-hidden="true">
      <path d="M22 52V28L34 18L46 28V52H22Z" fill="#FFFDF9" stroke="#181614" strokeWidth="1.8" />
      <path d="M14 52H54" stroke="#181614" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 32C34 20 42 12 56 12" stroke="#17663F" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M46 15C44 8 52 4 60 8C60 15 52 19 46 15Z"
        fill="#D8F29B"
        stroke="#17663F"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * Custom hand-sketched ink icons for abandonment reasons.
 */
export function AbandonmentSketchIcon({ reasonId, accentColor }) {
  return (
    <svg viewBox="0 0 44 44" className="h-7 w-7" fill="none" aria-hidden="true">
      {reasonId === 'Lost motivation' && (
        <>
          <path d="M16 32H28V35H16V32Z" stroke="#181614" strokeWidth="1.6" />
          <path d="M18 32V20L22 15L26 20V32" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <path d="M22 11C22 11 25 8 23 5C20 7 20 9 22 11Z" fill={accentColor} />
        </>
      )}
      {reasonId === 'Lack of time' && (
        <>
          <path d="M13 10H31M13 34H31" stroke="#181614" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M15 10C15 18 22 20 22 22C22 24 15 26 15 34H29C29 26 22 24 22 22C22 20 29 18 29 10H15Z" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <path d="M18 31H26L22 26L18 31Z" fill={accentColor} />
        </>
      )}
      {reasonId === 'Missing expertise' && (
        <>
          <path d="M11 16H22V12C22 10 26 10 26 12V16H33V27H29C27 27 27 31 29 31H33V34H11V16Z" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <circle cx="22" cy="25" r="3" fill={accentColor} />
        </>
      )}
      {reasonId === 'Team dissolution' && (
        <>
          <circle cx="14" cy="17" r="4.5" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <circle cx="30" cy="17" r="4.5" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <circle cx="22" cy="30" r="4.5" fill={accentColor} stroke="#181614" strokeWidth="1.6" />
          <path d="M18 19L26 19" stroke={accentColor} strokeWidth="1.6" strokeDasharray="2 2" />
        </>
      )}
      {reasonId === 'Technical roadblocks' && (
        <>
          <rect x="9" y="13" width="26" height="10" rx="2" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <path d="M13 13L19 23M23 13L29 23" stroke={accentColor} strokeWidth="2" />
          <path d="M14 23V34M30 23V34" stroke="#181614" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {reasonId === 'Lack of resources' && (
        <>
          <rect x="10" y="14" width="22" height="16" rx="3" fill="#FFFDF9" stroke="#181614" strokeWidth="1.6" />
          <path d="M32 19H35V25H32" stroke="#181614" strokeWidth="1.6" />
          <rect x="13" y="17" width="5" height="10" rx="1" fill={accentColor} />
        </>
      )}
    </svg>
  );
}

/**
 * Hand-sketched curved margin callout arrow.
 */
export function MarginArrowSvg({ className = '' }) {
  return (
    <svg viewBox="0 0 80 44" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6 8C24 6 44 14 66 32"
        stroke="#17663F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path
        d="M57 32L67 33L64 23"
        stroke="#17663F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Subtle notebook binder punched holes along the left edge of autopsy folios.
 */
export function BinderHolesColumn({ count = 6 }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-8 left-3 top-8 hidden flex-col justify-between sm:flex"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 w-3.5 rounded-full border border-[#181614]/20 bg-[#F4EFE6] shadow-inner"
        />
      ))}
    </div>
  );
}

/**
 * Tactile dog-ear page corner fold SVG for dossier cards.
 */
export function DogEarCorner({ className = '' }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none transition-transform duration-300 group-hover:scale-110 ${className}`}
    >
      <path d="M36 0V36H0L36 0Z" fill="#EAE2D2" />
      <path d="M0 36L11 25L36 0L0 36Z" fill="#DFD4BE" opacity="0.65" />
      <path d="M0 36L11 11L36 0" stroke="#181614" strokeOpacity="0.16" strokeWidth="1" />
      <path d="M0 36C7 29 10 21 11 11C21 10 29 7 36 0" fill="#FFFDF9" stroke="#181614" strokeOpacity="0.16" strokeWidth="1" />
    </svg>
  );
}

/**
 * Animated growing botanical vine SVG symbolizing dead code coming back to life.
 */
export function BotanicalSproutVine({ className = '' }) {
  const prefersReduced = useReducedMotion();

  return (
    <svg viewBox="0 0 120 220" fill="none" aria-hidden="true" className={`pointer-events-none ${className}`}>
      <motion.path
        d="M16 214C24 166 56 144 48 96C42 60 66 30 96 14"
        stroke="#17663F"
        strokeOpacity="0.38"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M48 118C30 112 20 96 28 84C42 86 50 100 48 118Z"
        fill="#D8F29B"
        fillOpacity="0.7"
        stroke="#17663F"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        initial={prefersReduced ? { scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      />
      <motion.path
        d="M64 56C64 38 78 24 94 28C92 44 78 56 64 56Z"
        fill="#D8F29B"
        fillOpacity="0.8"
        stroke="#17663F"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        initial={prefersReduced ? { scale: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      />
    </svg>
  );
}
