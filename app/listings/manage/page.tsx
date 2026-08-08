'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { ManageAccessModal } from '@/components/verification/ManageAccessModal';
import { ManageListingPanel } from '@/components/listings/ManageListingPanel';
import { Toaster } from 'react-hot-toast';

export default function ManageListingPage() {
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
                    window.location.href = '/';
                  }}
                />
              ) : (
                <p>Verify your Steam profile to manage your listing.</p>
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
