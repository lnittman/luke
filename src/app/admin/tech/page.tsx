import React from 'react';
import { TechStackManager } from '@/components/TechStackManager';

export const metadata = {
  title: 'Tech Stack Documentation Manager',
  description: 'Manage and generate comprehensive tech stack documentation',
};

export default function TechStackAdminPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tech Stack Documentation Manager</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Generate, update, and manage comprehensive documentation for technology stacks.
        This system automatically creates detailed markdown files with the latest information 
        about frameworks, libraries, and tools.
      </p>
      
      <TechStackManager />
    </div>
  );
} 