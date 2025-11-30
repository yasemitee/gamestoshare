import { colors, gradients } from '@/lib/colors';
import { Button } from '@/components/ui/Button';
import { ContentParagraph } from '@/components/content/ContentParagraph';

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
      <Button
        className="inline-flex items-center gap-1.5 text-button"
        style={buttonGradient ? { background: buttonGradient } : undefined}
      >
        <img src={buttonIcon} alt={buttonIconAlt} width={16} height={16} />
        <span className="text-button">{buttonText}</span>
      </Button>
    </div>
  );
}
