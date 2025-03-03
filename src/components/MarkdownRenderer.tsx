import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string | null;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (content) {
      // Convert markdown to HTML using the synchronous version
      const rawHtml = marked.parse(content, { async: false }) as string;
      // Sanitize HTML to prevent XSS attacks
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setHtml(sanitizedHtml);
    }
  }, [content]);

  if (!content) {
    return <div className="text-muted-foreground">No content available.</div>;
  }

  return (
    <div 
      className={cn('prose dark:prose-invert max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}; 