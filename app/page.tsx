import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/layout/Container';
import { HeroSection } from '@/components/home/HeroSection';
import { Table } from '@/components/home/Table';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';
import { prisma } from '@/lib/db/db';

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
      expiresAt: {
        gt: new Date(),
      },
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
    take: 50,
  });

  const tableData: GameListingData[] = listings.map((listing) => {
    const lookingForGames = listing.games
      .filter((lg) => lg.type === 'LOOKING_FOR')
      .map((lg) => ({
        iconUrl: lg.game.iconUrl || '',
        name: lg.game.name,
      }));

    const offeringGames = listing.games
      .filter((lg) => lg.type === 'OFFERING')
      .map((lg) => ({
        iconUrl: lg.game.iconUrl || '',
        name: lg.game.name,
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
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${colors.black} 0%, ${colors.gray3} 100%)`,
      }}
    >
      <Navbar />
      <main className="pt-32 pb-16">
        <Container>
          <HeroSection />
          <Table data={tableData} />
        </Container>
      </main>
    </div>
  );
}
