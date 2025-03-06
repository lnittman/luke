// Default welcome message
export const WELCOME_MESSAGE = "what project would you like to create?";

// Tech stack categories prompts
export const TECH_CATEGORY_PROMPTS = {
  "Next.js": "Creating a Next.js project with React and TypeScript.",
  "Apple": "Building an Apple platform application with Swift.",
  "CLI": "Developing a command-line interface tool.",
  "Other": "Using a custom technology stack for your project."
};

// Random idea generation prompts
export const RANDOM_IDEA_PROMPTS = {
  trends: "Researching current cultural phenomena, social media movements, and viral content formats",
  tech: "Analyzing cutting-edge technologies, frameworks, and development patterns",
  market: "Identifying business trends, user needs, and potential startup opportunities",
  synthesis: "Synthesizing research into a viral-worthy app concept with creative vision and technical feasibility"
};

// Project generation status messages
export const STATUS_MESSAGES = {
  searching: "Researching trends and technologies...",
  generating: "Generating project documentation...",
  techDoc: "Creating tech stack documentation...",
  indexDoc: "Creating project overview...",
  designDoc: "Creating design documentation...",
  codeDoc: "Creating implementation guide...",
  initDoc: "Creating AI assistant guide...",
  complete: "Project generation complete!"
};

// Document type labels
export const DOCUMENT_LABELS: Record<string, { emoji: string; title: string }> = {
  tech: { emoji: '📚', title: 'Tech Stack' },
  index: { emoji: '📝', title: 'Overview' },
  design: { emoji: '🎨', title: 'Design' },
  code: { emoji: '💻', title: 'Implementation' },
  init: { emoji: '🚀', title: 'AI Init' },
  search: { emoji: '🔍', title: 'Research' },
};

// Error messages
export const ERROR_MESSAGES = {
  projectGeneration: "Sorry, there was an error generating your project. Please try again.",
  randomIdea: "Sorry, I had trouble enhancing your idea. Please try again or provide more details.",
  documentGeneration: "Error generating documentation. Please try again.",
  noSelectedTech: "Please select a tech stack before generating a project.",
  ideaGeneration: "Error generating random app idea. Please try again.",
  apiConnection: "Connection error. Please check your internet and try again.",
  serverError: "Server error. Please try again later."
};

// Success messages
export const SUCCESS_MESSAGES = {
  projectGenerated: (name: string) => `Generated project: ${name}`,
  docsDownloaded: (name: string) => `Documentation for ${name} has been downloaded.`,
  randomIdeaGenerated: "Random app idea generated!",
  projectSaved: (name: string) => `Project ${name} has been saved.`,
  techDiscovered: (tech: string) => `Added ${tech} to your project description!`
};

// Placeholder texts
export const PLACEHOLDERS = {
  projectName: "Project name (optional)",
  projectDescription: "Describe your project idea...",
  searching: "Searching for relevant technologies...",
  emptyDocuments: "Generated documents will appear here",
  emptyMessages: "No messages yet"
}; 