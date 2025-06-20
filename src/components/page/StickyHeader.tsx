import React from 'react';
import { BlockLoader } from '@/components/BlockLoader';
import styles from './root.module.scss';

interface StickyHeaderProps {
  title: string;
  loaderMode: number;
}

export function StickyHeader({ title, loaderMode }: StickyHeaderProps) {
  return (
    <div className={`${styles.row} sticky top-0 bg-gradient-to-br from-[rgb(var(--background-start))] to-[rgb(var(--background-end))] z-40 border-b border-[rgb(var(--border))]`}>
      <div className={styles.header}>
        <div className={styles.column}>
          <h1>{title}</h1>
          <BlockLoader mode={loaderMode} />
        </div>
      </div>
    </div>
  );
}