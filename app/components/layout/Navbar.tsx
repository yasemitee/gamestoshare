'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { colors, gradients } from '@/lib/colors';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      scrollPosition.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isScrolled ? 'py-4 backdrop-blur-sm bg-black/30' : 'py-4'
      }`}
      style={{ background: gradients.navbar }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          <img
            src="/Logo.svg"
            alt="GamesToShare"
            width={191}
            height={18}
            className="w-[170px] h-auto sm:w-[170px] md:w-[191px] object-contain"
          />
        </div>

        <div className="hidden md:flex items-center gap-16 md:gap-8 lg:gap-16">
          <button
            className="text-navbar transition-colors flex items-center gap-2 cursor-pointer hover:!text-white focus:!text-white"
            style={{ color: isActive('/') ? colors.white : colors.gray1 }}
            onClick={() => (window.location.href = '/')}
          >
            Search
          </button>
          <button
            className="text-navbar flex items-center gap-2 cursor-pointer outline-none group"
            style={{ color: colors.gray1 }}
          >
            <span className="transition-colors group-hover:!text-white">
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
            style={{ color: isActive('/info') ? colors.white : colors.gray1 }}
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

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <span
              className="absolute h-0.5 w-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: colors.white,
                top: isMobileMenuOpen ? '50%' : '4px',
                transform: isMobileMenuOpen
                  ? 'translateY(-50%) rotate(45deg)'
                  : 'none',
              }}
            />
            <span
              className="absolute h-0.5 w-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: colors.white,
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              className="absolute h-0.5 w-full transition-all duration-300 ease-out"
              style={{
                backgroundColor: colors.white,
                bottom: isMobileMenuOpen ? '50%' : '4px',
                transform: isMobileMenuOpen
                  ? 'translateY(50%) rotate(-45deg)'
                  : 'none',
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-[80px] left-0 right-0 bottom-0 md:hidden z-50 transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 backdrop-blur-md pointer-events-auto'
            : 'opacity-0 backdrop-blur-none pointer-events-none'
        }`}
        style={{
          backgroundColor: isMobileMenuOpen ? '#0f10129f' : 'transparent',
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {/* Menu content - centered */}
        <div
          className="flex flex-col items-center justify-center h-full space-y-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search */}
          <button
            className={`text-title transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 delay-100'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ color: isActive('/') ? colors.white : colors.gray1 }}
            onClick={() => {
              window.location.href = '/';
              setIsMobileMenuOpen(false);
            }}
          >
            Search
          </button>

          {/* Platform */}
          <button
            className={`text-title flex items-center gap-2 transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 delay-200'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ color: colors.gray1 }}
          >
            <span>Platform</span>
            <img
              src="/Dropdown.svg"
              alt=""
              className="w-3 h-3 brightness-[0.6]"
            />
          </button>

          {/* Info */}
          <button
            className={`text-title transition-all duration-500 ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 delay-300'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ color: isActive('/info') ? colors.white : colors.gray1 }}
            onClick={() => {
              window.location.href = '/info';
              setIsMobileMenuOpen(false);
            }}
          >
            Info
          </button>

          {/* Create post button */}
          <div
            className={`transition-all duration-500 delay-[400ms] ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              variant="primary"
              onClick={() => {
                window.location.href = '/listings/create';
                setIsMobileMenuOpen(false);
              }}
            >
              CREATE A POST
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
