import React from 'react';
import { colors } from '../../lib/colors';

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
  const baseStyle = 'px-6 py-2 rounded font-medium transition-all duration-200';
  const variants = {
    primary: 'bg-purple-200 text-gray-900 hover:bg-purple-300',
    secondary: 'border border-gray-400 text-white hover:bg-gray-800',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={
        variant === 'primary'
          ? { backgroundColor: colors.purple, color: colors.black }
          : {}
      }
      {...props}
    >
      {children}
    </button>
  );
};
