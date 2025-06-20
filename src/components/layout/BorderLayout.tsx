'use client';

import React from 'react';
import classNames from 'classnames';

interface BorderLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function BorderLayout({ children, className }: BorderLayoutProps) {
  return (
    <div className={classNames('layout-column', className)}>
      {children}
    </div>
  );
}

interface LayoutSectionProps {
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

export function LayoutSection({ children, className, withBorder = false }: LayoutSectionProps) {
  return (
    <div className={classNames('layout-section', { 'layout-row': withBorder }, className)}>
      {children}
    </div>
  );
}

interface LayoutHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function LayoutHeader({ children, className }: LayoutHeaderProps) {
  return (
    <header className={classNames('layout-header', className)}>
      {children}
    </header>
  );
}

interface LayoutFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function LayoutFooter({ children, className }: LayoutFooterProps) {
  return (
    <footer className={classNames('layout-footer', className)}>
      {children}
    </footer>
  );
}