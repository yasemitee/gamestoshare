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
  disabled,
  ...props
}) => {
  const baseStyle = 'text-button px-6 py-2.5 transition-all duration-200';
  const cursorStyle = disabled ? 'cursor-not-allowed' : 'cursor-pointer';
  const variants = {
    primary: disabled ? '' : 'hover:opacity-90',
    secondary: 'hover:opacity-80',
  };

  const getButtonStyle = () => {
    if (disabled) {
      return {
        background: colors.gray2,
        color: colors.gray1,
        opacity: 0.5,
      };
    }
    return variant === 'primary'
      ? { background: gradients.main, color: colors.black }
      : { background: colors.gray2, color: colors.white };
  };

  return (
    <button
      className={`${baseStyle} ${cursorStyle} ${variants[variant]} ${className}`}
      style={getButtonStyle()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
