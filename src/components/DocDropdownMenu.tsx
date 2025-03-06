import React, { useState, useEffect } from 'react';
import { FilesIcon, FileText, Search, Link, Plus, Edit, X, RefreshCw } from 'lucide-react';
import { DocItem } from '@/lib/hooks/useDocumentManager';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TechPill } from '@/components/TechPill';
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface DocDropdownMenuProps {
  documents: DocItem[];
  onDocumentClick: (doc: DocItem) => void;
  onMarkAsRead: (id: string) => void;
}

export function DocDropdownMenu({ 
  documents, 
  onDocumentClick, 
  onMarkAsRead 
}: DocDropdownMenuProps) {
  const unreadCount = documents.filter(doc => !doc.read).length;
  const sortedDocs = [...documents].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // State for expanded document
  const [expandedDoc, setExpandedDoc] = useState<DocItem | null>(null);
  // State to control dropdown open state
  const [open, setOpen] = useState(false);
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("project");
  // State for tech files - empty by default
  const [techFiles, setTechFiles] = useState<{name: string, content: string}[]>([]);
  // State for read files - empty by default
  const [readFiles, setReadFiles] = useState<{name: string, content: string}[]>([]);
  // State for social files - empty by default
  const [socialFiles, setSocialFiles] = useState<{name: string, content: string}[]>([]);
  // State for selected tech file
  const [selectedTechFile, setSelectedTechFile] = useState<{name: string, content: string, category?: string} | null>(null);
  // State for search input
  const [searchInput, setSearchInput] = useState("");
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  // State for processing status
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  // State for active doc category (tech, read, social)
  const [activeDocCategory, setActiveDocCategory] = useState<string>("tech");
  // State for suggested docs
  const [suggestedDocs, setSuggestedDocs] = useState<{name: string, description: string, category: string}[]>([
    { name: "next.js", description: "React framework for production", category: "tech" },
    { name: "typescript", description: "JavaScript with syntax for types", category: "tech" },
    { name: "tailwind css", description: "Utility-first CSS framework", category: "tech" },
    { name: "ai research", description: "Latest AI developments", category: "read" },
    { name: "UI/UX trends", description: "Current design patterns", category: "read" },
    { name: "GitHub discussions", description: "Open source community", category: "social" }
  ]);
  // State for selected suggested docs
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  // State for suggestion metadata
  const [suggestionMeta, setSuggestionMeta] = useState<string>("Suggestions curated from trending GitHub repositories, popular technical blogs, and active community discussions.");
  // State for refreshing suggestions
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);
  
  // Fetch tech files when dropdown is opened - they're all empty now
  useEffect(() => {
    if (open) {
      // Empty folders as per actual filesystem
      setTechFiles([]);
      setReadFiles([]);
      setSocialFiles([]);
    }
  }, [open]);

  // Function to handle tech file clicks
  const handleTechFileClick = async (fileName: string, category: string = "tech") => {
    try {
      // In a real implementation, this would use a proper API endpoint
      // For this example, we'll simulate fetching the file content
      let content = "";
      
      // Read the actual content if available
      if (fileName === "tech.md") {
        content = `# Tech Documentation

This document outlines the technical architecture of the Luke application.

## Overview

Luke is a digital craftsman that helps users generate, refine, and implement project ideas. It uses AI to provide guidance, generate content, and help users build their projects.

## Key Components

1. **Project Generation**: Helps users create new projects with customizable templates
2. **Tech Documentation**: Provides access to technical documentation for various technologies
3. **Documentation Manager**: Manages documents generated during project creation
4. **UI Components**: React components for creating an intuitive user interface

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js APIs
- **AI Integration**: Claude and Perplexity for generating content
- **Storage**: Local file system for documents`;
      } else if (fileName === "charm.md") {
        content = `# Charm Documentation

Charm is a collection of terminal user interface (TUI) components for building beautiful command-line applications in Go.

## Installation

\`\`\`bash
go get github.com/charmbracelet/charm
\`\`\`

## Key Components

- **Bubbles**: A TUI component library
- **Lipgloss**: Styling primitives for terminal applications
- **Glow**: Render Markdown in the terminal
- **Wish**: Make SSH apps

## Example Usage

\`\`\`go
package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	p := tea.NewProgram(initialModel())
	if err := p.Start(); err != nil {
		fmt.Printf("Error: %v\\n", err)
		os.Exit(1)
	}
}
\`\`\``;
      } else if (fileName === "relationships.json") {
        content = `{
  "tech": {
    "related": ["next.js", "react", "typescript", "tailwind"]
  },
  "next.js": {
    "related": ["react", "vercel", "api-routes", "server-components"]
  },
  "react": {
    "related": ["hooks", "components", "jsx", "state-management"]
  },
  "tailwind": {
    "related": ["css", "styling", "ui", "responsive-design"]
  }
}`;
      } else if (category === "read") {
        // Read category content
        content = `# ${fileName.replace('.md', '')}\n\nThis is sample content for a reading article in the @read category.`;
      } else if (category === "social") {
        // Social category content
        content = `# ${fileName.replace('.md', '')}\n\nThis is sample content for a social media post in the @social category.`;
      } else {
        // Dynamic content
        content = `# ${fileName.replace('.md', '')}\n\nThis is dynamically generated content for the file.`;
      }
      
      // Create a document to display
      setSelectedTechFile({
        name: fileName,
        content,
        category
      });
    } catch (error) {
      console.error("Error loading tech file:", error);
      setSelectedTechFile({
        name: fileName,
        content: `# Error\n\nCould not load content for ${fileName}`,
        category
      });
    }
  };
  
  // Function to process URL or search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setProcessingStatus("processing...");

    const isProjectTab = activeTab === "project";
    
    if (isProjectTab) {
      // For project tab, simulate searching through project documents
      setProcessingStatus(`searching project documents for "${searchInput}"...`);
      
      setTimeout(() => {
        // Simulate finding results in project documents
        setProcessingStatus("found matching documents");
        setTimeout(() => {
          setProcessingStatus(null);
          setSearchInput("");
          // In a real implementation, this would filter and highlight relevant project documents
        }, 1000);
      }, 1000);
      return;
    }
    
    // For documentation tab
    // Check if input is a URL
    const isUrl = searchInput.startsWith('http') || searchInput.includes('www.');
    
    setTimeout(() => {
      if (isUrl) {
        setProcessingStatus(`processing ${searchInput} via r.jina.ai...`);
        // Simulate API call for URL processing
        setTimeout(() => {
          // Add the tech file after processing
          const newFileName = searchInput.split('/').pop() || 'untitled';
          const newFile = {
            name: `${newFileName}.md`,
            content: `# Documentation for ${searchInput}\n\nProcessed through r.jina.ai\n\n## Overview\n\nThis documentation was automatically fetched and processed from ${searchInput}.`
          };
          
          // Add to appropriate category
          if (activeDocCategory === "tech") {
            setTechFiles(prev => [...prev, newFile]);
          } else if (activeDocCategory === "read") {
            setReadFiles(prev => [...prev, newFile]);
          } else if (activeDocCategory === "social") {
            setSocialFiles(prev => [...prev, newFile]);
          }
          
          setProcessingStatus("✓ processing complete");
          setTimeout(() => setProcessingStatus(null), 2000);
          setSearchInput("");
        }, 2000);
      } else {
        // Handle search term
        setProcessingStatus(`searching for ${activeDocCategory} docs on "${searchInput}"...`);
        // Simulate search plan creation
        setTimeout(() => {
          setProcessingStatus(`found resources for "${searchInput}"`);
          // Simulate finding results
          setTimeout(() => {
            // Add the tech file after processing
            const newFile = {
              name: `${searchInput.toLowerCase().replace(/\s+/g, '-')}.md`,
              content: `# ${searchInput} Documentation\n\n## Overview\n\nThis is auto-generated documentation for ${searchInput} in the ${activeDocCategory} category.\n\n## Resources\n\n- [Official Documentation](https://example.com/${searchInput})\n- [GitHub Repository](https://github.com/example/${searchInput})\n- [Tutorials](https://tutorials.com/${searchInput})`
            };
            
            // Add to appropriate category
            if (activeDocCategory === "tech") {
              setTechFiles(prev => [...prev, newFile]);
            } else if (activeDocCategory === "read") {
              setReadFiles(prev => [...prev, newFile]);
            } else if (activeDocCategory === "social") {
              setSocialFiles(prev => [...prev, newFile]);
            }
            
            setProcessingStatus("✓ documentation generated");
            setTimeout(() => setProcessingStatus(null), 2000);
            setSearchInput("");
          }, 1500);
        }, 1500);
      }
    }, 500);
  };
  
  // Function to delete tech file
  const handleDeleteTechFile = (fileName: string, category: string = "tech") => {
    if (category === "tech") {
      setTechFiles(techFiles.filter(file => file.name !== fileName));
    } else if (category === "read") {
      setReadFiles(readFiles.filter(file => file.name !== fileName));
    } else if (category === "social") {
      setSocialFiles(socialFiles.filter(file => file.name !== fileName));
    }
    
    if (selectedTechFile?.name === fileName) {
      setSelectedTechFile(null);
    }
  };
  
  // Function to handle suggestion click
  const handleSuggestionClick = (suggestionName: string) => {
    if (selectedSuggestions.includes(suggestionName)) {
      setSelectedSuggestions(prev => prev.filter(name => name !== suggestionName));
    } else {
      setSelectedSuggestions(prev => [...prev, suggestionName]);
    }
  };
  
  // Function to add all selected suggestions
  const addSelectedSuggestions = () => {
    // Get all selected suggestions
    const toAdd = suggestedDocs.filter(s => selectedSuggestions.includes(s.name));
    
    // Process each suggestion
    toAdd.forEach(suggestion => {
      const newFile = {
        name: `${suggestion.name.toLowerCase().replace(/\s+/g, '-')}.md`,
        content: `# ${suggestion.name}\n\n${suggestion.description}\n\n## Generated Content\n\nThis document was automatically generated based on Luke's suggestion system.`
      };
      
      // Add to appropriate category
      if (suggestion.category === "tech") {
        setTechFiles(prev => [...prev, newFile]);
      } else if (suggestion.category === "read") {
        setReadFiles(prev => [...prev, newFile]);
      } else if (suggestion.category === "social") {
        setSocialFiles(prev => [...prev, newFile]);
      }
    });
    
    // Remove added suggestions from list
    setSuggestedDocs(prev => prev.filter(s => !selectedSuggestions.includes(s.name)));
    setSelectedSuggestions([]);
    
    setProcessingStatus("✓ added to documentation");
    setTimeout(() => setProcessingStatus(null), 2000);
  };
  
  // Function to refresh suggestions
  const refreshSuggestions = async () => {
    setIsRefreshingSuggestions(true);
    setProcessingStatus("refreshing suggestions...");
    
    // Simulate API call to get trending topics
    setTimeout(() => {
      // Update suggestions based on category
      if (activeDocCategory === "tech") {
        setSuggestedDocs([
          { name: "react", description: "A JavaScript library for building user interfaces", category: "tech" },
          { name: "astro", description: "Framework for building content-focused websites", category: "tech" },
          { name: "bun", description: "Fast JavaScript runtime, bundler, and package manager", category: "tech" },
          { name: "svelte", description: "Cybernetically enhanced web apps", category: "tech" }
        ]);
        setSuggestionMeta("Curated from trending GitHub repositories, HackerNews discussions, and developer surveys. Focus on modern web development frameworks and tools.");
      } else if (activeDocCategory === "read") {
        setSuggestedDocs([
          { name: "AI alignment", description: "Ensuring AI systems are aligned with human values", category: "read" },
          { name: "WebGPU", description: "Next generation graphics API for the web", category: "read" },
          { name: "system design", description: "Principles of designing large-scale systems", category: "read" }
        ]);
        setSuggestionMeta("Curated from top technical blogs, academic papers, and industry publications. Focus on emerging technologies and best practices.");
      } else if (activeDocCategory === "social") {
        setSuggestedDocs([
          { name: "coding standards", description: "Community discussions on coding standards", category: "social" },
          { name: "open source contribution", description: "How to contribute to open source projects", category: "social" },
          { name: "remote collaboration", description: "Tools and practices for remote development teams", category: "social" }
        ]);
        setSuggestionMeta("Curated from active discussions on GitHub, Stack Overflow, and tech forums. Focus on community-driven knowledge and collaboration.");
      }
      
      setProcessingStatus("✓ suggestions refreshed");
      setTimeout(() => setProcessingStatus(null), 1500);
      setIsRefreshingSuggestions(false);
    }, 2000);
  };
  
  // Group documents by source/category - we'll use title as a way to identify doc type 
  const groupedDocs: Record<string, DocItem[]> = {};
  
  sortedDocs.forEach(doc => {
    let docType = 'other';
    
    // Determine document type from title
    if (doc.title.toLowerCase().includes('tech')) docType = 'tech';
    else if (doc.title.toLowerCase().includes('index')) docType = 'index';
    else if (doc.title.toLowerCase().includes('design')) docType = 'design';
    else if (doc.title.toLowerCase().includes('code')) docType = 'code';
    else if (doc.title.toLowerCase().includes('init')) docType = 'init';
    else if (doc.title.toLowerCase().includes('search')) docType = 'search';
    
    if (!groupedDocs[docType]) {
      groupedDocs[docType] = [];
    }
    
    groupedDocs[docType].push(doc);
  });

  // Filter documents for each tab
  const projectDocs = sortedDocs.filter(doc => 
    !doc.title.toLowerCase().includes('tech')
  );
  
  const techDocs = sortedDocs.filter(doc => 
    doc.title.toLowerCase().includes('tech')
  );

  // Order of document types
  const typeOrder = ['tech', 'index', 'design', 'code', 'init', 'search'];
  const sortedTypes = Object.keys(groupedDocs).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  const handleDocClick = (doc: DocItem, e: React.MouseEvent) => {
    // Prevent default to avoid dropdown closing
    e.preventDefault();
    e.stopPropagation();
    
    if (!doc.read) {
      onMarkAsRead(doc.id);
    }
    
    // Toggle expanded state if clicking the same doc
    if (expandedDoc?.id === doc.id) {
      setExpandedDoc(null);
    } else {
      setExpandedDoc(doc);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div 
          className={cn(
            "fixed bottom-4 right-4 z-[400] p-2.5 rounded-xl transition-colors duration-300",
            "bg-[rgb(var(--surface-1)/0.15)] hover:bg-[rgb(var(--surface-1)/0.25)] glass-effect shadow-lg",
            documents.length === 0 && "opacity-60"
          )}
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12">
            <Image 
              src="/assets/digital-craftsman.png" 
              alt="documents" 
              width={32} 
              height={32} 
              className="w-7 h-7 sm:w-8 sm:h-8"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        sideOffset={5}
        className="w-[500px] max-h-[80vh] overflow-y-auto bg-background/80 backdrop-blur-sm border border-border shadow-lg z-[500] "
      >
        <DropdownMenuLabel className="flex items-center justify-between lowercase">
          {expandedDoc && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandedDoc(null);
              }} 
              className="text-xs text-muted-foreground hover:text-foreground lowercase"
            >
              back to list
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!expandedDoc ? (
          // Document list view with tabs
          <div className="w-full">
            <Tabs defaultValue="project" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2 !p-0 !pt-0 h-8">
                <TabsTrigger value="project" className="lowercase h-full">🤖 project</TabsTrigger>
                <TabsTrigger value="documentation" className="lowercase h-full">🌐 documentation</TabsTrigger>
              </TabsList>
              
              {/* Search input for both tabs */}
              <div className="px-2 pb-2 relative">
                <form onSubmit={handleSearchSubmit} className="flex space-x-1">
                  <Input
                    type="text"
                    placeholder={activeTab === "project" 
                      ? "search through project documents..." 
                      : "search or paste url to add docs..."}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-8 text-xs focus-visible:ring-0 bg-background/50"
                  />
                  <button 
                    type="submit" 
                    className={cn(
                      "text-xs px-2 rounded bg-accent/50 hover:bg-accent text-accent-foreground h-8 flex items-center transform transition-transform hover:translate-x-0.5",
                      selectedSuggestions.length > 0 && activeTab === "documentation" ? "bg-blue-500/30 hover:bg-blue-500/50 text-blue-800 dark:text-blue-300" : ""
                    )}
                    onClick={(e) => {
                      if (selectedSuggestions.length > 0 && activeTab === "documentation") {
                        e.preventDefault();
                        addSelectedSuggestions();
                      }
                    }}
                  >
                    <span className="text-base">👉</span>
                  </button>
                  
                  {/* Refresh button - only show in documentation tab */}
                  {activeTab === "documentation" && (
                    <button 
                      type="button"
                      onClick={() => refreshSuggestions()}
                      disabled={isRefreshingSuggestions}
                      className="text-xs px-2 rounded bg-accent/30 hover:bg-accent/50 text-accent-foreground h-8 flex items-center gap-1"
                    >
                      <RefreshCw className={cn(
                        "h-3 w-3", 
                        isRefreshingSuggestions && "animate-spin"
                      )} />
                    </button>
                  )}
                </form>
                {processingStatus && (
                  <div className="absolute left-0 right-0 text-center mt-1 text-xs text-muted-foreground italic">
                    {processingStatus}
                  </div>
                )}
                
                {/* Suggested docs below search bar - only show in documentation tab */}
                {activeTab === "documentation" && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {suggestedDocs
                        .filter(s => s.category === activeDocCategory)
                        .map(suggestion => (
                          <div 
                            key={suggestion.name}
                            onClick={() => handleSuggestionClick(suggestion.name)}
                            className={cn(
                              "px-2 py-1 border border-slate-200/30 dark:border-slate-700/30 rounded-md text-xs cursor-pointer transition-colors",
                              selectedSuggestions.includes(suggestion.name) 
                                ? "bg-accent/30 border-accent/30" 
                                : "bg-background hover:bg-accent/10"
                            )}
                          >
                            {suggestion.name}
                          </div>
                        ))}
                    </div>
                    
                    {/* Metadata about suggestions */}
                    <div className="text-[10px] text-slate-500 px-1 italic">
                      {suggestionMeta}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative h-[300px]">
                <TabsContent value="project" className="h-[300px] overflow-y-auto absolute inset-0">
                  {projectDocs.length > 0 ? (
                    projectDocs.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={(e) => handleDocClick(doc, e)}
                        className={cn(
                          "flex items-center gap-2 py-3 px-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground lowercase",
                          !doc.read && "font-semibold bg-accent/10"
                        )}
                      >
                        <span className="text-lg">📄</span>
                        <div className="truncate">
                          {doc.title.toLowerCase()}
                          {!doc.read && (
                            <span className="ml-2 text-xs py-0.5 px-1.5 bg-primary/10 text-primary rounded-full lowercase">
                              new
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Empty placeholder for project documents
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                      <span className="text-6xl mb-4">🤖</span>
                      <p className="text-center lowercase">no project documents generated yet</p>
                      <p className="text-center text-xs mt-2 lowercase">project documents will appear here as they're generated</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="documentation" className="h-[300px] overflow-y-auto absolute inset-0">
                  {techDocs.length > 0 ? (
                    techDocs.map(doc => (
                      <div 
              key={doc.id}
                        onClick={(e) => handleDocClick(doc, e)}
              className={cn(
                          "flex items-center gap-2 py-3 px-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground lowercase",
                !doc.read && "font-semibold bg-accent/10"
              )}
            >
                        <span className="text-lg">📚</span>
              <div className="truncate">
                          {doc.title.toLowerCase()}
                {!doc.read && (
                            <span className="ml-2 text-xs py-0.5 px-1.5 bg-primary/10 text-primary rounded-full lowercase">
                              new
                  </span>
                )}
                        </div>
                      </div>
                    ))
                  ) : selectedTechFile ? (
                    // Show selected tech file content
                    <div className="px-3 py-2">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium lowercase">{selectedTechFile.name}</span>
                        <button 
                          onClick={() => setSelectedTechFile(null)}
                          className="text-xs text-muted-foreground hover:text-foreground lowercase"
                        >
                          back to files
                        </button>
                      </div>
                      <div className="markdown-content overflow-y-auto max-h-[250px] pr-2">
                        <MarkdownRenderer content={selectedTechFile.content} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Category tabs and manage button in the same row */}
                      <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setActiveDocCategory("tech")}
                            className={cn(
                              "text-xs transition-colors flex items-center gap-1",
                              activeDocCategory === "tech" 
                                ? "text-blue-800 dark:text-blue-400" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span>💻</span> tech
                          </button>
                          <button
                            onClick={() => setActiveDocCategory("read")}
                            className={cn(
                              "text-xs transition-colors flex items-center gap-1",
                              activeDocCategory === "read" 
                                ? "text-green-800 dark:text-green-400" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span>📚</span> read
                          </button>
                          <button
                            onClick={() => setActiveDocCategory("social")}
                            className={cn(
                              "text-xs transition-colors flex items-center gap-1",
                              activeDocCategory === "social" 
                                ? "text-purple-800 dark:text-purple-400" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span>👥</span> social
                          </button>
                        </div>
                        <button 
                          onClick={() => setEditMode(!editMode)}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <span>{editMode ? "✓" : "⚙️"}</span> {editMode ? "done" : "manage"}
                        </button>
                      </div>
                      
                      {/* File tree based on active category - start with empty state */}
                      <div className="px-4 py-2">
                        {(activeDocCategory === "tech" && techFiles.length === 0) ||
                         (activeDocCategory === "read" && readFiles.length === 0) ||
                         (activeDocCategory === "social" && socialFiles.length === 0) ? (
                          <div className="text-center text-muted-foreground py-6">
                            {activeDocCategory === "tech" && <div className="text-6xl mb-4 text-center">💻</div>}
                            {activeDocCategory === "read" && <div className="text-6xl mb-4 text-center">📚</div>}
                            {activeDocCategory === "social" && <div className="text-6xl mb-4 text-center">👥</div>}
                            <p className="lowercase">
                              no {activeDocCategory} documents available
                            </p>
                            <p className="text-xs mt-1 lowercase">
                              search or paste a url above to add {activeDocCategory} documentation
                            </p>
                          </div>
                        ) : (
                          <ul className="space-y-2 text-sm mb-4">
                            {activeDocCategory === "tech" && techFiles.map(file => (
                              <li key={file.name} className="ml-2">
                                <div className={cn(
                                  "flex items-center gap-1.5",
                                  editMode ? "justify-between" : ""
                                )}>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500">📄</span>
                                    <span 
                                      className="hover:text-accent-foreground hover:underline cursor-pointer"
                                      onClick={() => handleTechFileClick(file.name, "tech")}
                                    >{file.name}</span>
                                    <span className="text-xs text-blue-500 bg-blue-50/50 dark:bg-blue-900/10 py-0.5 px-1 rounded">new</span>
                                  </div>
                                  {editMode && (
                                    <button 
                                      onClick={() => handleDeleteTechFile(file.name, "tech")}
                                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                                    >
                                      <span className="text-xs">❌</span>
                                    </button>
                                  )}
                                </div>
                              </li>
                            ))}
                            
                            {activeDocCategory === "read" && readFiles.map(file => (
                              <li key={file.name} className="ml-2">
                                <div className={cn(
                                  "flex items-center gap-1.5",
                                  editMode ? "justify-between" : ""
                                )}>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500">📄</span>
                                    <span 
                                      className="hover:text-accent-foreground hover:underline cursor-pointer"
                                      onClick={() => handleTechFileClick(file.name, "read")}
                                    >{file.name}</span>
                                  </div>
                                  {editMode && (
                                    <button 
                                      onClick={() => handleDeleteTechFile(file.name, "read")}
                                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                                    >
                                      <span className="text-xs">❌</span>
                                    </button>
                                  )}
                                </div>
                              </li>
                            ))}
                            
                            {activeDocCategory === "social" && socialFiles.map(file => (
                              <li key={file.name} className="ml-2">
                                <div className={cn(
                                  "flex items-center gap-1.5",
                                  editMode ? "justify-between" : ""
                                )}>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500">📄</span>
                                    <span 
                                      className="hover:text-accent-foreground hover:underline cursor-pointer"
                                      onClick={() => handleTechFileClick(file.name, "social")}
                                    >{file.name}</span>
                                  </div>
                                  {editMode && (
                                    <button 
                                      onClick={() => handleDeleteTechFile(file.name, "social")}
                                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                                    >
                                      <span className="text-xs">❌</span>
                                    </button>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          // Expanded document view
          <div className="px-3 py-2 h-[300px] overflow-y-auto">
            <div className="mb-2 flex items-center">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium lowercase",
                expandedDoc.source === 'perplexity' 
                  ? "bg-blue-100/50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "bg-purple-100/50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
              )}>
                {expandedDoc.source === 'perplexity' ? 'perplexity' : 'claude'}
              </span>
            </div>
            
            <div className="markdown-content overflow-y-auto max-h-[250px] pr-2">
              <MarkdownRenderer content={expandedDoc.content} />
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 