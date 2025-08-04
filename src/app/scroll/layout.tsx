import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scroll Experience | Luke Nittmann',
  description: 'An immersive scroll experience with Lenis smooth scrolling, WebGL fluid simulations, and brutalist design.',
};

export default function ScrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}