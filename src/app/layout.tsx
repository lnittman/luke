import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { ClientLayout } from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

const Navigation = dynamic(() => import('@/components/navigation/Navigation'), { ssr: false });

export const metadata: Metadata = {
  title: 'luke nittmann',
  description: 'digital craftsman',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    userScalable: false,
    minimumScale: 1,
    maximumScale: 1,
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, minimum-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
          <Navigation />
        </ClientLayout>
      </body>
    </html>
  );
}