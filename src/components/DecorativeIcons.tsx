import React from 'react';

export const SteamDoodle: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-amber-700/60" }) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M12 28C10 24 14 20 12 16C10 12 14 8 12 4" opacity="0.6">
      <animate attributeName="d" values="M12 28C10 24 14 20 12 16C10 12 14 8 12 4; M12 28C14 24 10 20 14 16C10 12 12 8 12 4; M12 28C10 24 14 20 12 16C10 12 14 8 12 4" dur="4s" repeatCount="indefinite"/>
    </path>
    <path d="M20 30C18 25 23 20 20 15C17 10 22 6 20 2" opacity="0.8">
      <animate attributeName="d" values="M20 30C18 25 23 20 20 15C17 10 22 6 20 2; M20 30C22 25 18 20 22 15C18 10 20 6 20 2; M20 30C18 25 23 20 20 15C17 10 22 6 20 2" dur="3.5s" repeatCount="indefinite"/>
    </path>
    <path d="M28 28C26 23 30 19 28 15C26 11 29 7 28 4" opacity="0.5">
      <animate attributeName="d" values="M28 28C26 23 30 19 28 15C26 11 29 7 28 4; M28 28C30 23 26 19 30 15C26 11 28 7 28 4; M28 28C26 23 30 19 28 15C26 11 29 7 28 4" dur="4.5s" repeatCount="indefinite"/>
    </path>
  </svg>
);

export const LaurelBranch: React.FC<{ className?: string }> = ({ className = "w-16 h-6 text-amber-800/40" }) => (
  <svg viewBox="0 0 100 24" fill="currentColor" className={className}>
    <path d="M5 12 C 30 12, 70 12, 95 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M15 12 C 14 7, 22 6, 25 12 C 22 10, 18 10, 15 12 Z" />
    <path d="M15 12 C 14 17, 22 18, 25 12 C 22 14, 18 14, 15 12 Z" />
    <path d="M35 12 C 34 6, 43 5, 46 12 C 43 9, 38 9, 35 12 Z" />
    <path d="M35 12 C 34 18, 43 19, 46 12 C 43 15, 38 15, 35 12 Z" />
    <path d="M58 12 C 57 6, 66 5, 69 12 C 66 9, 61 9, 58 12 Z" />
    <path d="M58 12 C 57 18, 66 19, 69 12 C 66 15, 61 15, 58 12 Z" />
    <path d="M80 12 C 79 7, 86 6, 89 12 C 86 9, 82 9, 80 12 Z" />
    <path d="M80 12 C 79 17, 86 18, 89 12 C 86 15, 82 15, 80 12 Z" />
  </svg>
);

export const HeartDoodle: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-rose-500/70" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const OliveSprig: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-emerald-800/50" }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
    <path d="M4 28 C 12 24, 20 16, 28 4" />
    <circle cx="12" cy="18" r="3" fill="currentColor" opacity="0.7" />
    <circle cx="19" cy="13" r="2.5" fill="currentColor" opacity="0.7" />
    <path d="M12 18 C 10 13, 15 10, 16 15 Z" fill="currentColor" opacity="0.4" />
    <path d="M20 12 C 22 7, 26 8, 24 13 Z" fill="currentColor" opacity="0.4" />
  </svg>
);

export const PaperClip: React.FC<{ className?: string }> = ({ className = "w-6 h-10 text-zinc-500" }) => (
  <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
    <path d="M16 10 V 28 C 16 33, 8 33, 8 28 V 8 C 8 3, 20 3, 20 8 V 26" />
  </svg>
);
