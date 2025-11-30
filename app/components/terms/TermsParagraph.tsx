import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface TermsParagraphProps {
  children: ReactNode;
  className?: string;
}

export function TermsParagraph({
  children,
  className = 'mb-4',
}: TermsParagraphProps) {
  return (
    <p
      className={`text-field leading-relaxed ${className}`}
      style={{ color: colors.gray1 }}
    >
      {children}
    </p>
  );
}
