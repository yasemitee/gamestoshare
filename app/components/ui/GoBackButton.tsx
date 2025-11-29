import React from 'react';
import Image from 'next/image';
import { colors } from '@/lib/colors';

interface GoBackButtonProps {
  onClick?: () => void;
  className?: string;
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center text-field cursor-pointer transition-colors ${className} hover:opacity-80`}
      style={{ color: colors.white }}
    >
      <Image
        src="/LeftArrow.svg"
        alt="Back"
        width={8}
        height={4}
        className="mr-2"
      />
      Go back
    </button>
  );
};
