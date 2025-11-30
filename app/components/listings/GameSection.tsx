import { SearchBar } from '@/components/ui/SearchBar';
import { GameIconsList } from '@/components/listings/GameIconsList';

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
}

export function GameSection({
  label,
  games,
  onGameSelect,
  onRemove,
  maxGames = 10,
}: GameSectionProps) {
  return (
    <div className="w-1/2">
      <label className="block mb-6 text-field">{label}</label>
      <SearchBar
        placeholder="Search any game"
        onGameSelect={onGameSelect}
        clearOnSelect={true}
      />
      <div className="mt-6.5">
        <GameIconsList games={games} onRemove={onRemove} maxGames={maxGames} />
      </div>
    </div>
  );
}
