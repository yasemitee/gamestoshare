import type { Metadata } from 'next';
import { Lexend_Exa, Quando } from 'next/font/google';
import './globals.css';
import { colors, gradients } from './lib/colors';

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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${lexendExa.variable} ${quando.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any"></link>
        {/*Simple Analytics*/}
        <script
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4146851439004145"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={lexendExa.className}
        style={{ backgroundColor: '#2C3137' }}
      >
        {children}
      </body>
    </html>
  );
}
