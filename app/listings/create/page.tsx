'use client';
import { Container } from '@/components/layout/Container';
import { MainContentContainer } from '@/components/layout/MainContentContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { GameIconsList } from '@/components/listings/GameIconsList';
import { useState } from 'react';
import { colors } from '@/lib/colors';
import { COUNTRIES } from '@/lib/countries';
import { useSteamVerification } from '@/hooks/useSteamVerification';
import { extractCleanSteamId, normalizeSteamId } from '@/lib/steam/utils';

export default function CreateListingPage() {
  /*
    State variables
  */
  const [steamId, setSteamId] = useState('');
  const [username, setUsername] = useState('');
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
  const { isSteamIdValid, isVerifying, verifySteamId } = useSteamVerification();

  /*
    Handlers
  */
  const handleSteamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSteamId(value);
  };
  const handleSteamIdBlur = async () => {
    if (steamId.trim()) {
      const result = await verifySteamId(steamId);
      if (result) {
        if (result.username) {
          setUsername(result.username);
        }
        if (result.location) {
          setLocation(result.location);
        }
        if (result.wishlist) {
          setLookingFor(result.wishlist);
        }
        if (result.ownedGames) {
          setOffering(result.ownedGames);
        }
      } else {
        setUsername('');
        setLocation('');
        setLookingFor([]);
        setOffering([]);
      }
    }
  };
  const handleRemoveLookingFor = (id: string) => {
    setLookingFor((prev) => prev.filter((game) => game.id !== id));
  };
  const handleRemoveOffering = (id: string) => {
    setOffering((prev) => prev.filter((game) => game.id !== id));
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
          platform,
          steamProfileUrl: fullProfileUrl,
          location,
          showSteamId,
          lookingFor: lookingFor.map((game) => ({
            appId: game.appId,
            name: game.name,
            iconUrl: game.iconUrl,
          })),
          offering: offering.map((game) => ({
            appId: game.appId,
            name: game.name,
            iconUrl: game.iconUrl,
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

  return (
    <Container>
      <Navbar />
      <MainContentContainer>
        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center text-sm text-gray-300 hover:text-white"
        >
          <span className="mr-2">←</span>
          Go back
        </button>
        <form onSubmit={handleSubmit} className="mt-14 text-white">
          {/* Steam ID */}
          <div className="mb-6">
            <label className="pb-8 block text-field">Steam ID</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={steamId}
                onChange={handleSteamIdChange}
                onBlur={handleSteamIdBlur}
                placeholder="Your Steam ID"
                className="flex-1 py-2 focus:outline-none border-b border-white text-field bg-transparent"
                style={{
                  caretColor: colors.gray2,
                }}
              />
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {isVerifying ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ color: colors.purple }}
                  ></div>
                ) : isSteamIdValid ? (
                  <img
                    src="/SuccessfulCheck.svg"
                    alt="Verified"
                    className="w-5 h-5"
                  />
                ) : null}
              </div>
            </div>
          </div>
          {/* Show steam ID */}
          <div className="mb-6" style={{ color: colors.gray1 }}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSteamId}
                onChange={(e) => setShowSteamId(e.target.checked)}
                className="w-5 h-5 border-2 appearance-none checked:bg-transparent cursor-pointer flex-shrink-0"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.purple,
                  backgroundImage: showSteamId
                    ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${encodeURIComponent(
                        colors.purple
                      )}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                    : 'none',
                }}
              />
              <span className="text-field-small">
                Show my Steam ID on my post
              </span>
            </label>
          </div>
          {/* Location & Platform */}
          <div className="flex gap-16 my-12">
            <div>
              <label className="block mb-6 text-field">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-4 text-small-title"
                style={{ background: colors.blue1 }}
              >
                <option value="" disabled>
                  --
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.emoji} {country.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-6 text-field">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="p-4 text-small-title"
                style={{ background: colors.blue1, color: colors.gray2 }}
                disabled
              >
                <option value="STEAM">STEAM</option>
              </select>
            </div>
          </div>
          {/* Looking for & Offering */}
          <div className="flex gap-8 mb-12">
            <div className="w-1/2">
              <label className="block mb-6 text-field">Looking for</label>
              <SearchBar placeholder="Search any game" />
              <div className="mt-6.5">
                <GameIconsList
                  games={lookingFor}
                  onRemove={handleRemoveLookingFor}
                  maxGames={10}
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block mb-6 text-field">Offering</label>
              <SearchBar placeholder="Search any game" />
              <div className="mt-6.5">
                <GameIconsList
                  games={offering}
                  onRemove={handleRemoveOffering}
                  maxGames={10}
                />
              </div>
            </div>
          </div>
          {/* Terms and conditions */}
          <div
            className="mb-8 mx-auto max-w-xl"
            style={{ color: colors.gray1 }}
          >
            <label className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 border-2 appearance-none checked:bg-transparent cursor-pointer flex-shrink-0"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: colors.purple,
                  backgroundImage: termsAccepted
                    ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${encodeURIComponent(
                        colors.purple
                      )}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                    : 'none',
                }}
              />
              <span className="text-field-small">
                I have read and agree to the{' '}
                <a href="#" className="underline">
                  terms and conditions
                </a>
                .
              </span>
            </label>
          </div>
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
    </Container>
  );
}
