import { gradients } from '@/lib/colors';
import { ReactNode, CSSProperties } from 'react';

interface GradientTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  style?: CSSProperties;
}

export function GradientTitle({
  children,
  className = '',
  as: Component = 'h1',
  style = {},
}: GradientTitleProps) {
  return (
    <Component
      className={className}
      style={{
        background: gradients.main,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
