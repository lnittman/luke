'use client';

export type Theme = 'light' | 'system' | 'dark';

export const THEMES = [
  { value: 'light' as Theme, label: 'Light', icon: '🌅' },
  { value: 'system' as Theme, label: 'System', icon: '🍃' },
  { value: 'dark' as Theme, label: 'Dark', icon: '🌙' },
];

export function setTheme(theme: Theme) {
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}