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
import { DescriptionTextarea } from '@/components/listings/DescriptionTextarea';
import { VerificationModal } from '@/components/verification/VerificationModal';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { colors, gradients } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { useSteamVerification } from '@/hooks/useSteamVerification';
import { useVerification } from '@/hooks/useVerification';
import { extractCleanSteamId, normalizeSteamId } from '@/lib/steam/utils';
import { removeDuplicateGames } from '@/lib/utils/games';
import { getManageToken } from '@/lib/utils/manageStorage';
import { motion } from 'motion/react';
import {
  setupGlobalErrorHandlers,
  cleanupGlobalErrorHandlers,
} from '@/lib/utils/errors';

export default function CreateListingPage() {
  // Setup global error handlers for compatibility
  useEffect(() => {
    setupGlobalErrorHandlers();
    return () => {
      cleanupGlobalErrorHandlers();
    };
  }, []);
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
  const [showSteamId, setShowSteamId] = useState(true);
  const [description, setDescription] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const { isSteamIdValid, isSteamIdInvalid, isVerifying, verifySteamId } =
    useSteamVerification();

  const searchParams = useSearchParams();
  const router = useRouter();
  const editListingId = searchParams.get('edit');

  useEffect(() => {
    if (!editListingId) return;

    const cached = getManageToken(editListingId);
    if (!cached) {
      router.replace(`/listings/manage`);
      return;
    }

    (async () => {
      const response = await fetch('/api/listings/manage', {
        headers: { Authorization: `Bearer ${cached.token}` },
      });

      if (!response.ok) {
        router.replace('/listings/manage');
        return;
      }

      const { listing } = await response.json();

      setSteamId(listing.steamProfileUrl);
      const result = await verifySteamId(listing.steamProfileUrl);

      setDescription(listing.description || '');
      setLocation(listing.location);
      setPlatform(listing.platform);
      setShowSteamId(listing.showSteamId);

      const existingLookingFor = listing.games
        .filter((g: any) => g.type === 'LOOKING_FOR')
        .map((g: any) => ({
          id: g.game.steamAppId.toString(),
          name: g.game.name,
          iconUrl: g.game.iconUrl,
          appId: g.game.steamAppId,
        }));
      const existingOffering = listing.games
        .filter((g: any) => g.type === 'OFFERING')
        .map((g: any) => ({
          id: g.game.steamAppId.toString(),
          name: g.game.name,
          iconUrl: g.game.iconUrl,
          appId: g.game.steamAppId,
        }));

      setLookingFor(existingLookingFor);
      setOffering(existingOffering);

      if (result?.username) setUsername(result.username);
      if (result?.avatarUrl) setAvatarUrl(result.avatarUrl);
      setSteamLevel(result?.steamLevel || null);
      setAccountYears(result?.accountYears || null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editListingId]);

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
    game: { appId: number; name: string; iconUrl: string } | null,
  ) => {
    if (!game) return;
    const isDuplicate = lookingFor.some((g) => g.appId === game.appId);
    if (!isDuplicate) {
      setLookingFor((prev) => [
        ...prev,
        { id: game.appId.toString(), ...game },
      ]);
    }
  };

  const handleAddGameToOffering = (
    game: { appId: number; name: string; iconUrl: string } | null,
  ) => {
    if (!game) return;
    const isDuplicate = offering.some((g) => g.appId === game.appId);
    if (!isDuplicate) {
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

  const handleSteamIdKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' && steamId.trim()) {
      e.preventDefault();
      await handleSteamIdBlur();
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
      toast.error(
        <div>
          <div style={{ color: colors.white }}>Verification failed</div>
          <div style={{ color: colors.gray1 }}>
            Please make sure "GTS" is in your steam bio and try again.
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: colors.blue1,
            borderRadius: '0',
            fontSize: '12px',
            textAlign: 'left',
            textTransform: 'none',
          },
        },
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
          description,
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

      toast.success('Listing created successfully!', {
        duration: 4000,
        style: {
          background: colors.blue1,
          color: colors.white,
          borderRadius: '0',
          fontSize: '12px',
          textTransform: 'none',
        },
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(
        <div>
          <div style={{ color: colors.white }}>Failed to create listing</div>
          <div style={{ color: colors.gray1 }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: colors.blue1,
            borderRadius: '0',
            fontSize: '12px',
            textTransform: 'none',
          },
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasError(false);
    setLocationError(false);
    setTermsError(false);

    let hasValidationError = false;

    if (!isSteamIdValid) {
      setHasError(true);
      hasValidationError = true;
    }

    if (!location) {
      setLocationError(true);
      hasValidationError = true;
    }

    if (!termsAccepted) {
      setTermsError(true);
      hasValidationError = true;
    }

    if (lookingFor.length === 0 || offering.length === 0) {
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    openVerification();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <div className="flex-1">
        <Container>
          <Navbar />
          <MainContentContainer>
            <GoBackButton />
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="mt-14 text-white"
            >
              {/* Main Grid */}
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Left Column */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Steam ID */}
                  <SteamIdInput
                    value={steamId}
                    onChange={handleSteamIdChange}
                    onBlur={handleSteamIdBlur}
                    onKeyDown={handleSteamIdKeyDown}
                    isVerifying={isVerifying}
                    isValid={isSteamIdValid}
                    isInvalid={isSteamIdInvalid}
                    hasError={hasError}
                  />
                  {/* Show steam ID */}
                  <ShowSteamIdCheckbox
                    checked={showSteamId}
                    onChange={setShowSteamId}
                  />
                  {/* Location & Platform */}
                  <div className="flex gap-8 md:gap-16 mt-6">
                    <LocationSelector
                      value={location}
                      onChange={setLocation}
                      showLabel={true}
                      width="100px"
                      hasError={locationError}
                    />
                    <PlatformSelector
                      value={platform}
                      onChange={setPlatform}
                      disabled
                    />
                  </div>
                </motion.div>

                {/* Right Column - Description */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex-1 md:mt-0 mt-6"
                >
                  <DescriptionTextarea
                    value={description}
                    onChange={setDescription}
                  />
                </motion.div>
              </div>
              {/* Wishlist & Library */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col md:flex-row gap-8 mb-12"
              >
                <GameSection
                  label="Wishlist"
                  games={lookingFor}
                  onGameSelect={handleAddGameToLookingFor}
                  onRemove={handleRemoveLookingFor}
                  maxGames={10}
                />
                <GameSection
                  label="Library"
                  games={offering}
                  onGameSelect={handleAddGameToOffering}
                  onRemove={handleRemoveOffering}
                  maxGames={10}
                />
              </motion.div>
              {/* Terms and conditions */}
              <div className="mt-32">
                <TermsCheckbox
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  hasError={termsError}
                />
                {/* Submit button */}
                <div className="flex justify-center">
                  <motion.button
                    type="submit"
                    disabled={!termsAccepted || isSubmitting}
                    whileHover={{
                      boxShadow:
                        '0 0 20px rgba(195, 194, 245, 0.6), 0 0 40px rgba(195, 194, 245, 0.3)',
                      filter: 'brightness(1.1)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="text-button px-6 py-2.5 cursor-pointer"
                    style={{
                      background:
                        !termsAccepted || isSubmitting
                          ? colors.gray2
                          : gradients.main,
                      color:
                        !termsAccepted || isSubmitting
                          ? colors.gray1
                          : colors.black,
                      opacity: !termsAccepted || isSubmitting ? 0.5 : 1,
                    }}
                  >
                    {isSubmitting ? 'POSTING...' : 'POST'}
                  </motion.button>
                </div>
              </div>
            </motion.form>
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
