'use client';

import { colors } from '@/lib/colors';
import { ReactNode, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EASE } from '@/lib/constants';

interface BaseVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 'wide' is a large scrolling panel for browsing content (game gallery). */
  size?: 'default' | 'wide';
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

export function BaseVerificationModal({
  isOpen,
  onClose,
  children,
  size = 'default',
}: BaseVerificationModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Kept in a ref so steps re-rendering the parent don't re-run the trap.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const opener = document.activeElement as HTMLElement | null;

    // Steps render their own title; label the dialog with it.
    const heading = panel.querySelector('h1, h2, h3');
    if (heading && !heading.id) heading.id = titleId;
    if (heading) panel.setAttribute('aria-labelledby', heading.id);

    const first = panel.querySelector<HTMLElement>('input:not([disabled])');
    (first ?? panel).focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusableIn(panel);
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const head = items[0];
      const tail = items[items.length - 1];
      const active = document.activeElement;
      const inside = panel.contains(active);
      if (e.shiftKey && (active === head || !inside)) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && (active === tail || !inside)) {
        e.preventDefault();
        head.focus();
      }
    };

    // Catches focus escaping by other means (a step unmounting the focused
    // control, clicks on page chrome, dev overlays).
    const onFocusIn = (e: FocusEvent) => {
      if (!panel.contains(e.target as Node)) {
        (focusableIn(panel)[0] ?? panel).focus({ preventScroll: true });
      }
    };

    // A focused control that a step disables or unmounts (e.g. while it
    // loads) drops focus to <body> with no focus event; park it on the panel.
    const observer = new MutationObserver(() => {
      if (document.activeElement === document.body) {
        panel.focus({ preventScroll: true });
      }
    });
    observer.observe(panel, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['disabled'],
    });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      observer.disconnect();
      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen, titleId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0 backdrop-brightness-40"
            style={{ backgroundColor: colors.black + '10' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.25, ease: EASE.out },
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.15, ease: EASE.out },
            }}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className={`relative w-full outline-none ${
              size === 'wide'
                ? 'max-w-[1100px] mx-4 px-5 md:px-10 pt-8 pb-6 max-h-[88dvh] flex flex-col'
                : 'max-w-[762px] px-6 md:px-48 py-8 mx-4 md:mx-0'
            }`}
            style={{ backgroundColor: colors.gray3 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute z-10 top-6 md:top-9 right-4 md:right-8 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <img src="/XIcon.svg" alt="" width="14" height="14" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
