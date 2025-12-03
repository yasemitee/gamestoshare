import { motion } from 'motion/react';
import { Button } from './Button';

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  href,
  ...props
}: AnimatedButtonProps) {
  const buttonElement = (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          boxShadow:
            '0 0 20px rgba(195, 194, 245, 0.6), 0 0 40px rgba(195, 194, 245, 0.3)',
          filter: 'brightness(1.1)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-block' }}
      >
        {buttonElement}
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{
        boxShadow:
          '0 0 20px rgba(195, 194, 245, 0.6), 0 0 40px rgba(195, 194, 245, 0.3)',
        filter: 'brightness(1.1)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'inline-block' }}
    >
      {buttonElement}
    </motion.div>
  );
}
