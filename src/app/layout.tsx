import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });
const Navigation = dynamic(() => import('@/components/navigation/Navigation'), { ssr: false });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  title: 'luke nittmann // home',
  description: '2025',
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
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, maximum-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="luke nittmann" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
          <Navigation />
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}