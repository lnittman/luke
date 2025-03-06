/**
 * Templates Index
 * Re-exports all templates used in the project generator
 */

// Animation variants
export const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Export all templates
export * from './documentation';

// Tech stack documentation templates
export const getTechStackDocs = (stack: string): string => {
  const templates: Record<string, string> = {
    'Next.js': `# Next.js Technology Stack

Next.js is a React framework that enables server-side rendering, static site generation, and other advanced features with zero configuration.

## Core Technologies

- **React**: A JavaScript library for building user interfaces
- **Next.js**: React framework with server-side rendering and routing
- **TypeScript**: Typed JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Vercel**: Deployment platform optimized for Next.js

## Key Concepts

- **Server-side Rendering (SSR)**: Pre-renders pages on the server for better SEO and performance
- **Static Site Generation (SSG)**: Generates static HTML at build time for maximum performance
- **Incremental Static Regeneration (ISR)**: Updates static pages without rebuilding the entire site
- **API Routes**: Create API endpoints as part of your Next.js application
- **Client-side Navigation**: Fast page transitions with prefetching

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)`,

    'Apple': `# Apple Technology Stack

The Apple ecosystem offers a comprehensive set of frameworks and tools for building applications across Apple platforms.

## Core Technologies

- **Swift**: Apple's modern programming language
- **SwiftUI**: Declarative UI framework for all Apple platforms
- **UIKit**: Traditional UI framework for iOS and iPadOS
- **Core Data**: Framework for managing object graphs and persistence
- **Combine**: Reactive programming framework for handling asynchronous events

## Key Concepts

- **Protocol-Oriented Programming**: Composition over inheritance
- **MVVM Architecture**: Model-View-ViewModel design pattern
- **App Life Cycle**: Understanding how apps run on Apple platforms
- **Swift Concurrency**: Modern approach to asynchronous programming
- **Universal Apps**: Building for multiple Apple platforms

## Resources

- [Swift Documentation](https://swift.org/documentation/)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [UIKit Documentation](https://developer.apple.com/documentation/uikit)
- [Core Data Documentation](https://developer.apple.com/documentation/coredata)
- [Combine Documentation](https://developer.apple.com/documentation/combine)`,

    'CLI': `# Command Line Interface (CLI) Technology Stack

Command Line Interfaces provide powerful, text-based interaction with computer systems, enabling automation and advanced workflows.

## Core Technologies

- **Node.js**: JavaScript runtime for building CLI applications
- **Commander.js**: Complete solution for Node.js command-line interfaces
- **Inquirer.js**: Collection of common interactive command line user interfaces
- **Chalk**: Terminal string styling for colorful output
- **ShellJS**: Portable Unix shell commands for Node.js

## Key Concepts

- **Command Parsing**: Processing command line arguments
- **Interactive Prompts**: Gathering user input through interactive interfaces
- **Progress Indicators**: Showing operation progress in the terminal
- **Error Handling**: Graceful error management in CLI applications
- **Configuration Management**: Storing and retrieving configuration data

## Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)
- [Chalk Documentation](https://github.com/chalk/chalk)
- [ShellJS Documentation](https://github.com/shelljs/shelljs)`,

    'Other': `# Custom Technology Stack

This document outlines the technology stack selected for your custom project.

## Core Technologies

- **Primary Language**: The main programming language for your application
- **Framework/Library**: The main framework or library powering your application
- **Database**: Data storage solution for your application
- **Frontend**: User interface technology (if applicable)
- **Backend**: Server-side technology (if applicable)

## Key Concepts

- **Architecture**: Overall system design and component organization
- **Data Flow**: How data moves through your application
- **State Management**: Handling application state
- **API Design**: Designing clean and efficient APIs
- **Testing Strategy**: Approaches to ensure code quality

## Resources

- Framework Documentation
- Language References
- Community Resources
- Best Practices
- Tutorial Links`
  };

  return templates[stack] || templates['Other'];
}; 