'use client';

import { colors } from '@/lib/colors';
import { Button } from '@/components/ui/Button';

interface CongratulationsStepProps {
  matchedGameName?: string;
  matchedGameImage?: string;
  onSendInvitation: () => void;
}

export function CongratulationsStep({
  matchedGameName,
  matchedGameImage,
  onSendInvitation,
}: CongratulationsStepProps) {
  return (
    <>
      {/* Title */}
      <div className="text-center mb-8">
        <h2 style={{ color: colors.white }}>Verify your account</h2>
      </div>

      {/* Congratulations */}
      <div className="text-center mb-12">
        <p className="text-field mb-2" style={{ color: colors.white }}>
          CONGRATULATIONS!
        </p>
        <p className="text-field-small" style={{ color: colors.gray1 }}>
          We found at least one game matching the wishlist
        </p>
      </div>

      {/* Game Image */}
      {matchedGameImage && (
        <div className="mb-12 flex justify-center">
          <img
            src={matchedGameImage}
            alt={matchedGameName || 'Matched game'}
            className="w-full max-w-[460px] h-auto"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Button */}
      <div className="px-9">
        <Button onClick={onSendInvitation} variant="primary" className="w-full">
          SEND INVITATION
        </Button>
      </div>
    </>
  );
}
