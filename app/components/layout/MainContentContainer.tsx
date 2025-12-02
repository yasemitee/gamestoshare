import React, { ReactNode } from 'react';

interface MainContentContainerProps {
  children: ReactNode;
  className?: string;
}

export const MainContentContainer: React.FC<MainContentContainerProps> = ({
  children,
  className = '',
}) => {
  return <div className={`mt-26 md:mt-48 w-full ${className}`}>{children}</div>;
};
