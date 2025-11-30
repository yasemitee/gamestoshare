import { colors } from '@/lib/colors';

interface QuickNavigationLink {
  href: string;
  label: string;
}

interface QuickNavigationProps {
  links: QuickNavigationLink[];
  className?: string;
}

export function QuickNavigation({
  links,
  className = 'mb-16',
}: QuickNavigationProps) {
  return (
    <div className={className}>
      <p className="text-small-title mb-6" style={{ color: colors.white }}>
        QUICK NAVIGATION
      </p>
      <div className="flex flex-wrap gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-small-title hover:opacity-80 transition-opacity"
            style={{ color: colors.purple }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
