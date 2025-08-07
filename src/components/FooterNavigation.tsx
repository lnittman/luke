'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import classNames from 'classnames';
import { useIsMobile } from '@/hooks/useIsMobile';
import styles from './FooterNavigation.module.scss';

const NAV_ITEMS = [
  { label: 'HOME', href: '/', hotkey: 'h' },
  { label: 'ABOUT', href: '/about', hotkey: 'a' },
  { label: 'WORK', href: '/work', hotkey: 'w' },
  { label: 'PROJECTS', href: '/projects', hotkey: 'p' },
  { label: 'LOGS', href: '/logs', hotkey: 'l' },
];

export function FooterNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger if modifier keys are pressed (to avoid conflicts with browser shortcuts)
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();
      const item = NAV_ITEMS.find(item => item.hotkey === key);
      
      if (item && item.href !== pathname) {
        event.preventDefault();
        router.push(item.href);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, pathname]);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item, index) => (
          <React.Fragment key={item.href}>
            <button
              onClick={() => router.push(item.href)}
              className={classNames(styles.button, {
                [styles.active]: pathname === item.href
              })}
            >
              {item.label}
              {!isMobile && (
                <span className={styles.hotkey}>({item.hotkey})</span>
              )}
            </button>
            {index < NAV_ITEMS.length - 1 && (
              <span className={styles.separator}>|</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className={styles.contact}>
        <button
          onClick={() => window.location.href = 'mailto:luke.nittmann@gmail.com'}
          className={styles.button}
        >
          email
        </button>
        <span className={styles.separator}>|</span>
        <button
          onClick={() => window.open('https://github.com/lnittman', '_blank')}
          className={styles.button}
        >
          github
        </button>
      </div>
    </div>
  );
}