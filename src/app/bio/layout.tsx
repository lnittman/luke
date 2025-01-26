import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'luke nittmann // bio',
  description: '2025',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#FFFFFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'luke nittmann // bio',
  },
  icons: {
    icon: '/assets/luke-bio.png',
    shortcut: '/assets/luke-bio.png',
    apple: '/assets/luke-bio.png',
  },
};

export default function BioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 