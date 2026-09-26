'use client';
import { Container } from '@/components/layout/Container';
import { MOTION } from '@/lib/constants';
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
import { PlatformSelector } from '@/components/listings/PlatformSelector';
import { GameSection } from '@/components/listings/GameSection';
import { FieldError } from '@/components/ui/FieldError';
import { DescriptionTextarea } from '@/components/listings/DescriptionTextarea';
import { VerificationModal } from '@/components/verification/VerificationModal';
import { useState, useEffect, Suspense } from 'react';
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

type GameEntry = { id: string; name: string; iconUrl?: string; appId?: number };

function CreateListingPageInner() {
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
  const [lookingFor, setLookingFor] = useState<GameEntry[]>([]);
  const [offering, setOffering] = useState<GameEntry[]>([]);
  // Where the current game lists came from, for the hint above each grid.
  const [gamesSource, setGamesSource] = useState<string | undefined>();
  // New posts always show the Steam name. Listings created while the
  // anonymous option existed keep their setting when edited.
  const [showSteamId, setShowSteamId] = useState(true);
  const [description, setDescription] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  // Errors appear after the first submit attempt (or, for the Steam ID, once
  // a lookup fails) and clear as soon as the field is fixed.
  const [attempted, setAttempted] = useState(false);
  const { isSteamIdValid, isSteamIdInvalid, isVerifying, verifySteamId } =
    useSteamVerification();

  const searchParams = useSearchParams();
  const router = useRouter();
  const editListingId = searchParams.get('edit');
  // Set once an edit session is confirmed by a manage token. Saving with the
  // original Steam profile skips bio verification, since the token already
  // proves ownership.
  const [editSession, setEditSession] = useState<{
    token: string;
    steamProfileUrl: string;
  } | null>(null);

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

      setEditSession({
        token: cached.token,
        steamProfileUrl: listing.steamProfileUrl,
      });
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
      setGamesSource('From your listing');

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
      // Newest first, so the added game lands where the user is looking.
      setLookingFor((prev) => [
        { id: game.appId.toString(), ...game },
        ...prev,
      ]);
    }
  };

  const handleAddGameToOffering = (
    game: { appId: number; name: string; iconUrl: string } | null,
  ) => {
    if (!game) return;
    const isDuplicate = offering.some((g) => g.appId === game.appId);
    if (!isDuplicate) {
      setOffering((prev) => [{ id: game.appId.toString(), ...game }, ...prev]);
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
        setGamesSource('Imported from Steam');

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
  const removeGame = (
    list: GameEntry[],
    setList: React.Dispatch<React.SetStateAction<GameEntry[]>>,
    id: string,
  ) => {
    const index = list.findIndex((game) => game.id === id);
    if (index === -1) return;
    const removed = list[index];
    setList((prev) => prev.filter((game) => game.id !== id));

    // One toast id: a new removal replaces the previous Undo.
    toast(
      (t) => (
        <span className="flex items-center gap-4">
          <span>
            Removed{' '}
            <span style={{ color: colors.white }}>{removed.name}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setList((prev) =>
                prev.some((game) => game.id === removed.id)
                  ? prev
                  : [
                      ...prev.slice(0, index),
                      removed,
                      ...prev.slice(index),
                    ],
              );
              toast.dismiss(t.id);
            }}
            className="uppercase cursor-pointer transition-colors hover:!text-white"
            style={{
              color: colors.purple,
              fontSize: 11,
              letterSpacing: '.08em',
              borderBottom: `1px solid ${colors.purple}`,
              paddingBottom: 2,
            }}
          >
            Undo
          </button>
        </span>
      ),
      {
        id: 'game-removed',
        duration: 5000,
        style: {
          background: colors.gray3,
          color: colors.gray1,
          borderRadius: '0',
          fontSize: '12px',
        },
      },
    );
  };
  const handleRemoveLookingFor = (id: string) =>
    removeGame(lookingFor, setLookingFor, id);
  const handleRemoveOffering = (id: string) =>
    removeGame(offering, setOffering, id);
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
            background: colors.gray3,
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
      const isEditing = editSession?.steamProfileUrl === steamId;

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isEditing && { Authorization: `Bearer ${editSession.token}` }),
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
        throw new Error(
          errorData.code === 'LISTING_EXISTS'
            ? 'You already have a listing. Edit it from "Manage your listing".'
            : errorData.error || 'Failed to create listing'
        );
      }

      toast.success(isEditing ? 'Listing updated!' : 'Listing created successfully!', {
        duration: 4000,
        style: {
          background: colors.gray3,
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
            background: colors.gray3,
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
    setAttempted(true);

    if (
      !isSteamIdValid ||
      !location ||
      !termsAccepted ||
      lookingFor.length === 0 ||
      offering.length === 0
    ) {
      // Bring the first message into view; it may be far above the button.
      requestAnimationFrame(() =>
        document
          .querySelector('[data-field-error]')
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
      );
      return;
    }

    if (editSession?.steamProfileUrl === steamId) {
      await createListing();
      return;
    }

    openVerification();
  };

  const steamIdError = isSteamIdInvalid
    ? 'We couldn’t find that Steam account. Check the ID or link.'
    : attempted && !isSteamIdValid && !isVerifying
      ? steamId.trim()
        ? 'Press Enter to look up this Steam account.'
        : 'Enter your Steam ID or profile link.'
      : undefined;
  const locationError =
    attempted && !location
      ? 'Choose your country. Steam Family members must share a store region.'
      : undefined;
  const wishlistError =
    attempted && lookingFor.length === 0
      ? 'Add at least one game you want.'
      : undefined;
  const libraryError =
    attempted && offering.length === 0
      ? 'Add at least one game you own.'
      : undefined;
  const termsError =
    attempted && !termsAccepted ? 'Accept the terms to post.' : undefined;
  const isEditingOwnListing = editSession?.steamProfileUrl === steamId;

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <div className="flex-1">
        <Container>
          <Navbar />
          <MainContentContainer>
            <GoBackButton />
            <motion.form
              initial={{ opacity: 0, y: MOTION.rise }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0 }}
              onSubmit={handleSubmit}
              className="mt-14 text-white"
            >
              {/* Main Grid */}
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Left Column */}
                <motion.div
                  initial={{ opacity: 0, y: MOTION.rise }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.05 }}
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
                    error={steamIdError}
                  />
                  {/* Location & Platform */}
                  <div className="flex gap-8 md:gap-16 mt-6">
                    <LocationSelector
                      value={location}
                      onChange={setLocation}
                      showLabel={true}
                      width="100px"
                      hasError={!!locationError}
                    />
                    <PlatformSelector
                      value={platform}
                      onChange={setPlatform}
                      disabled
                    />
                  </div>
                  {locationError && (
                    <FieldError message={locationError} />
                  )}
                </motion.div>

                {/* Right Column - Description */}
                <motion.div
                  initial={{ opacity: 0, y: MOTION.rise }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.1 }}
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
                initial={{ opacity: 0, y: MOTION.rise }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION.duration, ease: MOTION.ease, delay: 0.15 }}
                className="flex flex-col md:flex-row gap-8 mb-12"
              >
                <GameSection
                  label="Wishlist"
                  games={lookingFor}
                  onGameSelect={handleAddGameToLookingFor}
                  onRemove={handleRemoveLookingFor}
                  maxGames={10}
                  addPlaceholder="Add a game you want"
                  source={gamesSource}
                  error={wishlistError}
                />
                <GameSection
                  label="Library"
                  games={offering}
                  onGameSelect={handleAddGameToOffering}
                  onRemove={handleRemoveOffering}
                  maxGames={10}
                  addPlaceholder="Add a game you own"
                  source={gamesSource}
                  error={libraryError}
                />
              </motion.div>
              {/* Terms and conditions */}
              <div className="mt-32">
                <TermsCheckbox
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  hasError={!!termsError}
                />
                {termsError && (
                  <div className="flex justify-center -mt-5 mb-8">
                    <FieldError message={termsError} />
                  </div>
                )}
                {/* Submit button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glow-hover press text-button px-6 py-2.5 cursor-pointer disabled:cursor-not-allowed"
                    style={{
                      background: isSubmitting ? colors.gray2 : gradients.main,
                      color: isSubmitting ? colors.gray1 : colors.black,
                      opacity: isSubmitting ? 0.5 : 1,
                    }}
                  >
                    {isSubmitting
                      ? isEditingOwnListing
                        ? 'SAVING…'
                        : 'POSTING…'
                      : isEditingOwnListing
                        ? 'SAVE CHANGES'
                        : 'POST'}
                  </button>
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

export default function CreateListingPage() {
  return (
    <Suspense fallback={null}>
      <CreateListingPageInner />
    </Suspense>
  );
}
