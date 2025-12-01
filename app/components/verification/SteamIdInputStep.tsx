'use client';

import { colors } from '@/lib/colors';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface SteamIdInputStepProps {
  onBack: () => void;
  onNext: (steamId: string) => void;
  isLoading?: boolean;
  showCongratulations?: boolean;
  showNoMatch?: boolean;
  matchedGameName?: string;
  matchedGameImage?: string;
  currentSteamId?: string;
  onSendInvitation?: () => void;
}

export function SteamIdInputStep({
  onBack,
  onNext,
  isLoading = false,
  showCongratulations = false,
  showNoMatch = false,
  matchedGameName,
  matchedGameImage,
  currentSteamId,
  onSendInvitation,
}: SteamIdInputStepProps) {
  const [steamId, setSteamId] = useState(currentSteamId || '');

  const isInputDisabled = isLoading || showCongratulations;
  const showEmptyState = !isLoading && !showCongratulations && !showNoMatch;
  const hasContent = showCongratulations || showNoMatch;

  const handleNext = () => {
    if (steamId.trim()) {
      onNext(steamId.trim());
    }
  };

  const handleBlur = () => {
    if (steamId.trim() && !hasContent && !isLoading) {
      onNext(steamId.trim());
    }
  };

  const renderTitle = () => (
    <div className="text-center mb-8">
      <h2 style={{ color: colors.white }}>Verify your account</h2>
    </div>
  );

  const renderDescription = () => (
    <p className="text-field mb-4" style={{ color: colors.white }}>
      ID STEAM
    </p>
  );

  return (
    <div style={{ minHeight: '455px' }}>
      {renderTitle()}
      {renderDescription()}

      {/* Input */}
      <div className="mb-12 relative">
        <input
          type="text"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          onBlur={handleBlur}
          placeholder="Your steam ID"
          disabled={isInputDisabled}
          className="w-full px-2 py-4 text-field"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            color: colors.white,
            border: 'none',
            outline: 'none',
          }}
        />
        {showCongratulations && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M16.667 5L7.5 14.167L3.333 10"
                stroke="#A78BFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Box that always maintains space - content changes based on state */}
      <div
        className="mb-12 flex flex-col items-center justify-center"
        style={{
          backgroundColor: colors.gray3,
          height: '103.5px',
        }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center">
            <img
              src="/Spinner.svg"
              alt="Loading"
              className="w-12 h-12 animate-spin"
            />
          </div>
        )}

        {/* Congratulations Section */}
        {showCongratulations && matchedGameImage && (
          <>
            <div className="text-center mb-3 mt-6">
              <p className="text-field mb-2" style={{ color: colors.white }}>
                CONGRATULATIONS!
              </p>
              <p
                className="text-field-small mb-6.5"
                style={{ color: colors.gray1 }}
              >
                We found at least one game matching the offer
              </p>
            </div>

            <div className="flex justify-center">
              <img
                src={matchedGameImage}
                alt={matchedGameName || 'Matched game'}
                style={{
                  objectFit: 'cover',
                  maxWidth: '160px',
                  height: 'auto',
                }}
              />
            </div>
          </>
        )}

        {/* No Match Section */}
        {showNoMatch && (
          <div className="text-center flex flex-col items-center justify-center h-full">
            <p className="text-field mt-8 mb-3" style={{ color: colors.white }}>
              WE COULDN'T FIND ANY GAMES IN COMMON
            </p>
            <p
              className="text-field-small mb-8"
              style={{ color: colors.gray1 }}
            >
              You need to own at least 1 game of their Looking For.
            </p>
            <div className="">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle
                  cx="40"
                  cy="40"
                  r="38"
                  stroke={colors.gray1}
                  strokeWidth="2"
                />
                <circle cx="28" cy="32" r="2" fill={colors.gray1} />
                <circle cx="52" cy="32" r="2" fill={colors.gray1} />
                <path
                  d="M30 50 Q40 42 50 50"
                  stroke={colors.gray1}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Empty state - box is visible but empty */}
        {showEmptyState && <div />}
      </div>

      {/* Buttons Area */}
      <div className="pt-8">
        {showEmptyState && (
          <div className="flex gap-16 px-9">
            <Button onClick={onBack} variant="secondary" className="flex-1">
              BACK
            </Button>
            <Button
              onClick={handleNext}
              variant="primary"
              className="flex-1"
              disabled={true}
            >
              NEXT
            </Button>
          </div>
        )}

        {showNoMatch && (
          <div className="px-9">
            <Button onClick={onBack} variant="secondary" className="w-full">
              BACK
            </Button>
          </div>
        )}

        {showCongratulations && onSendInvitation && (
          <div className="px-16 text-button">
            <Button
              onClick={onSendInvitation}
              variant="primary"
              className="w-full"
            >
              SEND INVITATION
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
