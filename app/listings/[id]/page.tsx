import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/db';
import { colors } from '@/lib/colors';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { ListingDetailContent } from '@/components/listings/ListingDetailContent';
import {
  sortGamesByYearAndPrice,
  getDaysSincePosting,
} from '@/lib/utils/listing';

export const revalidate = 60;

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

  // Sanitize sensitive data for anonymous users (but keep avatarUrl)
  if (!listing.showSteamId) {
    return {
      ...listing,
      steamId: '',
      steamProfileUrl: null,
      username: null,
    };
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
          <ListingDetailContent
            listing={{
              id: listing.id,
              username: listing.username,
              showSteamId: listing.showSteamId,
              avatarUrl: listing.avatarUrl,
              location: listing.location,
              steamLevel: listing.steamLevel,
              accountYears: listing.accountYears,
              description: listing.description,
            }}
            lookingForGames={lookingForGames}
            offeringGames={offeringGames}
            postingDate={postingDate}
          />
        </MainContentContainer>
      </Container>
      <Footer />
    </>
  );
}
