import React, { useState } from 'react';

export function ProjectLogoMark({
  seed = 'monolith',
  logoUrl = '',
  name = 'Project',
  status = 'Awaiting Resurrection',
  size = 'md',
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const dims =
    size === 'lg'
      ? 'h-16 w-16 rounded-2xl'
      : size === 'sm'
        ? 'h-10 w-10 rounded-xl'
        : 'h-12 w-12 rounded-xl';

  const accent =
    status === 'Resurrected'
      ? '#17663F'
      : status === 'In Revival'
        ? '#A36218'
        : '#1E4E8C';

  const tintBg =
    status === 'Resurrected'
      ? '#EAF5DC'
      : status === 'In Revival'
        ? '#F9EFDC'
        : '#E8EEF5';

  if (logoUrl && !imgFailed) {
    return (
      <div
        className={`${dims} relative shrink-0 overflow-hidden border border-[#181614]/15 bg-[#FFFDF9] p-1 shadow-sm`}
      >
        <img
          src={logoUrl}
          alt={`${name} emblem`}
          onError={() => setImgFailed(true)}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dims} relative flex shrink-0 items-center justify-center overflow-hidden border border-[#181614]/15 shadow-sm`}
      style={{ backgroundColor: tintBg }}
    >
      <svg viewBox="0 0 40 40" className="relative h-6 w-6" fill="none" aria-hidden="true">
        {seed === 'obelisk' && (
          <>
            <path d="M20 5L29 14V33H11V14L20 5Z" stroke="#181614" strokeWidth="1.75" fill="#FFFDF9" />
            <path d="M20 13V28" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="13" r="2.2" fill={accent} />
          </>
        )}
        {seed === 'prism' && (
          <>
            <polygon points="20,6 33,29 7,29" stroke="#181614" strokeWidth="1.75" fill="#FFFDF9" />
            <polygon points="20,13 27,26 13,26" stroke={accent} strokeWidth="1.6" />
          </>
        )}
        {seed === 'vault' && (
          <>
            <rect x="8" y="8" width="24" height="24" rx="5" stroke="#181614" strokeWidth="1.75" fill="#FFFDF9" />
            <circle cx="20" cy="20" r="5" stroke={accent} strokeWidth="1.75" />
            <path d="M20 12V15M20 25V28M12 20H15M25 20H28" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {seed === 'cross' && (
          <>
            <rect x="9" y="9" width="22" height="22" rx="6" stroke="#181614" strokeWidth="1.75" fill="#FFFDF9" />
            <path d="M20 13V27M13 20H27" stroke={accent} strokeWidth="2.3" strokeLinecap="round" />
          </>
        )}
        {seed === 'orbit' && (
          <>
            <circle cx="20" cy="20" r="10.5" stroke="#181614" strokeWidth="1.5" strokeDasharray="3 3" fill="#FFFDF9" />
            <circle cx="20" cy="20" r="4" fill={accent} />
            <circle cx="29" cy="14" r="2.2" fill="#B4432C" />
          </>
        )}
        {seed === 'radar' && (
          <>
            <circle cx="20" cy="20" r="11" stroke="#181614" strokeWidth="1.75" fill="#FFFDF9" />
            <circle cx="20" cy="20" r="6" stroke={accent} strokeWidth="1.5" />
            <path d="M20 20L28 12" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {(!seed || seed === 'monolith') && (
          <>
            <path d="M13 33V12L20 6L27 12V33" stroke="#181614" strokeWidth="1.75" fill="#FFFDF9" />
            <path d="M10 33H30" stroke="#181614" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M20 14V26" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
}
