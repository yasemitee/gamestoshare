import React from 'react';

interface GameIconProps {
  color: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ color }) => {
  return <div className="w-8 h-8 rounded" style={{ backgroundColor: color }} />;
};
