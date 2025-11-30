import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface ContentSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({
  id,
  title,
  children,
  className = '',
}: ContentSectionProps) {
  return (
    <section id={id} className={className}>
      <h2 className="mb-4" style={{ color: colors.white }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
