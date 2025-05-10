import { Analytics } from '@vercel/analytics/next';

import { ThemeProviderWrapper } from '@/components/theme/theme-provider-wrapper';

import { ClientLayout } from './client-layout';
import { viewport, metadata } from './metadata';

import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark overflow-hidden h-screen" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="luke nittmann" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="overflow-hidden h-screen" suppressHydrationWarning>
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