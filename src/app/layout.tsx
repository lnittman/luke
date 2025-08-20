import { Analytics } from '@vercel/analytics/next'
import { KeyboardShortcuts } from '@/components/shared/keyboard-shortcuts'
import { SearchModal } from '@/components/shared/search-modal'
import { ThemeColorProvider } from '@/components/shared/theme-color-provider'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { ModalProvider } from '@/lib/modal-context'
import { metadata, viewport } from './metadata'

import '../styles/global.scss'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="luke nittmann" name="apple-mobile-web-app-title" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="#f5f4f2" name="theme-color" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                // Use the same colors as CSS variables (--background-start)
                const colors = { 
                  light: '#f5f4f2', 
                  dark: '#161c24'
                };
                document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[theme] || colors.light);
              } catch {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem={false}
        >
          <ThemeColorProvider />
          <ModalProvider>
            <SearchModal />
            <KeyboardShortcuts />
            {children}
            <Analytics />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export { viewport, metadata }
