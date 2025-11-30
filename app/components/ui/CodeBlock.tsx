import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = 'my-6' }: CodeBlockProps) {
  return (
    <p
      className={`text-field leading-relaxed inline-block ${className}`}
      style={{
        color: colors.gray1,
        backgroundColor: `${colors.black}40`,
        padding: '8px',
      }}
    >
      {children}
    </p>
  );
}
