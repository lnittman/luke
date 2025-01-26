import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'luke nittmann // projects',
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