'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { colors, gradients } from '@/lib/colors';
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
        isScrolled ? 'py-4 backdrop-blur-sm bg-black/30' : 'py-4'
      }`}
      style={{ background: gradients.navbar }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
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
            className="text-navbar transition-colors flex items-center gap-2 cursor-pointer hover:!text-white focus:!text-white"
            style={{ color: colors.gray1 }}
          >
            Search
          </button>
          <button
            className="text-navbar flex items-center gap-2 cursor-pointer outline-none group"
            style={{ color: colors.gray1 }}
          >
            <span className="transition-colors group-hover:!text-white group-focus:!text-white">
              Platform
            </span>
            <img
              src="/Dropdown.svg"
              alt=""
              className="w-3 h-3 pt-1 transition-[filter] brightness-[0.6] group-hover:!brightness-[10]"
            />
          </button>
          <button
            className="text-navbar transition-colors cursor-pointer hover:!text-white focus:!text-white"
            style={{ color: colors.gray1 }}
            onClick={() => (window.location.href = '/info')}
          >
            Info
          </button>
        </div>

        <Button
          variant="primary"
          className="hidden md:block"
          onClick={() => (window.location.href = '/listings/create')}
        >
          CREATE A POST
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
