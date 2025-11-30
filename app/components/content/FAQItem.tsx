import { colors } from '@/lib/colors';
import { ReactNode } from 'react';

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  className?: string;
}

export function FAQItem({
  question,
  answer,
  className = 'mb-8',
}: FAQItemProps) {
  return (
    <div className={className}>
      <p className="text-field mb-4" style={{ color: colors.purple }}>
        {question}
      </p>
      <p className="text-field leading-relaxed" style={{ color: colors.gray1 }}>
        {answer}
      </p>
    </div>
  );
}
