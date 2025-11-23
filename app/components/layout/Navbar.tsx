import React from 'react';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/colors';

export const Navbar: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4"
      style={{ backgroundColor: colors.black }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="text-2xl font-bold tracking-tight"
          style={{ color: colors.white }}
        >
          GAMESTOSHARE
        </div>

        <div className="flex items-center gap-8">
          <button
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            Search ▾
          </button>
          <button
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            Platform ▾
          </button>
          <button
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            Info
          </button>
        </div>

        <Button variant="primary">REQUEST</Button>
      </div>
    </nav>
  );
};
