'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { MOTION } from '@/lib/constants';

interface AnimatedContentWrapperProps {
  children: ReactNode;
}

export const AnimatedContentWrapper: React.FC<AnimatedContentWrapperProps> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: MOTION.rise }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0 }}
    >
      {children}
    </motion.div>
  );
};
