import type { Metadata } from 'next';

export const metadata: Metadata = {
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