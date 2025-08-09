import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects Showcase | Luke Nittmann',
  description:
    "Explore Luke's portfolio of AI-powered projects with smooth scrolling, interactive animations, and ASCII art interludes.",
}

export default function ScrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
