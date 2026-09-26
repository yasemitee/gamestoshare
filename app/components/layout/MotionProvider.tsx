'use client';

import { MotionConfig } from 'motion/react';
import { ReactNode } from 'react';

/**
 * With reducedMotion="user", every Motion animation drops its transform and
 * layout movement for people who ask the OS for reduced motion, while
 * opacity fades still play.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
