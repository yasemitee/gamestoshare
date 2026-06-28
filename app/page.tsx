import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { HomeContent } from '@/components/home/HomeContent';
import { GameListingData } from '@/lib/db/types';
import { prisma } from '@/lib/db/db';
import { MAX_LISTINGS_PER_PAGE } from '@/lib/constants';
import { formatTimeAgo } from '@/lib/utils/time';

export const metadata = {
  title: 'Home - GamesToShare',
  description:
    'Discover gamers to share your Steam library with on GamesToShare. Find and connect with fellow gamers for seamless game sharing experiences.',
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
    title: 'Home - GamesToShare',
    description:
      'Discover gamers to share your Steam library with on GamesToShare. Find and connect with fellow gamers for seamless game sharing experiences.',
    url: 'https://www.gamestoshare.com/',
    images: [
      {
        url: 'https://www.gamestoshare.com/WebsiteBanner.jpg',
        width: 1200,
        height: 630,
        alt: 'GamesToShare Home',
      },
    ],
    siteName: 'GamesToShare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home - GamesToShare',
    description:
      'Discover gamers to share your Steam library with on GamesToShare. Find and connect with fellow gamers for seamless game sharing experiences.',
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
    canonical: 'https://www.gamestoshare.com/',
  },
};

export const revalidate = false;
export const fetchCache = 'default-cache';

export default async function Home() {
  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
    },
    include: {
      games: {
        include: {
          game: true,
        },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: MAX_LISTINGS_PER_PAGE + 1,
  });

  const hasMore = listings.length > MAX_LISTINGS_PER_PAGE;
  const pageItems = hasMore
    ? listings.slice(0, MAX_LISTINGS_PER_PAGE)
    : listings;
  const nextCursor = hasMore
    ? (pageItems[pageItems.length - 1]?.id ?? null)
    : null;

  const tableData: GameListingData[] = pageItems.map((listing) => {
    const allGames = listing.games || [];

    const lookingForGames = allGames
      .filter((lg) => lg.type === 'LOOKING_FOR')
      .map((lg) => ({
        iconUrl: lg.game?.iconUrl || '',
        name: lg.game?.name || '',
        appId: lg.game?.steamAppId ?? undefined,
        headerImage: lg.game?.headerImage ?? undefined,
      }));

    const offeringGames = allGames
      .filter((lg) => lg.type === 'OFFERING')
      .map((lg) => ({
        iconUrl: lg.game?.iconUrl || '',
        name: lg.game?.name || '',
        appId: lg.game?.steamAppId ?? undefined,
        headerImage: lg.game?.headerImage ?? undefined,
      }));

    return {
      id: listing.id,
      user: listing.showSteamId ? listing.username || listing.steamId : null,
      steamId: listing.steamId,
      showSteamId: listing.showSteamId,
      location: listing.location,
      platform: listing.platform,
      lookingFor: lookingForGames,
      offering: offeringGames,
      postingDate: formatTimeAgo(listing.createdAt),
      avatarUrl: listing.avatarUrl ?? null,
      level: listing.steamLevel ?? null,
      years: listing.accountYears ?? null,
    };
  });

  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        <HomeContent
          initialListings={tableData}
          initialNextCursor={nextCursor}
        />
      </MainContentContainer>
    </Container>
  );
}
