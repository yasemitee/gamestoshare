interface GameWithName {
  name: string;
  [key: string]: any;
}

/**
 * Removes duplicate games from an array based on case-insensitive name comparison
 */
export function removeDuplicateGames<T extends GameWithName>(
  games: T[]
): T[] {
  return Array.from(
    new Map(games.map((game) => [game.name.toLowerCase().trim(), game])).values()
  );
}
