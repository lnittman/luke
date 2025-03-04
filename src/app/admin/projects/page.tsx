import React from 'react';

export const metadata = {
  title: 'Projects Manager',
  description: 'Manage project templates and configurations',
};

export default function ProjectsAdminPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Projects Manager</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page will allow you to manage project templates and configurations.
        Currently under development.
      </p>
    </div>
  );
} 