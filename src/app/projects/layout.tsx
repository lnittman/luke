import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  title: 'luke nittmann // projects',
  description: '2025',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'luke nittmann // projects',
  },
  icons: {
    icon: '/assets/luke-projects.png',
    shortcut: '/assets/luke-projects.png',
    apple: '/assets/luke-projects.png',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 