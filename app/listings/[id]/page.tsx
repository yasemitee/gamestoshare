import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/db';
import { colors } from '@/lib/colors';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { ActionButtons } from '@/components/listings/ActionButtons';
import { Navbar } from '@/components/layout/Navbar';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { GamesList } from '@/components/listings/GamesList';
import { FriendRequestSection } from '@/components/listings/FriendRequestSection';

interface ListingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: {
      id: id,
    },
    include: {
      games: {
        include: {
          game: true,
        },
      },
    },
  });

  if (!listing || !listing.isActive || listing.expiresAt <= new Date()) {
    return null;
  }

  return listing;
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  const sortGamesByYearAndPrice = (games: any[]) => {
    return games.sort((a, b) => {
      const yearA = a.releaseYear ?? 0;
      const yearB = b.releaseYear ?? 0;
      const priceA = a.priceInCents ?? 0;
      const priceB = b.priceInCents ?? 0;

      if (yearB !== yearA) {
        return yearB - yearA;
      }

      return priceB - priceA;
    });
  };

  const lookingForGames = sortGamesByYearAndPrice(
    listing.games.filter((lg) => lg.type === 'LOOKING_FOR').map((lg) => lg.game)
  );

  const offeringGames = sortGamesByYearAndPrice(
    listing.games.filter((lg) => lg.type === 'OFFERING').map((lg) => lg.game)
  );

  const daysSincePosting = Math.floor(
    (Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const postingDate = `${daysSincePosting} day${
    daysSincePosting !== 1 ? 's' : ''
  } ago`;

  console.log('Listing data:', {
    steamLevel: listing.steamLevel,
    accountYears: listing.accountYears,
  });

  return (
    <>
      <Container>
        <Navbar />
        <MainContentContainer>
          <div className="">
            {/* Go Back Button */}
            <div className="mb-14">
              <GoBackButton />
            </div>
            {/* Main Content */}
            <div className="flex flex-col">
              {/* Top Section - Avatar and User Info */}
              <div className="flex gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className="w-20 h-20 bg-cover bg-center"
                    style={{
                      backgroundImage: listing.avatarUrl
                        ? `url(${listing.avatarUrl})`
                        : 'none',
                      backgroundColor: colors.gray2,
                    }}
                  />
                </div>
                {/* User Details */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* User Name and Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-user" style={{ color: colors.white }}>
                      {listing.showSteamId && listing.username
                        ? listing.username
                        : 'Anonymous'}
                    </h1>
                    {/* Location Flag */}
                    <img
                      src={`https://flagcdn.com/w20/${listing.location.toLowerCase()}.png`}
                      alt={listing.location}
                      className="w-6 h-5"
                    />
                  </div>
                  {/* Stats */}
                  <div className="flex items-center justify-between text-small-title">
                    <div className="flex items-center gap-6">
                      {/* Level Badge */}
                      <div
                        className="flex items-center gap-2"
                        style={{ color: colors.white }}
                      >
                        <span className="text-small-title">LEVEL</span>
                        <div
                          className="rounded-full flex items-center justify-center text-small-title p-1"
                          style={{
                            backgroundColor: colors.purple,
                            color: colors.black,
                          }}
                        >
                          {listing.steamLevel || 0}
                        </div>
                      </div>
                      {/* Years Badge */}
                      <div className="flex items-center">
                        <span style={{ color: colors.purple }}>
                          {listing.accountYears
                            ? listing.accountYears.toFixed(1)
                            : '0.0'}
                        </span>
                        <span>&nbsp;</span>
                        <span style={{ color: colors.white }}>YEARS</span>
                      </div>
                      {/* Donor Badge */}
                      <div className="flex items-center gap-2">
                        <span className="" style={{ color: colors.purple }}>
                          💎 Donor
                        </span>
                      </div>
                      {/* Popular Badge */}
                      <div className="flex items-center gap-2">
                        <span className="" style={{ color: colors.purple }}>
                          ⭐ Popular
                        </span>
                      </div>
                      {/* Veteran Badge */}
                      <div className="flex items-center gap-2">
                        <span className="" style={{ color: colors.purple }}>
                          🗿 Veteran
                        </span>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <ActionButtons />
                  </div>
                </div>
              </div>
              {/* Divider */}
              <div
                className="mt-5 mb-12"
                style={{ borderTop: `1px solid ${colors.gray2}` }}
              />
              {/* Content Section: Description | Games */}
              <div className="grid grid-cols-2">
                {/* Left: Description */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <p
                      className="text-small-title"
                      style={{ color: colors.white }}
                    >
                      DESCRIPTION
                    </p>
                    <span
                      className="text-field-small"
                      style={{ color: colors.gray1 }}
                    >
                      {postingDate}
                    </span>
                  </div>
                  <p
                    className="text-field-small"
                    style={{ color: colors.gray1 }}
                  >
                    {listing.description || 'No description provided.'}
                  </p>
                </div>
                {/* Right: Games Section */}
                <div className="grid grid-cols-2 gap-8 mb-30">
                  <GamesList title="LOOKING FOR" games={lookingForGames} />
                  <GamesList title="OFFERING" games={offeringGames} />
                </div>
              </div>
            </div>
          </div>
          {/* Friend Request Section */}
          <FriendRequestSection
            listingId={listing.id}
            username={listing.username}
          />
        </MainContentContainer>
      </Container>
      <Footer />
    </>
  );
}
