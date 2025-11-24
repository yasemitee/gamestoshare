import React from 'react';

interface FilterIconProps {
  className?: string;
  color?: string;
}

export const FilterIcon: React.FC<FilterIconProps> = ({
  className = '',
  color = 'currentColor',
}) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 4H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M6 9H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 14H10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
