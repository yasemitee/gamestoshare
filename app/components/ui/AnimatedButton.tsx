import { Button } from './Button';

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
}

/** Button with the lavender hover glow. Hover is CSS-only, gated to real
 *  pointers; press feedback comes from Button itself. */
export function AnimatedButton({
  children,
  variant = 'primary',
  href,
  ...props
}: AnimatedButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block glow-hover"
      >
        <Button variant={variant} tabIndex={-1} {...props}>
          {children}
        </Button>
      </a>
    );
  }

  return (
    <span className="inline-block glow-hover">
      <Button variant={variant} {...props}>
        {children}
      </Button>
    </span>
  );
}
