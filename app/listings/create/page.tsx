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

export default function CreateListingPage() {
  // State for form fields
  const [steamId, setSteamId] = useState('');
  const [isSteamIdValid, setIsSteamIdValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('STEAM');

  // Mock games for testing
  const mockGames = [
    {
      id: '1',
      name: 'Counter Strike 2',
      appId: 730,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    },
    {
      id: '2',
      name: 'Dota 2',
      appId: 570,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    },
    {
      id: '3',
      name: 'Team Fortress 2',
      appId: 440,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg',
    },
    {
      id: '4',
      name: 'Portal 2',
      appId: 620,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg',
    },
    {
      id: '5',
      name: 'Half Life 2',
      appId: 220,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/220/header.jpg',
    },
    {
      id: '6',
      name: 'Left 4 Dead 2',
      appId: 550,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg',
    },
    {
      id: '7',
      name: 'GTA V',
      appId: 271590,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    },
    {
      id: '8',
      name: 'Skyrim',
      appId: 72850,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/72850/header.jpg',
    },
    {
      id: '9',
      name: 'Fallout 4',
      appId: 377160,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/377160/header.jpg',
    },
    {
      id: '10',
      name: 'Civilization VI',
      appId: 289070,
      iconUrl:
        'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
    },
  ];

  const [lookingFor, setLookingFor] = useState<
    Array<{ id: string; name: string; iconUrl?: string; appId?: number }>
  >([]);

  const [offering, setOffering] = useState<
    Array<{ id: string; name: string; iconUrl?: string; appId?: number }>
  >([]);

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Funzione per normalizzare lo Steam ID in URL completo
  const normalizeSteamId = (input: string): string => {
    const trimmed = input.trim();

    // Se è già un URL completo, ritornalo così com'è
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // Se contiene steamcommunity.com ma non il protocollo
    if (trimmed.includes('steamcommunity.com')) {
      return `https://${trimmed}`;
    }

    // Se è solo il numero ID (formato: 76561198...)
    if (/^\d{17}$/.test(trimmed)) {
      return `https://steamcommunity.com/profiles/${trimmed}`;
    }

    // Se è solo lo username (formato: yasemite)
    // Considera tutto ciò che non contiene slash come username
    if (!trimmed.includes('/')) {
      return `https://steamcommunity.com/id/${trimmed}`;
    }

    // Se è un path parziale (formato: id/yasemite o profiles/76561198...)
    if (trimmed.startsWith('id/') || trimmed.startsWith('profiles/')) {
      return `https://steamcommunity.com/${trimmed}`;
    }

    // Default: trattalo come username
    return `https://steamcommunity.com/id/${trimmed}`;
  };

  // Funzione per verificare lo Steam ID e popolare i dati
  const verifySteamId = async (id: string) => {
    if (!id.trim()) {
      setIsSteamIdValid(false);
      return;
    }

    setIsVerifying(true);
    try {
      // Normalizza l'input in URL completo
      const normalizedUrl = normalizeSteamId(id);

      // Chiama l'API per verificare il profilo Steam
      const response = await fetch(
        `/api/steam/profile?profileUrl=${encodeURIComponent(normalizedUrl)}`
      );

      if (response.ok) {
        const data = await response.json();
        setIsSteamIdValid(true);

        // Popola la location se disponibile
        if (data.country) {
          setLocation(data.country.toUpperCase());
        }

        // Recupera la wishlist e i giochi posseduti in parallelo
        try {
          const [wishlistResponse, ownedGamesResponse] = await Promise.all([
            fetch(
              `/api/steam/wishlist?profileUrl=${encodeURIComponent(
                normalizedUrl
              )}`
            ),
            fetch(
              `/api/steam/owned-games?profileUrl=${encodeURIComponent(
                normalizedUrl
              )}&limit=1000`
            ),
          ]);

          // Popola lookingFor con la wishlist
          if (wishlistResponse.ok) {
            const wishlistData = await wishlistResponse.json();

            if (
              wishlistData &&
              Array.isArray(wishlistData) &&
              wishlistData.length > 0
            ) {
              const wishlistGames = wishlistData
                .slice(0, 10)
                .map((game: any) => ({
                  id: game.appId.toString(),
                  name: game.name,
                  iconUrl: game.iconUrl || game.headerImage,
                  appId: game.appId,
                }));
              setLookingFor(wishlistGames);
            }
          }

          // Popola offering con i giochi posseduti (solo a pagamento, ordinati per prezzo)
          if (ownedGamesResponse.ok) {
            const ownedGamesData = await ownedGamesResponse.json();

            if (
              ownedGamesData &&
              Array.isArray(ownedGamesData) &&
              ownedGamesData.length > 0
            ) {
              const ownedGames = ownedGamesData.map((game: any) => ({
                id: game.id,
                name: game.name,
                iconUrl: game.iconUrl,
                appId: game.appId,
              }));
              setOffering(ownedGames);
            }
          }
        } catch (error) {
          console.error('Error fetching games data:', error);
          // Non bloccare se i dati non sono disponibili
        }
      } else {
        setIsSteamIdValid(false);
      }
    } catch (error) {
      console.error('Error verifying Steam ID:', error);
      setIsSteamIdValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handler per il cambio dello Steam ID
  const handleSteamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSteamId(value);
    setIsSteamIdValid(false);
  };

  // Handler per il blur dell'input (quando l'utente finisce di scrivere)
  const handleSteamIdBlur = () => {
    if (steamId.trim()) {
      verifySteamId(steamId);
    }
  };

  // Handlers for game selection
  const handleRemoveLookingFor = (id: string) => {
    setLookingFor((prev) => prev.filter((game) => game.id !== id));
  };

  const handleRemoveOffering = (id: string) => {
    setOffering((prev) => prev.filter((game) => game.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement submit logic
  };

  return (
    <Container>
      <Navbar />
      <MainContentContainer>
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
              {/* Spunta viola o loader */}
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
          {/* Location & Platform */}
          <div className="flex gap-16 my-12">
            {/* TODO: Replace with <LocationSelector /> */}
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
            {/* TODO: Replace with <PlatformSelector /> */}
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
              <div className="flex justify-between items-center mb-6 text-field">
                <label className="block">Looking for</label>
                <button
                  type="button"
                  className="hover:text-white text-field"
                  style={{ color: colors.purple }}
                  onClick={() => {
                    /* TODO: Toggle remove mode */
                  }}
                >
                  Remove
                </button>
              </div>
              {/* TODO: Replace with <GameSelector /> */}
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
              <div className="flex justify-between items-center mb-6 text-field">
                <label className="block">Offering</label>
                <button
                  type="button"
                  className="hover:text-white text-field"
                  style={{ color: colors.purple }}
                  onClick={() => {
                    /* TODO: Toggle remove mode */
                  }}
                >
                  Remove
                </button>
              </div>
              {/* TODO: Replace with <GameSelector /> */}
              <SearchBar placeholder="Search any game" />
              <div className="mt-6.5">
                <GameIconsList
                  games={offering}
                  onRemove={handleRemoveLookingFor}
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
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 border-2 appearance-none checked:bg-transparent cursor-pointer"
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
            disabled={!termsAccepted}
            className="mx-auto block px-6 py-2.5 text-button"
          >
            POST
          </Button>
        </form>
      </MainContentContainer>
    </Container>
  );
}
