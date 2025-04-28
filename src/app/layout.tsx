import { Analytics } from '@vercel/analytics/next';

import { ThemeProviderWrapper } from '@/components/theme/theme-provider-wrapper';

import { ClientLayout } from './client-layout';
import './globals.css';
import { viewport, metadata } from './metadata';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="luke nittmann" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProviderWrapper>
          <ClientLayout>
            {children}
            <Analytics />
          </ClientLayout>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

export { viewport, metadata };