/**
 * Sort games by release year (descending) and then by price (descending)
 */
export function sortGamesByYearAndPrice<T extends { releaseYear?: number | null; priceInCents?: number | null }>(
  games: T[]
): T[] {
  return games.sort((a, b) => {
    const yearA = a.releaseYear ?? 0;
    const yearB = b.releaseYear ?? 0;
    const priceA = a.priceInCents ?? 0;
    const priceB = b.priceInCents ?? 0;

    if (yearB !== yearA) {
      return yearB - yearA;
    }

    return priceB - priceA;
  });
}

/**
 * Calculate days since a given date and return formatted string
 */
export function getDaysSincePosting(date: Date): string {
  const daysSince = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`;
}
