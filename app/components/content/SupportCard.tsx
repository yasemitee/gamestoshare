'use client';

import { colors, gradients } from '@/lib/colors';
import { Button } from '@/components/ui/Button';
import { ContentParagraph } from '@/components/content/ContentParagraph';
import { motion } from 'motion/react';

interface SupportCardProps {
  title: string;
  description: string[];
  buttonText: string;
  buttonIcon: string;
  buttonIconAlt: string;
  buttonHref?: string;
  buttonGradient?: string;
}

export function SupportCard({
  title,
  description,
  buttonText,
  buttonIcon,
  buttonIconAlt,
  buttonHref,
  buttonGradient,
}: SupportCardProps) {
  return (
    <div>
      <p className="text-title mb-8" style={{ color: colors.white }}>
        {title}
      </p>
      {description.map((text, index) => (
        <ContentParagraph
          key={index}
          className={index === description.length - 1 ? 'mb-8' : 'mb-4'}
        >
          {text}
        </ContentParagraph>
      ))}
      {buttonHref ? (
        <a href={buttonHref} target="_blank" rel="noopener noreferrer">
          <motion.div
            whileHover={{
              boxShadow:
                '0 0 20px rgba(195, 194, 245, 0.6), 0 0 40px rgba(195, 194, 245, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <Button
              className="inline-flex items-center gap-1.5 text-button"
              style={
                buttonGradient ? { background: buttonGradient } : undefined
              }
            >
              <img
                src={buttonIcon}
                alt={buttonIconAlt}
                width={16}
                height={16}
              />
              <span className="text-button">{buttonText}</span>
            </Button>
          </motion.div>
        </a>
      ) : (
        <motion.div
          whileHover={{
            boxShadow:
              '0 0 20px rgba(195, 194, 245, 0.6), 0 0 40px rgba(195, 194, 245, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          <Button
            className="inline-flex items-center gap-1.5 text-button"
            style={buttonGradient ? { background: buttonGradient } : undefined}
          >
            <img src={buttonIcon} alt={buttonIconAlt} width={16} height={16} />
            <span className="text-button">{buttonText}</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
