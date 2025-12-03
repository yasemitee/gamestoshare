import React, { ReactNode } from 'react';

interface MainContentContainerProps {
  children: ReactNode;
  className?: string;
}

export const MainContentContainer: React.FC<MainContentContainerProps> = ({
  children,
  className = '',
}) => {
  return <div className={`mt-26 md:mt-24 w-full ${className}`}>{children}</div>;
};
