'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/colors';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 backdrop-blur-sm bg-black/30' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="GamesToShare"
            width={191}
            height={18}
            className="w-[191px] h-[18px] md:w-[191px] md:h-[18px] sm:w-[150px] sm:h-auto object-contain"
            priority
          />
        </div>

        <div className="hidden md:flex items-center gap-16">
          <button
            className="text-navbar hover:opacity-80 transition-opacity flex items-center gap-2"
            style={{ color: colors.white }}
          >
            Search
            <img src="/Dropdown.svg" alt="" className="w-3 h-3 pt-1" />
          </button>
          <button
            className="text-navbar hover:opacity-80 transition-opacity flex items-center gap-2"
            style={{ color: colors.white }}
          >
            Platform
            <img src="/Dropdown.svg" alt="" className="w-3 h-3 pt-1" />
          </button>
          <button
            className="text-navbar hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            Info
          </button>
        </div>

        <Button
          variant="primary"
          className="hidden md:block"
          onClick={() => (window.location.href = '/listings/create')}
        >
          POST
        </Button>

        {/* TODO: burger (not working yet) */}
        <button className="md:hidden" style={{ color: colors.white }}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
