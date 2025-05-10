import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'luke nittmann',
  description: 'software engineer',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'luke nittmann'
  },
  // Next.js will automatically link the manifest from src/app/manifest.ts
  icons: {
    icon: '/assets/luke-home.png',
    shortcut: '/assets/luke-home.png',
    apple: '/assets/luke-home.png',
  },
};
