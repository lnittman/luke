import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TechDoc {
  name: string;
  lastUpdated: string;
  url?: string;
}

export function TechStackManager() {
  const [techDocs, setTechDocs] = useState<TechDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTechName, setNewTechName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Load tech docs on component mount
  useEffect(() => {
    fetchTechDocs();
  }, []);
  
  // Fetch the list of tech docs from the API
  const fetchTechDocs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/blob/list');
      const data = await response.json();
      
      // Filter for tech-*.md files and format the data
      const techDocs = data.blobs
        .filter((blob: any) => blob.pathname.startsWith('tech-') && blob.pathname.endsWith('.md'))
        .map((blob: any) => {
          const name = blob.pathname.replace('tech-', '').replace('.md', '');
          return {
            name: name.replace(/-/g, ' '),
            lastUpdated: new Date(blob.uploadedAt).toLocaleDateString(),
            url: blob.url
          };
        });
      
      setTechDocs(techDocs);
    } catch (error) {
      console.error('Error fetching tech docs:', error);
      toast.error('Failed to fetch tech documentation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a new tech stack documentation
  const generateTechDoc = async () => {
    if (!newTechName.trim()) {
      toast.error('Please enter a technology name');
      return;
    }
    
    try {
      setIsGenerating(true);
      toast.info(`Generating documentation for ${newTechName}...`, {
        duration: 5000
      });
      
      const response = await fetch('/api/tech/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ framework: newTechName })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      toast.success(`Successfully generated documentation for ${newTechName}`, {
        duration: 5000
      });
      
      // Refresh the tech doc list
      fetchTechDocs();
      
      // Clear the input
      setNewTechName('');
    } catch (error) {
      console.error('Error generating tech doc:', error);
      toast.error(`Failed to generate documentation for ${newTechName}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Run the tech docs update scheduler
  const runScheduler = async () => {
    try {
      toast.info('Checking for tech docs that need updating...', {
        duration: 5000
      });
      
      const response = await fetch('/api/tech/scheduler');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      toast.success(data.message, {
        duration: 5000
      });
      
      // Refresh the tech doc list
      fetchTechDocs();
    } catch (error) {
      console.error('Error running scheduler:', error);
      toast.error('Failed to run tech documentation scheduler');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tech Stack Documentation</CardTitle>
          <CardDescription>
            Generate and manage comprehensive documentation for technology stacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="tech-name">Generate New Tech Stack Documentation</Label>
              <div className="flex space-x-2">
                <Input
                  id="tech-name"
                  placeholder="Enter technology name (e.g., React Native)"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  disabled={isGenerating}
                />
                <Button 
                  onClick={generateTechDoc} 
                  disabled={isGenerating || !newTechName.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Available Tech Stacks</h3>
              <Button 
                variant="outline" 
                onClick={runScheduler}
              >
                Check for Updates
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : techDocs.length > 0 ? (
              <div className="space-y-2">
                {techDocs.map((doc) => (
                  <div 
                    key={doc.name} 
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {doc.lastUpdated}
                      </p>
                    </div>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="sm">
                        View Docs
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">
                  No tech stack documentation available. Generate one to get started.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Tech stack documentation is automatically updated weekly and stored in Vercel Blob.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 