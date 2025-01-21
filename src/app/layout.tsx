import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { ClientLayout } from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

const Navigation = dynamic(() => import('@/components/navigation/Navigation'), { ssr: false });

export const metadata: Metadata = {
  title: 'luke nittmann',
  description: 'Personal portfolio and projects showcase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClientLayout>
          {children}
          <Navigation />
        </ClientLayout>
      </body>
    </html>
  );
}