'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { Button } from '@/components/ui/Button';
import { ManageAccessModal } from '@/components/verification/ManageAccessModal';
import { ManageListingPanel } from '@/components/listings/ManageListingPanel';
import { Toaster } from 'react-hot-toast';

export default function ManageListingPage() {
  const router = useRouter();
  const [verified, setVerified] = useState<{
    token: string;
    listing: any;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <div className="flex-1">
        <Container>
          <Navbar />
          <MainContentContainer>
            <GoBackButton />
            <div className="mt-14 text-white">
              <h1 className="mb-8">Manage your listing</h1>
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
                  <p className="mb-6">
                    Verify your Steam profile to manage your listing.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Verify your Steam profile
                  </Button>
                </div>
              )}
            </div>
          </MainContentContainer>
          <Footer />
        </Container>
      </div>

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
