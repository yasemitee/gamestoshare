import React from 'react';
import { colors, gradients } from '@/lib/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle = 'text-button px-6 py-2.5 transition-all duration-200';
  const variants = {
    primary: 'hover:opacity-90',
    secondary: 'border border-gray-400 hover:bg-gray-800',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={
        variant === 'primary'
          ? { background: gradients.main, color: colors.black }
          : { color: colors.white }
      }
      {...props}
    >
      {children}
    </button>
  );
};
