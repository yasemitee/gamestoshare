'use client';

import { colors } from '@/lib/colors';
import { Button } from '@/components/ui/Button';

interface BioVerificationStepProps {
  steamId?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  hideBioPreview?: boolean;
}

export function BioVerificationStep({
  steamId,
  onCancel,
  onConfirm,
  onSkip,
  showSkip = false,
  hideBioPreview = false,
}: BioVerificationStepProps) {
  const verificationCode = 'GTS';

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationCode);
  };

  return (
    <div className="flex flex-col h-full" style={{ minHeight: '455px' }}>
      {/* Content Area */}
      <div>
        {/* Title */}
        <div className="text-center mb-8 flex items-center justify-center gap-2">
          <h2 style={{ color: colors.white }}>Verify your account</h2>
        </div>

        {/* Description */}
        <p
          className="text-field text-center mb-6"
          style={{ color: colors.white }}
        >
          PUT THE CODE IN YOUR STEAM BIO
        </p>

        {/* Verification Code */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="flex items-center px-4 md:px-6 py-2 gap-4 md:gap-8"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
          >
            {verificationCode.split('').map((char, index) => (
              <h2
                key={index}
                className="text-2xl md:text-4xl"
                style={{ color: colors.white }}
              >
                {char}
              </h2>
            ))}
            <button
              onClick={handleCopy}
              className="hover:opacity-70 transition-opacity hover:cursor-pointer"
            >
              <img src="/CopyIcon.svg" alt="Copy" width="20" height="20" />
            </button>
          </div>
        </div>

        {/* Open Steam Bio Link */}
        <div className="text-center mb-8">
          <div className="text-field">
            <a
              href={
                steamId
                  ? `steam://openurl/https://steamcommunity.com/profiles/${steamId}/edit/info`
                  : '#'
              }
              className="underline"
              style={{ color: colors.purple }}
            >
              Open your Steam Bio
            </a>
          </div>
          <div className="text-field">
            <span style={{ color: colors.gray1 }}>or </span>
            <a
              href={
                steamId
                  ? `https://steamcommunity.com/id/${steamId}/edit/info`
                  : '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: colors.purple }}
            >
              Open in Browser
            </a>
          </div>
        </div>

        {/* BIO Section - only show if not hidden */}
        {!hideBioPreview && (
          <div className="mb-8 relative">
            <button
              className="absolute top-0 right-0 text-field-small px-3 py-1 z-10 border"
              style={{
                backgroundColor: colors.gray3,
                color: colors.gray1,
              }}
            >
              Reference
            </button>
            <div
              className="w-full"
              style={{
                backgroundColor: colors.black,
                height: '130px',
                overflow: 'hidden',
              }}
            >
              <img
                src="../SteamBioPreview.png"
                alt="Steam Bio Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 97%',
                }}
              />
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mb-12 text-center">
          <p className="text-link mb-4" style={{ color: colors.white }}>
            HOW IT WORKS
          </p>
          <p className="text-field-small" style={{ color: colors.gray1 }}>
            When detected, you can post and send requests.
          </p>
          <p className="text-field-small" style={{ color: colors.gray1 }}>
            Please{' '}
            <span style={{ color: colors.white }}>always remove it after</span>{' '}
            to avoid any inconveniences.
          </p>
        </div>
      </div>

      {/* Buttons Area - Fixed at bottom */}
      <div className="flex gap-16 px-9">
        {onCancel && (
          <Button onClick={onCancel} variant="secondary" className="flex-1">
            {showSkip ? 'BACK' : 'CANCEL'}
          </Button>
        )}
        {showSkip && onSkip ? (
          <Button onClick={onSkip} variant="primary" className="flex-1">
            SKIP
          </Button>
        ) : (
          <Button onClick={onConfirm} variant="primary" className="flex-1">
            CONFIRM
          </Button>
        )}
      </div>
    </div>
  );
}
