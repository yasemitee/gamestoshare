const STORAGE_PREFIX = 'gts_manage_';

interface ManageTokenEntry {
  token: string;
  steamId: string;
  expiresAt: string;
}

function storageKey(listingId: string): string {
  return `${STORAGE_PREFIX}${listingId}`;
}

export function getManageToken(listingId: string): ManageTokenEntry | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(storageKey(listingId));
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as ManageTokenEntry;
    if (!entry.token || !entry.steamId || !entry.expiresAt) {
      window.localStorage.removeItem(storageKey(listingId));
      return null;
    }
    if (new Date(entry.expiresAt) < new Date()) {
      window.localStorage.removeItem(storageKey(listingId));
      return null;
    }
    return entry;
  } catch {
    window.localStorage.removeItem(storageKey(listingId));
    return null;
  }
}

export function setManageToken(
  listingId: string,
  entry: ManageTokenEntry
): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey(listingId), JSON.stringify(entry));
}

export function clearManageToken(listingId: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey(listingId));
}
