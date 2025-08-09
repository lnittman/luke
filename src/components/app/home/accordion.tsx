'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './accordion.module.scss';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.accordion}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.arrow}>
          {isOpen ? '▾' : '▸'}
        </span>
      </button>
      
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
}