'use client';

import { useState } from 'react';
import { colors } from '@/lib/colors';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center gap-2 text-small-title text-left border-b cursor-pointer"
        style={{
          color: colors.white,
          borderColor: colors.gray2,
          lineHeight: '24px',
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            .faq-btn-responsive { line-height: 20px !important; }
          }
        `}</style>
        {/* aggiungi una classe per la media query */}
        <span className="faq-btn-responsive w-full flex items-center gap-2">
          <motion.img
            src="/Dropdown.svg"
            alt=""
            width={10}
            height={6}
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
          <span>{question}</span>
        </span>
      </button>
      {/* ...resto invariato... */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
          opacity: { duration: 0.3, ease: 'easeInOut' },
        }}
        className="overflow-hidden"
      >
        <div
          className="pl-5 pt-8 pb-3 text-field-small"
          style={{ color: colors.gray1 }}
        >
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}
