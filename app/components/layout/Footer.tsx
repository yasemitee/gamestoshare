import { colors, gradients } from '@/lib/colors';
import { DONATE_URL } from '@/lib/constants';

export function Footer() {
  return (
    <footer
      className="mt-32 py-5.5 border-t mb-0"
      style={{ borderColor: colors.gray2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <p
          className="text-field-small text-center sm:text-left"
          style={{ color: colors.gray1 }}
        >
          Copyright © Gamestoshare.com All Rights Reserved
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-16">
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lift-hover text-navbar flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span
              style={{
                background: gradients.pink,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              Support GTS
            </span>
            {/* Heart.svg is a black stroke; used as a mask so it takes the pink gradient. */}
            <span
              aria-hidden="true"
              className="inline-block w-4 h-4"
              style={{
                background: gradients.pink,
                WebkitMask: 'url(/Heart.svg) center / contain no-repeat',
                mask: 'url(/Heart.svg) center / contain no-repeat',
              }}
            />
          </a>
          <a
            href="/terms"
            className="text-navbar hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            T&C
          </a>
          <a
            href="https://x.com/gamestoshare"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/XSocialLogo.svg"
              alt="X (Twitter)"
              width={16}
              height={16}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </a>
          <a
            href="https://discord.gg/mavhKaDRCv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navbar flex items-center gap-2 text-navbar hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            Discord
            <img
              src="/Discord.svg"
              alt="Discord"
              width={16}
              height={16}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
