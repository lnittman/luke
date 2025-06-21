import { Analytics } from '@vercel/analytics/next';
import { ModalProvider } from '@/lib/modal-context';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeColorProvider } from '@/components/providers/ThemeColorProvider';
import { viewport, metadata } from './metadata';

import '../styles/global.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="luke nittmann" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f5f4f2" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                const colors = { light: '#f5f4f2', dark: '#161c24', stone: '#2c2a28' };
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
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeColorProvider />
          <ModalProvider>
            {children}
            <Analytics />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export { viewport, metadata };