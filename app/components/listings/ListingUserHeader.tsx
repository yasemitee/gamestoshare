import { colors } from '@/lib/colors';
import { ActionButtons } from '@/components/listings/ActionButtons';
import { UserBadge } from '@/components/listings/UserBadge';

interface ListingUserHeaderProps {
  username: string | null;
  showSteamId: boolean;
  avatarUrl: string | null;
  location: string;
  steamLevel: number | null;
  accountYears: number | null;
  isDonor?: boolean;
  isPopular?: boolean;
  isVeteran?: boolean;
}

export function ListingUserHeader({
  username,
  showSteamId,
  avatarUrl,
  location,
  steamLevel,
  accountYears,
  isDonor = true,
  isPopular = true,
  isVeteran = true,
}: ListingUserHeaderProps) {
  return (
    <div className="flex gap-8">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-20 h-20 bg-cover bg-center"
          style={{
            backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
            backgroundColor: colors.gray2,
          }}
        />
      </div>
      {/* User Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* User Name and Location */}
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-user" style={{ color: colors.white }}>
            {showSteamId && username ? username : 'Anonymous'}
          </h1>
          <img
            src={`https://flagcdn.com/w20/${location.toLowerCase()}.png`}
            alt={location}
            className="w-6 h-5"
          />
        </div>
        {/* Stats and Badges */}
        <div className="flex items-center justify-between text-small-title">
          <div className="flex items-center gap-6">
            <UserBadge
              label="LEVEL"
              value={steamLevel || 0}
              showCircle={true}
            />
            <UserBadge
              label="YEARS"
              value={accountYears ? accountYears : '0'}
            />
            {isDonor && <UserBadge icon="💎" label="Donor" />}
            {isPopular && <UserBadge icon="⭐" label="Popular" />}
            {isVeteran && <UserBadge icon="🗿" label="Veteran" />}
          </div>
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
