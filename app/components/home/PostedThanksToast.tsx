'use client';

import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'motion/react';
import { colors, gradients } from '@/lib/colors';
import { DONATE_URL, MOTION } from '@/lib/constants';

const TOAST_ID = 'posted-thanks';

/**
 * Sticky toast shown after a new post is published. The create page
 * redirects to `/?posted=1`; the flag is read on the client (the home page
 * is static, so it can't read searchParams) and stripped right away so a
 * refresh or shared link doesn't show it again. It stays until closed.
 */
export function PostedThanksToast() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('posted') !== '1') return;
    url.searchParams.delete('posted');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);

    toast.custom(
      (t) => (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -MOTION.rise }}
          animate={
            t.visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -MOTION.rise }
          }
          transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          className="relative w-[calc(100vw-32px)] sm:w-[360px] p-5"
          style={{
            background: gradients.navbar,
            border: `1px solid ${colors.gray2}`,
          }}
        >
          <button
            onClick={() => toast.dismiss(t.id)}
            aria-label="Close"
            className="absolute top-3 right-3 p-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <img src="/XIcon.svg" alt="" width={10} height={10} />
          </button>
          <p className="text-navbar mb-2 pr-8" style={{ color: colors.white }}>
            Your post is live.
          </p>
          <p
            className="text-field-small mb-5"
            style={{ color: colors.gray1, lineHeight: '20px' }}
          >
            GTS is free to use and run by a small team. If it helped, a tip
            keeps it online, and donors get the Donor tag both on the site and in Discord.
          </p>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => toast.dismiss(t.id)}
            className="inline-flex items-center gap-1.5 text-button px-6 py-2.5 press glow-hover"
            style={{ background: gradients.pink, color: colors.black }}
          >
            <img src="/Heart.svg" alt="" width={16} height={16} />
            <span className="text-button">DONATE</span>
          </a>
        </motion.div>
      ),
      // Fixed id so a double-run effect (Strict Mode) can't stack two.
      { id: TOAST_ID, duration: Infinity }
    );
  }, []);

  return <Toaster position="top-center" />;
}
