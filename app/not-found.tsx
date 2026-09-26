import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { colors, gradients } from '@/lib/colors';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Container className="flex-1 w-full">
        <Navbar />
        <MainContentContainer>
          <div className="mt-20 md:mt-28 max-w-xl">
            <GradientTitle className="mb-6">Nothing to share here</GradientTitle>
            <p
              className="text-field mb-10"
              style={{ color: colors.gray1, lineHeight: '24px' }}
            >
              This page doesn’t exist, or the listing was removed by its
              owner. Other players are still looking for a match.
            </p>
            <Link
              href="/"
              className="inline-block text-button px-6 py-2.5 transition-opacity hover:opacity-90"
              style={{ background: gradients.main, color: colors.black }}
            >
              BROWSE LISTINGS
            </Link>
          </div>
        </MainContentContainer>
      </Container>
      <Footer />
    </div>
  );
}
