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
  shareUrl?: string;
}

export function ListingUserHeader({
  username,
  showSteamId,
  avatarUrl,
  location,
  steamLevel,
  accountYears,
  isDonor = false,
  isPopular = false,
  isVeteran = false,
  shareUrl,
}: ListingUserHeaderProps) {
  const veteran = accountYears && accountYears >= 8;
  return (
    <div className="relative flex gap-4 md:gap-8">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
            backgroundColor: colors.gray2,
          }}
        />
      </div>
      {/* User Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between pr-14 md:pr-0">
        {/* User Name and Location */}
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
          <p className="text-user" style={{ color: colors.white }}>
            {showSteamId && username ? username : 'Anonymous'}
          </p>
          <img
            src={`https://flagcdn.com/w20/${location.toLowerCase()}.png`}
            alt={location}
            className="w-6 h-5"
          />
        </div>
        {/* Stats and Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-small-title gap-2 md:gap-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-6">
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
            {(isVeteran || veteran) && <UserBadge icon="⚔️" label="Veteran" />}
          </div>
          <div className="hidden md:block">
            <ActionButtons showReport={false} shareUrl={shareUrl} />
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="absolute bottom-0 right-0 md:hidden">
        <ActionButtons showReport={false} shareUrl={shareUrl} />
      </div>
    </div>
  );
}
