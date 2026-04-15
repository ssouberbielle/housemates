import type { Metadata, Viewport } from 'next';
import { Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HOUSE MATES',
  description: 'Fiesta privada · Montevideo',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${mono.variable}`}>
      <body className="relative min-h-screen bg-ink font-sans text-bone antialiased">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 grain" />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
