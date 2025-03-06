import { TechStack } from './interfaces';

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
  "Next.js": "next.js",
  "Apple": "apple",
  "CLI": "cli",
  "Other": "other"
};

// Platform-specific tech stack templates
export const TECH_STACK_TEMPLATES: Record<TechStackOption, TechStack> = {
  "Next.js": {
    frameworks: ["next.js", "react"],
    libraries: ["tailwindcss", "framer-motion", "shadcn-ui", "react-query"],
    apis: ["restful", "graphql"],
    tools: ["typescript", "eslint", "prisma"],
    documentationLinks: {
      "next.js": "https://nextjs.org/",
      "react": "https://reactjs.org/",
      "tailwindcss": "https://tailwindcss.com/",
      "framer-motion": "https://www.framer.com/motion/",
      "shadcn-ui": "https://ui.shadcn.com/",
      "react-query": "https://tanstack.com/query/latest",
      "graphql": "https://graphql.org/",
      "restful": "https://restfulapi.net/",
      "typescript": "https://www.typescriptlang.org/",
      "eslint": "https://eslint.org/",
      "prisma": "https://www.prisma.io/"
    }
  },
  "Apple": {
    frameworks: ["swiftui", "uikit", "coredata"],
    libraries: ["combine", "swift-concurrency"],
    apis: ["healthkit", "mapkit", "avfoundation"],
    tools: ["xcode", "swift", "swiftlint"],
    documentationLinks: {
      "swiftui": "https://developer.apple.com/xcode/swiftui/",
      "uikit": "https://developer.apple.com/documentation/uikit/",
      "coredata": "https://developer.apple.com/documentation/coredata",
      "combine": "https://developer.apple.com/documentation/combine",
      "swift-concurrency": "https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html",
      "healthkit": "https://developer.apple.com/documentation/healthkit",
      "mapkit": "https://developer.apple.com/documentation/mapkit",
      "avfoundation": "https://developer.apple.com/documentation/avfoundation",
      "xcode": "https://developer.apple.com/xcode/",
      "swift": "https://swift.org/",
      "swiftlint": "https://github.com/realm/SwiftLint"
    }
  },
  "CLI": {
    frameworks: ["node.js", "deno"],
    libraries: ["commander", "inquirer", "chalk"],
    apis: ["filesystem", "network"],
    tools: ["typescript", "jest", "esbuild"],
    documentationLinks: {
      "node.js": "https://nodejs.org/",
      "deno": "https://deno.land/",
      "commander": "https://github.com/tj/commander.js",
      "inquirer": "https://github.com/SBoudrias/Inquirer.js",
      "chalk": "https://github.com/chalk/chalk",
      "filesystem": "https://nodejs.org/api/fs.html",
      "network": "https://nodejs.org/api/http.html",
      "typescript": "https://www.typescriptlang.org/",
      "jest": "https://jestjs.io/",
      "esbuild": "https://esbuild.github.io/"
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