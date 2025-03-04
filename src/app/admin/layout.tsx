'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              ← Back to App
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Luke Admin</h1>
        </div>
      </header>
      
      <AdminTabs />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function AdminTabs() {
  const pathname = usePathname();
  
  const tabs = [
    { value: "/admin/tech", label: "Tech Stacks" },
    { value: "/admin/projects", label: "Projects" },
    { value: "/admin/settings", label: "Settings" },
  ];
  
  // Find the active tab
  const activeTab = tabs.find(tab => pathname?.startsWith(tab.value)) || tabs[0];
  
  return (
    <div className="border-b py-2 px-4">
      <Tabs defaultValue={activeTab.value} className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px]">
          {tabs.map(tab => (
            <Link key={tab.value} href={tab.value}>
              <TabsTrigger value={tab.value} className="w-full">
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 