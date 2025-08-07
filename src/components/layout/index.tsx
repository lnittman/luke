'use client';

import React from 'react';

export { LayoutSection as Section } from './BorderLayout';

// Simple Container component for consistency
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background-start))] to-[rgb(var(--background-end))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}