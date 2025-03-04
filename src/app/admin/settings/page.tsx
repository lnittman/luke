import React from 'react';

export const metadata = {
  title: 'Settings Manager',
  description: 'Manage application settings and configurations',
};

export default function SettingsAdminPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings Manager</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page will allow you to manage application settings and configurations.
        Currently under development.
      </p>
    </div>
  );
} 