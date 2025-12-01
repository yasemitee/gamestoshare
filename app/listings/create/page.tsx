'use client';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { GoBackButton } from '@/components/ui/GoBackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { TermsCheckbox } from '@/components/ui/TermsCheckbox';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { GameIconsList } from '@/components/listings/GameIconsList';
import { SteamIdInput } from '@/components/listings/SteamIdInput';
import { ShowSteamIdCheckbox } from '@/components/listings/ShowSteamIdCheckbox';
import { PlatformSelector } from '@/components/listings/PlatformSelector';
import { GameSection } from '@/components/listings/GameSection';
import { VerificationModal } from '@/components/verification/VerificationModal';
import { useState } from 'react';
import { colors } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { useSteamVerification } from '@/hooks/useSteamVerification';
import { useVerification } from '@/hooks/useVerification';
import { extractCleanSteamId, normalizeSteamId } from '@/lib/steam/utils';
import { removeDuplicateGames } from '@/lib/utils/games';

export default function CreateListingPage() {
  /*
    State variables
  */
  const [steamId, setSteamId] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [steamLevel, setSteamLevel] = useState<number | null>(null);
  const [accountYears, setAccountYears] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('STEAM');
  const [lookingFor, setLookingFor] = useState<
    Array<{ id: string; name: string; iconUrl?: string; appId?: number }>
  >([]);
  const [offering, setOffering] = useState<
    Array<{ id: string; name: string; iconUrl?: string; appId?: number }>
  >([]);
  const [showSteamId, setShowSteamId] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { isSteamIdValid, isSteamIdInvalid, isVerifying, verifySteamId } =
    useSteamVerification();

  const cleanSteamId = extractCleanSteamId(steamId);

  const {
    isVerificationOpen,
    openVerification,
    closeVerification,
    confirmVerification,
  } = useVerification(cleanSteamId);

  /*
    Handlers
  */
  const handleAddGameToLookingFor = (
    game: { appId: number; name: string; iconUrl: string } | null
  ) => {
    if (!game) return;
    const isDuplicate = lookingFor.some((g) => g.appId === game.appId);
    if (!isDuplicate && lookingFor.length < 10) {
      setLookingFor((prev) => [
        ...prev,
        { id: game.appId.toString(), ...game },
      ]);
    }
  };

  const handleAddGameToOffering = (
    game: { appId: number; name: string; iconUrl: string } | null
  ) => {
    if (!game) return;
    const isDuplicate = offering.some((g) => g.appId === game.appId);
    if (!isDuplicate && offering.length < 10) {
      setOffering((prev) => [...prev, { id: game.appId.toString(), ...game }]);
    }
  };
  const handleSteamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSteamId(value);
    if (!value.trim()) {
      verifySteamId('');
    }
  };
  const handleSteamIdBlur = async () => {
    if (steamId.trim()) {
      const result = await verifySteamId(steamId);
      if (result) {
        if (result.username) {
          setUsername(result.username);
        } else {
          setUsername('');
        }
        if (result.avatarUrl) {
          setAvatarUrl(result.avatarUrl);
        } else {
          setAvatarUrl('');
        }
        if (result.location) {
          setLocation(result.location);
        } else {
          setLocation('');
        }
        setSteamLevel(result.steamLevel || null);
        setAccountYears(result.accountYears || null);

        setLookingFor([]);
        setOffering([]);

        if (result.wishlist && result.wishlist.length > 0) {
          setLookingFor(removeDuplicateGames(result.wishlist));
        }
        if (result.ownedGames && result.ownedGames.length > 0) {
          setOffering(removeDuplicateGames(result.ownedGames));
        }
      } else {
        setUsername('');
        setAvatarUrl('');
        setLocation('');
        setLookingFor([]);
        setOffering([]);
      }
    } else {
      setUsername('');
      setAvatarUrl('');
      setLocation('');
      setLookingFor([]);
      setOffering([]);
    }
  };
  const handleRemoveLookingFor = (id: string) => {
    setLookingFor((prev) => prev.filter((game) => game.id !== id));
  };
  const handleRemoveOffering = (id: string) => {
    setOffering((prev) => prev.filter((game) => game.id !== id));
  };
  const handleVerificationConfirm = async () => {
    const verified = await confirmVerification();
    if (verified) {
      setIsVerified(true);
      await createListing();
    } else {
      alert(
        'Verification failed. Please make sure "GTS" is in your Steam bio and try again.'
      );
    }
  };

  const createListing = async () => {
    setIsSubmitting(true);

    try {
      const cleanSteamId = extractCleanSteamId(steamId);
      const fullProfileUrl = normalizeSteamId(steamId);

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steamId: cleanSteamId,
          username,
          avatarUrl,
          steamLevel,
          accountYears,
          platform,
          steamProfileUrl: fullProfileUrl,
          location,
          showSteamId,
          lookingFor: lookingFor.map((game: any) => ({
            appId: game.appId,
            name: game.name,
            iconUrl: game.iconUrl,
            headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`,
            releaseYear: game.releaseYear,
            priceInCents: game.priceInCents,
          })),
          offering: offering.map((game: any) => ({
            appId: game.appId,
            name: game.name,
            iconUrl: game.iconUrl,
            headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`,
            releaseYear: game.releaseYear,
            priceInCents: game.priceInCents,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create listing');
      }

      const listing = await response.json();

      alert('Listing created successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating listing:', error);
      alert(
        `Failed to create listing: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !isSteamIdValid ||
      !location ||
      lookingFor.length === 0 ||
      offering.length === 0
    ) {
      alert(
        'Please verify your Steam ID, select a location, and add games to both Looking for and Offering sections.'
      );
      return;
    }

    openVerification();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Container>
          <Navbar />
          <MainContentContainer>
            <GoBackButton />
            <form onSubmit={handleSubmit} className="mt-14 text-white">
              {/* Steam ID */}
              <SteamIdInput
                value={steamId}
                onChange={handleSteamIdChange}
                onBlur={handleSteamIdBlur}
                isVerifying={isVerifying}
                isValid={isSteamIdValid}
                isInvalid={isSteamIdInvalid}
              />
              {/* Show steam ID */}
              <ShowSteamIdCheckbox
                checked={showSteamId}
                onChange={setShowSteamId}
              />
              {/* Location & Platform */}
              <div className="flex gap-16 my-12">
                <LocationSelector
                  value={location}
                  onChange={setLocation}
                  showLabel={true}
                />
                <PlatformSelector
                  value={platform}
                  onChange={setPlatform}
                  disabled
                />
              </div>
              {/* Looking for & Offering */}
              <div className="flex gap-8 mb-12">
                <GameSection
                  label="Looking for"
                  games={lookingFor}
                  onGameSelect={handleAddGameToLookingFor}
                  onRemove={handleRemoveLookingFor}
                  maxGames={10}
                />
                <GameSection
                  label="Offering"
                  games={offering}
                  onGameSelect={handleAddGameToOffering}
                  onRemove={handleRemoveOffering}
                  maxGames={10}
                />
              </div>
              {/* Terms and conditions */}
              <TermsCheckbox
                checked={termsAccepted}
                onChange={setTermsAccepted}
              />
              {/* Submit button */}
              <Button
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className="mx-auto block px-6 py-2.5 text-button"
              >
                {isSubmitting ? 'POSTING...' : 'POST'}
              </Button>
            </form>
          </MainContentContainer>
          <Footer />
        </Container>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={closeVerification}
        onConfirm={handleVerificationConfirm}
        steamId={cleanSteamId}
      />
    </div>
  );
}
