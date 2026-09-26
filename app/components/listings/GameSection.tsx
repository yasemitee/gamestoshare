import { useMemo, useState } from 'react';
import { SearchBar } from '@/components/ui/SearchBar';
import { GameIconsList } from '@/components/listings/GameIconsList';
import { FieldError } from '@/components/ui/FieldError';

interface Game {
  id: string;
  name: string;
  iconUrl?: string;
  appId?: number;
}

interface GameSectionProps {
  label: string;
  games: Game[];
  onGameSelect: (
    game: { appId: number; name: string; iconUrl: string } | null
  ) => void;
  onRemove: (id: string) => void;
  maxGames?: number;
  addPlaceholder?: string;
  source?: string;
  error?: string;
}

export function GameSection({
  label,
  games,
  onGameSelect,
  onRemove,
  maxGames = 10,
  addPlaceholder = 'Add a game',
  source,
  error,
}: GameSectionProps) {
  const [highlight, setHighlight] = useState<{
    id: string;
    nonce: number;
  } | null>(null);

  const addedAppIds = useMemo(
    () =>
      new Set(
        games.map((g) => g.appId).filter((id): id is number => id != null)
      ),
    [games]
  );

  const handleSelect = (
    game: { appId: number; name: string; iconUrl: string } | null
  ) => {
    onGameSelect(game);
    if (!game) return;
    // Flash the tile, whether it was just added or was already in the list.
    setHighlight((prev) => ({
      id: game.appId.toString(),
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  };

  return (
    <div className="w-full md:w-1/2">
      <label className="block mb-6 text-field">{label}</label>
      <div className="max-w-[calc(72px*5+12px*4)] md:max-w-none">
        <SearchBar
          mode="add"
          placeholder={addPlaceholder}
          addedAppIds={addedAppIds}
          onGameSelect={handleSelect}
          clearOnSelect={true}
          className="w-full"
        />
        {error && <FieldError message={error} />}
      </div>
      <div className="mt-5">
        <GameIconsList
          games={games}
          onRemove={onRemove}
          maxGames={maxGames}
          source={source}
          highlight={highlight}
        />
      </div>
    </div>
  );
}
