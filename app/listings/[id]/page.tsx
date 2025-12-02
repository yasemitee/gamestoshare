import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/db';
import { colors } from '@/lib/colors';
import { GoBackButton } from '@/components/ui/GoBackButton';

// Cache listing pages for 60 seconds to reduce database queries
export const revalidate = 60;
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { GamesList } from '@/components/listings/GamesList';
import { FriendRequestSection } from '@/components/listings/FriendRequestSection';
import { ListingUserHeader } from '@/components/listings/ListingUserHeader';
import {
  sortGamesByYearAndPrice,
  getDaysSincePosting,
} from '@/lib/utils/listing';

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

  const lookingForGames = sortGamesByYearAndPrice(
    listing.games.filter((lg) => lg.type === 'LOOKING_FOR').map((lg) => lg.game)
  );

  const offeringGames = sortGamesByYearAndPrice(
    listing.games.filter((lg) => lg.type === 'OFFERING').map((lg) => lg.game)
  );

  const postingDate = getDaysSincePosting(new Date(listing.createdAt));

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
              <ListingUserHeader
                username={listing.username}
                showSteamId={listing.showSteamId}
                avatarUrl={listing.avatarUrl}
                location={listing.location}
                steamLevel={listing.steamLevel}
                accountYears={listing.accountYears}
              />
              {/* Divider */}
              <div
                style={{
                  borderTop: `1px solid ${colors.gray2}`,
                }}
                className="mt-5 mb-13"
              />
              {/* Content Section: Description | Games */}
              <div className="grid grid-cols-2 gap-22">
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
