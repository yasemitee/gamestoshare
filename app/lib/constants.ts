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

export const ANIMATION_EASING = [0.4, 0.0, 0.2, 1] as const;

// Cache settings
export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
} as const;

// Listing settings
export const LISTING_EXPIRATION_DAYS = 30;
export const MAX_LISTINGS_PER_PAGE = 30;
