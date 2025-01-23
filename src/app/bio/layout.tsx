import type { Metadata } from 'next';

export const metadata: Metadata = {
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