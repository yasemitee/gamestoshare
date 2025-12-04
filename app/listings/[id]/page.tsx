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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    return {
      title: 'Listing Not Found - GamesToShare',
      description:
        'The requested listing could not be found or is no longer active.',
    };
  }

  return {
    title: `${listing.username || 'Anonymous User'}'s Listing - GamesToShare`,
    description: `View ${
      listing.username || 'this user'
    }'s game sharing listing on GamesToShare.`,
    keywords: [
      'game sharing',
      'steam family sharing',
      'game library sharing',
      'gaming community',
      'meet gamers',
      'share games',
      'gaming friends',
      'no registration',
    ],
    openGraph: {
      title: `${listing.username || 'Anonymous User'}'s Listing - GamesToShare`,
      description: `View ${
        listing.username || 'this user'
      }'s game sharing listing on GamesToShare.`,
      url: `https://www.gamestoshare.com/listings/${listing.id}`,
      images: [
        {
          url: 'https://www.gamestoshare.com/WebsiteBanner.jpg',
          width: 1200,
          height: 630,
          alt: 'GamesToShare Listing Details',
        },
      ],
      siteName: 'GamesToShare',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.username || 'Anonymous User'}'s Listing - GamesToShare`,
      description: `View ${
        listing.username || 'this user'
      }'s game sharing listing on GamesToShare.`,
      images: ['https://www.gamestoshare.com/WebsiteBanner.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: `https://www.gamestoshare.com/listings/${listing.id}`,
    },
  };
}

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
