import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface SubsectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

export function Subsection({ number, title, children }: SubsectionProps) {
  return (
    <div>
      <p className="text-user mb-4">
        <span style={{ color: colors.purple }}>{number}</span>
        <span style={{ color: colors.white }}> {title}</span>
      </p>
      {children}
    </div>
  );
}
