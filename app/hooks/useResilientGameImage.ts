'use client';

import { useEffect, useState } from 'react';

interface UseResilientGameImageOptions {
  headerImage?: string | null;
  iconUrl?: string | null;
  appId?: number | null;
}

// The community icon is a 32x32 square — real art, but far too small to use
// as a banner unless nothing better can be found.
const TINY_ICON_PATTERN =
  /media\.steampowered\.com\/steamcommunity\/public\/images\/apps\//;

/**
 * Resolves the best available banner for a game: stored art first, then the
 * Steam store API (which also repairs the stored value server-side), then
 * the tiny community icon as a last resort.
 *
 * Note this can't detect Steam's blank-placeholder responses — those return
 * HTTP 200, so `onError` never fires. That case is handled server-side; see
 * `lib/steam/images`.
 */
export function useResilientGameImage({
  headerImage,
  iconUrl,
  appId,
}: UseResilientGameImageOptions) {
  const candidates = [headerImage, iconUrl].filter(
    (url): url is string => !!url
  );
  const sources = [
    ...new Set(candidates.filter((url) => !TINY_ICON_PATTERN.test(url))),
  ];
  const lastResort = candidates.find((url) => TINY_ICON_PATTERN.test(url)) ?? null;

  const [idx, setIdx] = useState(0);
  const [resolved, setResolved] = useState<string | null>(null);
  const [triedApi, setTriedApi] = useState(false);
  const [exhausted, setExhausted] = useState(false);

  const resolveViaApi = async () => {
    if (triedApi || !appId) {
      setExhausted(true);
      return;
    }
    setTriedApi(true);
    try {
      const res = await fetch(`/api/steam/header?appId=${appId}`);
      const data = await res.json();
      if (data?.headerImage) {
        setResolved(data.headerImage);
        return;
      }
    } catch {
      // fall through to the last-resort icon / dead state
    }
    setExhausted(true);
  };

  // Nothing banner-shaped to even attempt: ask the store API rather than
  // rendering an empty box forever.
  useEffect(() => {
    if (sources.length === 0 && !resolved && !triedApi) {
      resolveViaApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.length, appId]);

  const handleError = () => {
    if (!resolved && idx < sources.length - 1) {
      setIdx((i) => i + 1);
      return;
    }
    resolveViaApi();
  };

  const src = resolved ?? sources[idx] ?? (exhausted ? lastResort : null);

  return { src, handleError, dead: exhausted && !lastResort };
}
