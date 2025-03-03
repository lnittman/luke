// Import static templates instead of using fs
// Define the type for tech stack options
export type TechStackOption = 'Next.js' | 'Apple' | 'CLI' | 'Other';

// Map tech stack options to directory names
const TEMPLATE_DIRECTORIES: Record<TechStackOption, string> = {
  'Next.js': 'next-template',
  'Apple': 'apple-template',
  'CLI': 'cli-template',
  'Other': 'other-template'
};

// Define keys used in the templates object for type safety
type TemplateKey = 'next' | 'apple' | 'cli' | 'other';
type TemplateFileKey = 'index.md' | 'design.md' | 'code.md';

// Static templates for each tech stack with proper typing
const TEMPLATES: Record<TemplateKey, Record<TemplateFileKey, string>> = {
  next: {
    'index.md': `# Next.js AI Project Template 2025

This template provides a comprehensive guide for building AI-native applications with Next.js, Vercel AI SDK, and modern best practices.`,
    'design.md': `# Next.js Design System Guide

This document outlines the design principles and components for Next.js applications.`,
    'code.md': `# Next.js Implementation Guide

This document provides implementation details for the Next.js project.`
  },
  apple: {
    'index.md': `# Apple Platform Development Guide

This document provides a comprehensive guide for developing applications for Apple platforms.`,
    'design.md': `# Apple Platform Design Guide

This document outlines design principles for Apple platform applications.`,
    'code.md': `# Apple Platform Implementation Guide

This document provides implementation details for Apple platform applications.`
  },
  cli: {
    'index.md': `# CLI Application Framework

> Modern command-line application development framework with AI-enhanced capabilities`,
    'design.md': `# CLI Design System Guide

This document outlines design principles and patterns for command-line interfaces.`,
    'code.md': `# CLI Implementation Guide

This document provides implementation details for command-line applications.`
  },
  other: {
    'index.md': `# Custom Project Documentation

This project uses a custom technology stack tailored to its specific requirements.`,
    'design.md': `# Design System Documentation

This document outlines the design principles and UI/UX guidelines for the project.`,
    'code.md': `# Implementation Guide

This document provides implementation details and coding standards for the project.`
  }
};

// Default init template
const INIT_TEMPLATE = `# AI Development Protocol

> This guide provides comprehensive instructions for AI assistants to implement the attached project efficiently and effectively.`;

/**
 * Loads a template from static data instead of filesystem
 * @param templateType The type of template (e.g., 'next', 'cli', 'other')
 * @param filename The name of the file to load (e.g., 'index.md', 'design.md', 'code.md')
 * @returns The content of the template
 */
export function loadTemplate(templateType: string, filename: string): string {
  try {
    // Normalize the template type to match our static templates
    const normalizedType = templateType.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]/g, '');
    
    // Map to one of our known template types
    let templateKey: TemplateKey = 'other';
    if (normalizedType === 'next' || normalizedType === 'nextjs') {
      templateKey = 'next';
    } else if (normalizedType === 'apple') {
      templateKey = 'apple';
    } else if (normalizedType === 'cli') {
      templateKey = 'cli';
    }
    
    // Get file key with type safety
    const fileKey = filename as TemplateFileKey;
    
    // Return the template if it exists
    if (TEMPLATES[templateKey] && TEMPLATES[templateKey][fileKey]) {
      return TEMPLATES[templateKey][fileKey];
    }
    
    console.warn(`Template not found: ${templateKey}/${filename}`);
    return '';
  } catch (error) {
    console.error(`Error loading template: ${error}`);
    return '';
  }
}

/**
 * Loads the init.md template from static data
 * @returns The content of the init.md template
 */
export function loadInitTemplate(): string {
  return INIT_TEMPLATE;
}

/**
 * Loads all documentation templates for a given tech stack from static data
 * @param techStack The tech stack to load templates for (e.g., 'next', 'cli', 'other')
 * @returns An object containing all templates for the tech stack
 */
export function loadTechStackTemplates(techStack: string): { 
  indexTemplate: string; 
  designTemplate: string; 
  codeTemplate: string;
} {
  // Convert tech stack name to template key format
  const simplifiedName = techStack.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]/g, '');
  
  // Map to one of our known template types
  let templateKey: TemplateKey = 'other';
  if (simplifiedName === 'next' || simplifiedName === 'nextjs') {
    templateKey = 'next';
  } else if (simplifiedName === 'apple') {
    templateKey = 'apple';
  } else if (simplifiedName === 'cli') {
    templateKey = 'cli';
  }
  
  console.log(`Loading templates for tech stack: ${techStack}, using key: ${templateKey}`);
  
  return {
    indexTemplate: TEMPLATES[templateKey]['index.md'],
    designTemplate: TEMPLATES[templateKey]['design.md'],
    codeTemplate: TEMPLATES[templateKey]['code.md'],
  };
}

/**
 * Get the emojis for tech stacks
 */
export const TECH_STACK_EMOJIS: Record<TechStackOption, string> = {
  "Next.js": "▲",
  "Apple": "🍎",
  "CLI": "🧮",
  "Other": "🍀"
};

/**
 * Get display names for tech stacks (lowercase for UI)
 */
export const TECH_STACK_DISPLAY_NAMES: Record<TechStackOption, string> = {
  "Next.js": "next.js",
  "Apple": "apple",
  "CLI": "cli",
  "Other": "other"
}; 