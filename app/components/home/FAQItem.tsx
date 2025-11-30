'use client';

import { useState } from 'react';
import { colors } from '@/lib/colors';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center gap-2 text-small-title text-left border-b"
        style={{ color: colors.white, borderColor: colors.gray2 }}
      >
        <img
          src="/Dropdown.svg"
          alt=""
          width={10}
          height={6}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
        <span>{question}</span>
      </button>
      {isOpen && (
        <div
          className="pl-5 pt-8 pb-3 text-field-small"
          style={{ color: colors.gray1 }}
        >
          {answer}
        </div>
      )}
    </>
  );
}
