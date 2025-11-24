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
  title: 'gamestoshare',
  description: 'gamestoshar platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${lexendExa.variable} ${quando.variable}`}>
      <body className={lexendExa.className}>{children}</body>
    </html>
  );
}
