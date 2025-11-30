import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface TermsSectionProps {
  title: string;
  children: ReactNode;
}

export function TermsSection({ title, children }: TermsSectionProps) {
  return (
    <section>
      <h2 className="mb-4" style={{ color: colors.white }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
