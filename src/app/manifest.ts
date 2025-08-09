import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  // For server-side generation, we'll use dark theme colors by default
  // The client-side ThemeProviderWrapper will handle dynamic theme changes via meta tags
  return {
    name: 'luke nittmann',
    short_name: 'ln',
    description: '2025',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'fullscreen'],
    background_color: '#121820', // Dark theme background (rgb(18, 24, 32))
    theme_color: '#121820', // Dark theme color (rgb(18, 24, 32))
    orientation: 'portrait',
    categories: ['portfolio', 'development'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/assets/logo-2.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/logo-2.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
