'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function DynamicFavicon() {
  const pathname = usePathname();

  useEffect(() => {
    const updateIcons = () => {
      // Create favicon link if it doesn't exist
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }

      // Create shortcut icon link if it doesn't exist
      let shortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;
      if (!shortcut) {
        shortcut = document.createElement('link');
        shortcut.rel = 'shortcut icon';
        document.head.appendChild(shortcut);
      }

      // Create apple touch icon link if it doesn't exist
      let apple = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (!apple) {
        apple = document.createElement('link');
        apple.rel = 'apple-touch-icon';
        document.head.appendChild(apple);
      }

      const themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
      const bgColor = 'rgb(242, 242, 242)';

      // Determine icon path based on current route
      let iconPath = '/assets/luke-home.png';
      if (pathname === '/bio') {
        iconPath = '/assets/luke-bio.png';
      } else if (pathname === '/projects') {
        iconPath = '/assets/luke-projects.png';
      }

      console.log('Updating favicons:', { pathname, iconPath });

      // Force browser to reload favicon by adding timestamp
      const timestamp = `?t=${Date.now()}`;
      favicon.href = iconPath + timestamp;
      shortcut.href = iconPath + timestamp;
      apple.href = iconPath + timestamp;
      if (themeColor) themeColor.content = bgColor;
    };

    // Update immediately
    updateIcons();

    // Update again after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(updateIcons, 100);

    // Update periodically for a short while to ensure it takes effect
    const intervalId = setInterval(updateIcons, 1000);
    setTimeout(() => clearInterval(intervalId), 5000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [pathname]);

  return null;
} 