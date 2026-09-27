'use client';

import { colors } from '@/lib/colors';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { EASE } from '@/lib/constants';
import { useState } from 'react';
import { STEAM_VERIFICATION_CODE } from '@/lib/constants';

interface BioVerificationStepProps {
  steamId?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  hideBioPreview?: boolean;
  isLoading?: boolean;
  code?: string;
  hint?: string;
}

export function BioVerificationStep({
  steamId,
  onCancel,
  onConfirm,
  hideBioPreview = false,
  isLoading = false,
  code = STEAM_VERIFICATION_CODE,
  hint = 'When detected, you can post and send requests.',
}: BioVerificationStepProps) {
  const verificationCode = code;
  // Manage codes (GTS-XXXXXX) render smaller so the copy icon stays inside the modal.
  const isLongCode = verificationCode.length > 4;

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the code is still selectable on screen.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE.out }}
      className="flex flex-col h-full"
      style={{ minHeight: '455px' }}
    >
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
            className={`flex items-center px-4 md:px-6 py-2 ${
              isLongCode ? 'gap-1.5 md:gap-2' : 'gap-4 md:gap-8'
            }`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
          >
            {/* One string for assistive tech; the spaced glyphs are visual only. */}
            <span className="sr-only">{verificationCode}</span>
            {verificationCode.split('').map((char, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={
                  isLongCode ? 'text-lg md:text-2xl' : 'text-2xl md:text-4xl'
                }
                style={{ color: colors.white }}
              >
                {char}
              </span>
            ))}
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Code copied' : 'Copy code'}
              className={`hover:opacity-70 transition-opacity hover:cursor-pointer ${
                isLongCode ? 'ml-2' : ''
              }`}
            >
              {copied ? (
                <span
                  aria-live="polite"
                  style={{
                    color: colors.purple,
                    fontSize: 10,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Copied
                </span>
              ) : (
                <img src="/CopyIcon.svg" alt="" width="20" height="20" />
              )}
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
                  : 'steam://openurl/https://steamcommunity.com/my/edit/info'
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
                  ? `https://steamcommunity.com/profiles/${steamId}/edit/info`
                  : 'https://steamcommunity.com/my/edit/info'
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
            <span
              className="absolute top-0 right-0 text-field-small px-3 py-1 z-10 border"
              style={{
                backgroundColor: colors.gray3,
                color: colors.gray1,
              }}
            >
              Example
            </span>
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
            {hint}
          </p>
          <p className="text-field-small" style={{ color: colors.gray1 }}>
            <span style={{ color: colors.white }}>Remove it from your bio</span>{' '}
            once you&apos;re verified.
          </p>
        </div>
      </div>

      {/* Buttons Area - Fixed at bottom */}
      <div className="flex gap-16 px-9">
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            CANCEL
          </Button>
        )}
        <Button
          onClick={onConfirm}
          variant="primary"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{
                  borderColor: colors.black,
                  borderTopColor: 'transparent',
                  opacity: 0.5,
                }}
              />
              VERIFYING...
            </span>
          ) : (
            'CONFIRM'
          )}
        </Button>
      </div>
    </motion.div>
  );
}
