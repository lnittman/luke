# Floating Document Panel Solution

This document outlines the implementation of a non-intrusive floating document panel that provides real-time updates during both random idea generation and project generation processes without disrupting the main UI flow.

## Overview

Instead of replacing UI elements with live search results and document previews, this solution adds a floating document button in the bottom-right corner that:

1. Appears automatically when documents or search results are available
2. Shows a count of unread documents
3. Displays toast notifications when new documents are ready
4. Opens a side panel with all available documents when clicked
5. Allows viewing full documents in a modal dialog

## Components Implemented

1. **FloatingDocPanel.tsx**: Main component that provides the floating button, document panel, and document viewer
2. **useDocumentManager.ts**: Custom hook for managing document state and operations
3. **MarkdownRenderer.tsx**: Helper component for rendering markdown as HTML

## Key Features

### 1. Unobtrusive UI
- Preserves the existing tech stack tabs and tech pill UI
- Adds a small floating button that appears only when documents are available
- Doesn't shift or replace existing UI elements

### 2. Live Technology Updates
- Tech pills update automatically when tech.md is generated
- Seamlessly integrates with the existing tech discovery process
- Parses the tech.md file to extract technologies by category

### 3. Toast Notifications
- Shows toast notifications when new documents are added
- Provides quick access to documents directly from notifications
- Visually distinguishes between Perplexity and Claude outputs

### 4. Document Management
- Tracks read/unread status of documents
- Sorts documents by creation time
- Color-codes documents by source (blue for Perplexity, purple for Claude)

### 5. Document Viewer
- Opens documents in a modal with proper markdown rendering
- Maintains scrollable document list in a slide-out panel
- Provides clear document type and timestamp information

## Visual Design

The design follows these principles:

- **Consistent styling** with the existing UI
- **Color coding** to distinguish between AI sources
  - Blue for Perplexity/search results
  - Purple for Claude-generated documents
- **Animation** for smooth transitions and visual feedback
- **Badge indicators** to show unread document counts
- **Responsive layout** that works well on all screen sizes

## Integration Points

### 1. Random Idea Generation
When a user clicks "Generate Random Idea":
- Search results are created as documents in the floating panel
- The tech.md document is generated from the idea's tech stack
- Tech pills are updated based on the tech.md content

### 2. Project Generation
When a user submits a project prompt:
- Documents are generated sequentially (tech.md, index.md, etc.)
- Each document appears as a toast notification
- All documents are accessible through the floating panel
- Tech pills update based on the generated tech.md

## Dependencies

This solution requires the following dependencies:
- sonner (toast notifications)
- marked (markdown parsing)
- dompurify (HTML sanitization)
- framer-motion (animations)

## Usage Benefits

1. **Non-disruptive UX**: Users can continue interacting with the main UI while documents are being generated
2. **Progressive disclosure**: Information is available but not forced upon users
3. **Persistent access**: Documents remain accessible through the panel without needing to regenerate
4. **Visual feedback**: Toast notifications provide awareness without interruption
5. **Clear source attribution**: Users can easily identify which AI system generated each document

## Implementation Steps

1. Add the FloatingDocPanel component to your project
2. Include the useDocumentManager hook
3. Install dependencies (sonner, marked, dompurify)
4. Integrate toast notifications
5. Update project generation and random idea generation flows
6. Add document parsing for tech pill updates

This approach provides a clean, maintainable solution that enhances the user experience without disrupting the existing UI flow. 