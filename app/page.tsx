import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/layout/Container';
import { HeroSection } from '@/components/home/HeroSection';
import { Table } from '@/components/home/Table';
import { colors } from '@/lib/colors';
import { GameListingData } from '@/lib/db/types';

export default function Home() {
  const mockData: GameListingData[] = [
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
    {
      user: 'yasemite',
      location: 'IT',
      platform: 'STEAM',
      games: ['#E8A642', '#3B82F6', '#EF4444'],
      offering: 5,
      postingDate: '18 days ago',
    },
  ];

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
          <Table data={mockData} />
        </Container>
      </main>
    </div>
  );
}
