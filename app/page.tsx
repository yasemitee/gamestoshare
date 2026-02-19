import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { HomeContent } from '@/components/home/HomeContent';
import { GameListingData } from '@/lib/db/types';
import { prisma } from '@/lib/db/db';
import { headers } from 'next/headers';

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

// Revalidate every 60 seconds on server - reduces function invocations
// Browser will check for fresh content on manual refresh
export const revalidate = 60;
export const fetchCache = 'default-cache';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
}

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
    orderBy: {
      createdAt: 'desc',
    },
    take: 30,
  });

  const tableData: GameListingData[] = listings.map((listing) => {
    const allGames = listing.games || [];

    const lookingForGames = allGames
      .filter((lg) => lg.type === 'LOOKING_FOR')
      .map((lg) => ({
        iconUrl: lg.game?.iconUrl || '',
        name: lg.game?.name || '',
      }));

    const offeringGames = allGames
      .filter((lg) => lg.type === 'OFFERING')
      .map((lg) => ({
        iconUrl: lg.game?.iconUrl || '',
        name: lg.game?.name || '',
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
    };
  });

  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        <HomeContent listings={tableData} />
      </MainContentContainer>
    </Container>
  );
}
