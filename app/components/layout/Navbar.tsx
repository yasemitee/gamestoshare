'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { colors, shadowbox } from '@/lib/colors';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

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
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
    }
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      initial={false}
      animate={{
        background: isScrolled
          ? 'linear-gradient(180deg, #1C1F23 0%, #0F1012 100%)'
          : 'linear-gradient(180deg, rgba(28, 31, 35, 0) 0%, rgba(15, 16, 18, 0) 100%)',
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={`fixed top-0 left-0 right-0 z-[60] py-4 ${
        isScrolled ? 'backdrop-blur-sm' : ''
      }`}
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
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-navbar flex items-center gap-2 cursor-pointer transition-colors hover:!text-white"
            style={{ color: isActive('/') ? colors.white : colors.gray1 }}
            onClick={() => (window.location.href = '/')}
          >
            Search
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-navbar flex items-center gap-2 cursor-pointer outline-none group"
          >
            <span
              className="transition-colors group-hover:!text-white"
              style={{ color: colors.gray1 }}
            >
              Platform
            </span>
            <img
              src="/Dropdown.svg"
              alt=""
              className="w-3 h-3 pt-1 transition-[filter] brightness-[0.6] group-hover:!brightness-[10]"
            />
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-navbar cursor-pointer transition-colors hover:!text-white"
            style={{ color: isActive('/info') ? colors.white : colors.gray1 }}
            onClick={() => (window.location.href = '/info')}
          >
            Info
          </motion.button>
        </div>

        <motion.div
          whileHover={{
            boxShadow: shadowbox.medium,
            filter: 'brightness(1.1)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="hidden md:block"
        >
          <Button
            variant="primary"
            onClick={() => (window.location.href = '/listings/create')}
          >
            CREATE A POST
          </Button>
        </motion.div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 relative w-10 h-10 flex items-center justify-center z-[70]"
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full md:hidden z-40"
            style={{
              backgroundColor: 'rgba(11, 11, 12, 0.95)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              height: '100dvh',
              minHeight: '100vh',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Menu content - centered */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full space-y-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search */}
              <button
                className="text-title"
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
                className="text-title flex items-center gap-2"
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
                className="text-title"
                style={{
                  color: isActive('/info') ? colors.white : colors.gray1,
                }}
                onClick={() => {
                  window.location.href = '/info';
                  setIsMobileMenuOpen(false);
                }}
              >
                Info
              </button>

              {/* Create post button */}
              <div>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
