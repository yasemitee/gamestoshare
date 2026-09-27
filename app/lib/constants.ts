/**
 * Application-wide constants
 */

// Steam verification
export const STEAM_VERIFICATION_CODE = 'GTS';

// Animation timings (in seconds)
export const ANIMATION_DURATION = {
  FAST: 0.1,
  QUICK: 0.15,
  NORMAL: 0.4,
  SMOOTH: 0.5,
  SLOW: 0.6,
} as const;

export const ANIMATION_DELAY = {
  NONE: 0,
  MINIMAL: 0.02,
  SHORT: 0.1,
  MEDIUM: 0.2,
  LONG: 0.3,
  EXTRA_LONG: 0.4,
  VERY_LONG: 0.5,
} as const;

// Mirrors --ease-out / --ease-in-out in globals.css. The built-in curves are
// too soft: ease-out for anything entering or responding to input,
// ease-in-out for things that move or resize on screen.
export const EASE = {
  out: [0.23, 1, 0.32, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
};

export const ANIMATION_EASING = EASE.out;

export const MOTION = {
  duration: 0.35,
  ease: EASE.out,
  rise: 8,
  stagger: 0.05,
} as const;

// Cache settings
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
} as const;

// Listing settings
export const MAX_LISTINGS_PER_PAGE = 30;
