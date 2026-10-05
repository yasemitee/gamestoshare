import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { HomeContent } from '@/components/home/HomeContent';
import { GameListingData, TopLocationData } from '@/lib/db/types';
import { prisma } from '@/lib/db/db';
import { MAX_LISTINGS_PER_PAGE } from '@/lib/constants';
import { getFeedGames, type FeedGameRow } from '@/lib/db/feed';
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
  const [listings, totalCount, topLocationsRaw] = await Promise.all([
    prisma.listing.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: MAX_LISTINGS_PER_PAGE + 1,
    }),
    prisma.listing.count({ where: { isActive: true } }),
    prisma.listing.groupBy({
      by: ['location'],
      where: { isActive: true },
      _count: { location: true },
      orderBy: { _count: { location: 'desc' } },
      take: 5,
    }),
  ]);

  const topLocations: TopLocationData[] = topLocationsRaw.map((loc) => ({
    code: loc.location,
    count: loc._count.location,
  }));

  const hasMore = listings.length > MAX_LISTINGS_PER_PAGE;
  const pageItems = hasMore
    ? listings.slice(0, MAX_LISTINGS_PER_PAGE)
    : listings;
  const nextCursor = hasMore
    ? (pageItems[pageItems.length - 1]?.id ?? null)
    : null;

  const feedGames = await getFeedGames(pageItems.map((l) => l.id));

  const tableData: GameListingData[] = pageItems.map((listing) => {
    const games = feedGames.get(listing.id);
    const toFeedGame = (g: FeedGameRow) => ({
      iconUrl: g.iconUrl || '',
      name: g.name,
      appId: g.steamAppId,
      headerImage: g.headerImage ?? undefined,
    });

    return {
      id: listing.id,
      user: listing.showSteamId ? listing.username || listing.steamId : null,
      // Anonymous listings must not ship their Steam ID in the page HTML.
      steamId: listing.showSteamId ? listing.steamId : '',
      showSteamId: listing.showSteamId,
      location: listing.location,
      platform: listing.platform,
      lookingFor: (games?.lookingFor ?? []).map(toFeedGame),
      offering: (games?.offering ?? []).map(toFeedGame),
      lookingForTotal: games?.lookingForTotal ?? 0,
      offeringTotal: games?.offeringTotal ?? 0,
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
          initialTotalCount={totalCount}
          initialTopLocations={topLocations}
        />
      </MainContentContainer>
    </Container>
  );
}
