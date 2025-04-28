import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';

import './globals.css';
import { ClientLayout } from './client-layout';
import { ThemeProviderWrapper } from '@/components/theme/theme-provider-wrapper';

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
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/luke-home.png',
    shortcut: '/assets/luke-home.png',
    apple: '/assets/luke-home.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="luke nittmann" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProviderWrapper>
          <ClientLayout>
            {children}
            <Analytics />
          </ClientLayout>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}