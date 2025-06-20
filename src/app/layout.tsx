import { Analytics } from '@vercel/analytics/next';
import { ModalProvider } from '@/lib/modal-context';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
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
        <meta name="theme-color" content="#f2f1ef" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
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