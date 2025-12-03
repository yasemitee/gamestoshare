'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedContentWrapperProps {
  children: ReactNode;
}

export const AnimatedContentWrapper: React.FC<AnimatedContentWrapperProps> = ({
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};
