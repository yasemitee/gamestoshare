import { colors } from '@/lib/colors';

export function Footer() {
  return (
    <footer
      className="mt-32 py-5.5 border-t mb-0"
      style={{ borderColor: colors.gray2 }}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <p className="text-field-small" style={{ color: colors.gray1 }}>
          Copyright © Gamestoshare.com All Rights Reserved
        </p>
        <div className="flex items-center gap-16">
          <a
            href="/terms"
            className="text-navbar hover:opacity-80 transition-opacity"
            style={{ color: colors.white }}
          >
            T&C
          </a>
          <a
            href="https://discord.gg/todo"
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
