'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { Button } from '@/components/ui/Button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ManageAccessModal } from '@/components/verification/ManageAccessModal';
import { ManageListingPanel } from '@/components/listings/ManageListingPanel';
import { Toaster } from 'react-hot-toast';
import { colors } from '@/lib/colors';
import { GradientTitle } from '@/components/ui/GradientTitle';
import { MANAGE_ENABLED } from '@/lib/featureFlags';

export default function ManageListingPage() {
  const router = useRouter();
  const [verified, setVerified] = useState<{
    token: string;
    listing: any;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(MANAGE_ENABLED);

  if (!MANAGE_ENABLED) {
    return (
      <div className="min-h-screen flex flex-col">
        <Container className="flex-1">
          <Navbar />
          <MainContentContainer>
            <GoBackButton />
            <div className="mt-14 text-white">
              <h1 className="mb-6">Work in progress</h1>
              <p className="text-field mb-2" style={{ color: colors.gray1 }}>
                Managing your listing is coming soon.
              </p>
              <p className="text-field mb-8" style={{ color: colors.gray1 }}>
                In the meantime, to remove your post write in the{' '}
                <span style={{ color: colors.white }}>#delete</span> channel on
                our Discord server.
              </p>
              <AnimatedButton
                href="https://discord.gg/mavhKaDRCv"
                className="inline-flex items-center gap-1.5 text-button"
              >
                <img src="/Discord.svg" alt="" width={16} height={16} />
                <span className="text-button">ASK ON DISCORD</span>
              </AnimatedButton>
            </div>
          </MainContentContainer>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <div className="flex-1">
        <Container>
          <Navbar />
          <MainContentContainer>
            <GoBackButton />
            <div className="mt-14 text-white">
              <GradientTitle className="mb-8">Manage your listing</GradientTitle>
              {verified ? (
                <ManageListingPanel
                  listing={verified.listing}
                  token={verified.token}
                  onDeleted={() => {
                    router.push('/');
                  }}
                />
              ) : (
                <div>
                  <p
                    className="text-field mb-8 max-w-[60ch]"
                    style={{ color: colors.gray1, lineHeight: '24px' }}
                  >
                    To edit or delete your listing, prove the Steam account is
                    yours: we give you a one-time code to add to your Steam
                    bio.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    START VERIFICATION
                  </Button>
                </div>
              )}
            </div>
          </MainContentContainer>
        </Container>
      </div>
      <Footer />

      <ManageAccessModal
        isOpen={isModalOpen && !verified}
        onClose={() => setIsModalOpen(false)}
        onVerified={({ token, listing }) => {
          setVerified({ token, listing });
        }}
      />
    </div>
  );
}
