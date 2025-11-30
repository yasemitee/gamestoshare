import { colors } from '@/lib/colors';

interface UserBadgeProps {
  icon?: string;
  label: string;
  value?: string | number;
  showCircle?: boolean;
}

export function UserBadge({ icon, label, value, showCircle }: UserBadgeProps) {
  if (showCircle && value !== undefined) {
    // Level badge style
    return (
      <div className="flex items-center gap-2" style={{ color: colors.white }}>
        <span className="text-small-title">{label}</span>
        <div
          className="rounded-full flex items-center justify-center text-small-title p-1"
          style={{
            backgroundColor: colors.purple,
            color: colors.black,
          }}
        >
          {value}
        </div>
      </div>
    );
  }

  if (value !== undefined) {
    // Years badge style
    return (
      <div className="flex items-center">
        <span style={{ color: colors.purple }}>{value}</span>
        <span>&nbsp;</span>
        <span style={{ color: colors.white }}>{label}</span>
      </div>
    );
  }

  // Icon badge style (Donor, Popular, Veteran)
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: colors.purple }}>
        {icon} {label}
      </span>
    </div>
  );
}
