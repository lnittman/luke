import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });
const Navigation = dynamic(() => import('@/components/navigation/Navigation'), { ssr: false });

export const metadata: Metadata = {
  title: 'luke nittmann // home',
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
    title: 'luke nittmann',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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