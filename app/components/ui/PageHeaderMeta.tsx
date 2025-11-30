import { colors } from '@/lib/colors';

interface PageHeaderMetaProps {
  lastUpdated?: string;
  readTime?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeaderMeta({
  lastUpdated,
  readTime,
  actions,
  className = 'mb-13',
}: PageHeaderMetaProps) {
  return (
    <div
      className={`flex items-center gap-9 border-b pb-4 ${className}`}
      style={{ borderColor: colors.gray2 }}
    >
      {lastUpdated && (
        <span className="text-field-small" style={{ color: colors.gray1 }}>
          {lastUpdated}
        </span>
      )}
      {readTime && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-field-small" style={{ color: colors.gray1 }}>
              •
            </span>
            <span className="text-field-small" style={{ color: colors.gray1 }}>
              {readTime}
            </span>
          </div>
        </>
      )}
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}
