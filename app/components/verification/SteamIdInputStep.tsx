'use client';

import { colors } from '@/lib/colors';
import { Button } from '@/components/ui/Button';
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EASE } from '@/lib/constants';

interface SteamIdInputStepProps {
  onBack: () => void;
  onNext: (steamId: string) => void;
  isLoading?: boolean;
  currentSteamId?: string;
}

export function SteamIdInputStep({
  onBack,
  onNext,
  isLoading = false,
  currentSteamId,
}: SteamIdInputStepProps) {
  const [steamId, setSteamId] = useState(currentSteamId || '');
  // Blur and the NEXT click fire back to back; only submit each value once.
  const lastSubmitted = useRef<string | null>(null);

  const submit = () => {
    const value = steamId.trim();
    if (!value || isLoading) return;
    if (lastSubmitted.current === value) return;
    lastSubmitted.current = value;
    onNext(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE.out }}
    >
      <div className="text-center mb-8">
        <h2 style={{ color: colors.white }}>Verify your account</h2>
      </div>

      <label
        htmlFor="steam-id-input"
        className="block text-field mb-4"
        style={{ color: colors.white }}
      >
        STEAM ID
      </label>

      <div className="mb-12">
        <input
          id="steam-id-input"
          type="text"
          value={steamId}
          onChange={(e) => {
            setSteamId(e.target.value);
            lastSubmitted.current = null;
          }}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="Your Steam ID"
          disabled={isLoading}
          className="w-full px-2 py-4 text-field"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            color: colors.white,
            border: 'none',
            outline: 'none',
          }}
        />
      </div>

      <div className="flex gap-16 px-9">
        <Button
          onClick={onBack}
          variant="secondary"
          className="flex-1"
          disabled={isLoading}
        >
          BACK
        </Button>
        <Button
          onClick={submit}
          variant="primary"
          className="flex-1"
          disabled={!steamId.trim() || isLoading}
        >
          {isLoading ? 'CHECKING…' : 'NEXT'}
        </Button>
      </div>
    </motion.div>
  );
}
