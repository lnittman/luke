import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { TechPill } from '@/components/TechPill';
import { TechStackSelectorProps, TechStackOption, TechStack } from './interfaces';

// Tech stack options
export type TechStackOption = 'Next.js' | 'Apple' | 'CLI' | 'Other';

// Tech stack emojis
export const TECH_STACK_EMOJIS: Record<TechStackOption, string> = {
  "Next.js": "▲",
  "Apple": "🍎",
  "CLI": "⌨️",
  "Other": "🔮"
};

// Tech stack display names
export const TECH_STACK_DISPLAY_NAMES: Record<TechStackOption, string> = {
  "Next.js": "Next.js",
  "Apple": "Apple Platforms",
  "CLI": "Command Line",
  "Other": "Custom Stack"
};

// Tech stack templates
export const TECH_STACK_TEMPLATES: Record<TechStackOption, TechStack> = {
  "Next.js": {
    frameworks: ["Next.js", "React", "TypeScript"],
    libraries: ["Tailwind CSS", "shadcn/ui", "Framer Motion"],
    apis: ["Vercel AI SDK", "OpenAI API"],
    tools: ["Vercel", "GitHub", "ESLint", "Prettier"],
    documentationLinks: {
      "Next.js": "https://nextjs.org/docs",
      "React": "https://react.dev",
      "TypeScript": "https://www.typescriptlang.org/docs",
      "Tailwind CSS": "https://tailwindcss.com/docs",
      "shadcn/ui": "https://ui.shadcn.com",
      "Framer Motion": "https://www.framer.com/motion",
      "Vercel AI SDK": "https://sdk.vercel.ai/docs",
      "OpenAI API": "https://platform.openai.com/docs/api-reference",
      "Vercel": "https://vercel.com/docs",
      "GitHub": "https://docs.github.com",
      "ESLint": "https://eslint.org/docs/user-guide",
      "Prettier": "https://prettier.io/docs/en"
    }
  },
  "Apple": {
    frameworks: ["SwiftUI", "Swift", "Combine"],
    libraries: ["Swift Data", "URLSession", "Swift Concurrency"],
    apis: ["Core ML", "CloudKit", "StoreKit"],
    tools: ["Xcode", "Swift Package Manager", "TestFlight"],
    documentationLinks: {
      "SwiftUI": "https://developer.apple.com/documentation/swiftui",
      "Swift": "https://docs.swift.org/swift-book",
      "Combine": "https://developer.apple.com/documentation/combine",
      "Swift Data": "https://developer.apple.com/documentation/swiftdata",
      "URLSession": "https://developer.apple.com/documentation/foundation/urlsession",
      "Swift Concurrency": "https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html",
      "Core ML": "https://developer.apple.com/documentation/coreml",
      "CloudKit": "https://developer.apple.com/documentation/cloudkit",
      "StoreKit": "https://developer.apple.com/documentation/storekit",
      "Xcode": "https://developer.apple.com/documentation/xcode",
      "Swift Package Manager": "https://www.swift.org/package-manager",
      "TestFlight": "https://developer.apple.com/testflight"
    }
  },
  "CLI": {
    frameworks: ["Node.js", "TypeScript", "Commander.js"],
    libraries: ["chalk", "inquirer", "fs-extra", "axios"],
    apis: ["REST APIs", "OpenAI API"],
    tools: ["npm", "GitHub", "ESLint"],
    documentationLinks: {
      "Node.js": "https://nodejs.org/en/docs",
      "TypeScript": "https://www.typescriptlang.org/docs",
      "Commander.js": "https://github.com/tj/commander.js",
      "chalk": "https://github.com/chalk/chalk",
      "inquirer": "https://github.com/SBoudrias/Inquirer.js",
      "fs-extra": "https://github.com/jprichardson/node-fs-extra",
      "axios": "https://axios-http.com/docs/intro",
      "REST APIs": "https://restfulapi.net",
      "OpenAI API": "https://platform.openai.com/docs/api-reference",
      "npm": "https://docs.npmjs.com",
      "GitHub": "https://docs.github.com",
      "ESLint": "https://eslint.org/docs/user-guide"
    }
  },
  "Other": {
    frameworks: [],
    libraries: [],
    apis: [],
    tools: [],
    documentationLinks: {}
  }
};

interface TechStackSelectorProps {
  selectedTechStack: TechStackOption | null;
  setSelectedTechStack: (stack: TechStackOption) => void;
  selectedTechs: string[];
  setSelectedTechs: (techs: string[]) => void;
  discoveredTechs: Array<{name: string; documentationUrl: string}>;
}

export const TechStackSelector = ({
  selectedTechStack,
  setSelectedTechStack,
  selectedTechs,
  setSelectedTechs,
  discoveredTechs
}: TechStackSelectorProps) => {
  const techContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Monitor container width for fluid sizing
  useEffect(() => {
    if (!techContainerRef.current) return;

    const updateWidth = () => {
      if (techContainerRef.current) {
        setContainerWidth(techContainerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(techContainerRef.current);

    return () => {
      if (techContainerRef.current) {
        resizeObserver.unobserve(techContainerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  const toggleTechSelection = (techName: string) => {
    if (selectedTechs.includes(techName)) {
      setSelectedTechs(selectedTechs.filter(tech => tech !== techName));
    } else {
      setSelectedTechs([...selectedTechs, techName]);
    }
  };

  const getTechPillsForStack = (stack: TechStackOption): { name: string; documentationUrl: string }[] => {
    if (!stack) return [];

    const template = TECH_STACK_TEMPLATES[stack];
    
    // Create tech pills from frameworks, libraries, APIs, and tools
    const techPills: { name: string; documentationUrl: string }[] = [];
    
    // Add frameworks to tech pills
    template.frameworks.forEach(framework => {
      techPills.push({
        name: framework,
        documentationUrl: template.documentationLinks[framework] || ''
      });
    });
    
    // Add libraries to tech pills
    template.libraries.forEach(library => {
      techPills.push({
        name: library,
        documentationUrl: template.documentationLinks[library] || ''
      });
    });
    
    // Add APIs to tech pills
    template.apis.forEach(api => {
      techPills.push({
        name: api,
        documentationUrl: template.documentationLinks[api] || ''
      });
    });
    
    // Add tools to tech pills
    template.tools.forEach(tool => {
      techPills.push({
        name: tool,
        documentationUrl: template.documentationLinks[tool] || ''
      });
    });
    
    return techPills;
  };

  // Calculate fluid font sizes based on container width
  const getTechSectionTitle = () => {
    if (containerWidth <= 0) return 'text-xs';
    
    if (containerWidth < 300) return 'text-[9px]';
    if (containerWidth < 400) return 'text-[10px]';
    if (containerWidth < 500) return 'text-xs';
    if (containerWidth < 600) return 'text-sm';
    return 'text-base';
  };

  return (
    <div className="space-y-4 w-full" ref={techContainerRef}>
      {/* Tech Stack Selection */}
      <div className="space-y-2">
        <h3 className={clsx("font-semibold", getTechSectionTitle())}>
          Select a Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TECH_STACK_TEMPLATES) as TechStackOption[]).map((stack) => (
            <button
              key={stack}
              onClick={() => setSelectedTechStack(stack)}
              className={clsx(
                "py-1 px-2 rounded-md text-xs",
                selectedTechStack === stack
                  ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-medium"
                  : "bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted-hover))]"
              )}
            >
              {TECH_STACK_EMOJIS[stack]} {TECH_STACK_DISPLAY_NAMES[stack]}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Pills */}
      {selectedTechStack && (
        <div className="space-y-2">
          <h3 className={clsx("font-semibold", getTechSectionTitle())}>
            Stack Components
          </h3>
          <div className="flex flex-wrap gap-2">
            {getTechPillsForStack(selectedTechStack).map((tech, index) => (
              <TechPill
                key={tech.name}
                text={tech}
                index={index}
                onClick={() => toggleTechSelection(tech.name)}
                isActive={selectedTechs.includes(tech.name)}
                containerWidth={containerWidth}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discovered Techs */}
      {discoveredTechs.length > 0 && (
        <div className="space-y-2">
          <h3 className={clsx("font-semibold", getTechSectionTitle())}>
            Recommended Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {discoveredTechs.map((tech, index) => (
              <TechPill
                key={`${tech.name}-${index}`}
                text={tech}
                index={index}
                onClick={() => toggleTechSelection(tech.name)}
                isActive={selectedTechs.includes(tech.name)}
                containerWidth={containerWidth}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 