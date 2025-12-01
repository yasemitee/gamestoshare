'use client';

import { colors } from '@/lib/colors';
import { Button } from '@/components/ui/Button';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  steamId?: string;
  title?: string;
  description?: string;
}

export function VerificationModal({
  isOpen,
  onClose,
  onConfirm,
  steamId,
  title = 'Verify your account',
  description = 'PUT THE CODE IN YOUR STEAM BIO',
}: VerificationModalProps) {
  if (!isOpen) return null;

  const verificationCode = 'GTS';

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationCode);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 backdrop-brightness-40"
        style={{ backgroundColor: colors.black + '10' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[762px] px-48 py-8"
        style={{ backgroundColor: colors.blue1 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-9 right-8 hover:opacity-70 transition-opacity"
        >
          <img src="/XIcon.svg" alt="Close" width="14" height="14" />
        </button>

        {/* Title */}
        <div className="text-center mb-12 flex items-center justify-center gap-2">
          <h2 className="" style={{ color: colors.white }}>
            {title}
          </h2>
          <span className="text-field-small" style={{ color: colors.gray1 }}>
            1 min
          </span>
        </div>

        {/* Description */}
        <p
          className="text-field text-center mb-6"
          style={{ color: colors.white }}
        >
          {description}
        </p>

        {/* Verification Code */}
        <div className="flex items-center justify-center mb-12">
          <div
            className="flex items-center px-6 py-2 gap-8"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
          >
            {verificationCode.split('').map((char, index) => (
              <h2 key={index} style={{ color: colors.white }}>
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
        <div className="text-center mb-10">
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
              Open your Steam Bio (Steam App)
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

        {/* BIO Section */}
        <div className="mb-8 relative">
          <button
            className="absolute top-0 right-0 text-field-small px-3 py-1 z-10 border"
            style={{
              backgroundColor: colors.gray2,
              color: colors.gray1,
            }}
          >
            Reference
          </button>
          <div
            className="w-full flex items-center justify-center"
            style={{
              backgroundColor: colors.black,
              height: '130px',
            }}
          >
            <span className="text-field-small" style={{ color: colors.gray1 }}>
              Bio preview placeholder
            </span>
          </div>
        </div>

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

        {/* Buttons */}
        <div className="flex gap-16 px-9">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            CANCEL
          </Button>
          <Button onClick={onConfirm} variant="primary" className="flex-1">
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  );
}
