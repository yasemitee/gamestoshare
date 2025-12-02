import type { Metadata } from 'next';
import { Lexend_Exa, Quando } from 'next/font/google';
import './globals.css';

const lexendExa = Lexend_Exa({
  subsets: ['latin'],
  variable: '--font-lexend-exa',
  display: 'swap',
});

const quando = Quando({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-quando',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GamesToShare',
  description:
    'Platform to share your game library with friends and meet new gamers. No registration required.',
  themeColor: '#0B0B0C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${lexendExa.variable} ${quando.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={lexendExa.className}>{children}</body>
    </html>
  );
}
