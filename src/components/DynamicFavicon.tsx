'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function DynamicFavicon() {
  const pathname = usePathname();

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    const shortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
    const apple = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;

    let iconPath = '/assets/luke-home.png';
    if (pathname === '/bio') {
      iconPath = '/assets/luke-bio.png';
    } else if (pathname === '/projects') {
      iconPath = '/assets/luke-projects.png';
    }

    if (favicon) favicon.href = iconPath;
    if (shortcut) shortcut.href = iconPath;
    if (apple) apple.href = iconPath;
  }, [pathname]);

  return null;
} 