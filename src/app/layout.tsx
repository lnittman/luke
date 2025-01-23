import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { DynamicFavicon } from '@/components/DynamicFavicon';

const inter = Inter({ subsets: ['latin'] });

const Navigation = dynamic(() => import('@/components/navigation/Navigation'), { ssr: false });

export const metadata: Metadata = {
  title: 'luke nittmann',
  description: 'digital craftsman',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/assets/luke-home.png',
    shortcut: '/assets/luke-home.png',
    apple: '/assets/luke-home.png',
  },
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/luke-home.png" />
        <link rel="shortcut icon" href="/assets/luke-home.png" />
        <link rel="apple-touch-icon" href="/assets/luke-home.png" />
      </head>
      <body className={inter.className}>
        <DynamicFavicon />
        <ClientLayout>
          {children}
          <Navigation />
        </ClientLayout>
      </body>
    </html>
  );
}