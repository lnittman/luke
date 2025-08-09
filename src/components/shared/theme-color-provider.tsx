'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

function parseRgbTriplet(rgbTriplet: string): { r: number; g: number; b: number } | null {
  const parts = rgbTriplet.trim().split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [r, g, b] = parts;
  return { r, g, b };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getThemeChromeColor(): string | null {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  // Use the top-viewport color so it visually matches the chrome.
  // Our background is a gradient from --background-start to --background-end
  // angled at 135deg; the top-left begins at --background-start.
  const start = styles.getPropertyValue('--background-start');
  const parsed = parseRgbTriplet(start);
  if (!parsed) return null;
  return rgbToHex(parsed);
}

function setMetaThemeColor(color: string) {
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
    return;
  }
  // Some mobile browsers (iOS) do not repaint on content mutation.
  // Replace the node to force UI to pick up the new color.
  const replacement = meta.cloneNode() as HTMLMetaElement;
  replacement.setAttribute('content', color);
  meta.replaceWith(replacement);
}

function setAppleStatusBar(theme: string | undefined) {
  const isDark = theme === 'dark' || theme === 'stone';
  let meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-status-bar-style';
    document.head.appendChild(meta);
  }
  // iOS allows only preset values; choose best contrast per theme
  meta.content = isDark ? 'black-translucent' : 'default';
}

export function ThemeColorProvider() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const update = () => {
      const hex = getThemeChromeColor();
      if (hex) setMetaThemeColor(hex);
      const currentTheme = theme === 'system' ? systemTheme : theme;
      setAppleStatusBar(currentTheme ?? undefined);
    };

    // Initial sync after mount (CSS variables are ready now)
    update();

    // React instantly to attribute changes from the theme library
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          update();
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    // Also update when our theme state changes
    // This covers programmatic theme switches
    update();

    return () => observer.disconnect();
  }, [theme, systemTheme]);

  return null;
}