"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkillsByProficiency = exports.getSkillsByCategory = exports.getFeaturedSkills = exports.getSkillsByTags = exports.skillCategories = exports.skills = void 0;
exports.skills = [
    // Programming Languages
    { name: "Swift", url: "https://www.swift.org/", category: "Programming Languages", proficiency: "expert", yearsOfExperience: 5, tags: ["ios", "mobile", "apple"], featured: true },
    { name: "Python", url: "https://www.python.org/", category: "Programming Languages", proficiency: "expert", yearsOfExperience: 7, tags: ["backend", "ai", "data"], featured: true },
    { name: "TypeScript", url: "https://www.typescriptlang.org/", category: "Programming Languages", proficiency: "expert", yearsOfExperience: 6, tags: ["frontend", "fullstack", "web"], featured: true },
    { name: "C/C++", url: "https://isocpp.org/", category: "Programming Languages", proficiency: "advanced", yearsOfExperience: 8, tags: ["systems", "performance", "backend"], featured: false },
    { name: "JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: "Programming Languages", proficiency: "expert", yearsOfExperience: 8, tags: ["frontend", "fullstack", "web"], featured: true },
    { name: "Golang", url: "https://go.dev/", category: "Programming Languages", proficiency: "intermediate", yearsOfExperience: 2, tags: ["backend", "cloud", "microservices"], featured: false },
    { name: "Java", url: "https://www.java.com/", category: "Programming Languages", proficiency: "advanced", yearsOfExperience: 4, tags: ["backend", "enterprise", "android"], featured: false },
    { name: "Ruby", url: "https://www.ruby-lang.org/", category: "Programming Languages", proficiency: "intermediate", yearsOfExperience: 2, tags: ["backend", "scripting"], featured: false },
    // Frontend
    { name: "React", url: "https://react.dev/", category: "Frontend", proficiency: "expert", yearsOfExperience: 6, tags: ["frontend", "web", "spa"], featured: true },
    { name: "Next.js", url: "https://nextjs.org/", category: "Frontend", proficiency: "expert", yearsOfExperience: 4, tags: ["frontend", "fullstack", "ssr"], featured: true },
    { name: "SwiftUI", url: "https://developer.apple.com/xcode/swiftui/", category: "Frontend", proficiency: "expert", yearsOfExperience: 4, tags: ["ios", "mobile", "ui"], featured: true },
    { name: "TailwindCSS", url: "https://tailwindcss.com/", category: "Frontend", proficiency: "expert", yearsOfExperience: 3, tags: ["css", "styling", "design"], featured: true },
    { name: "Framer Motion", url: "https://www.framer.com/motion/", category: "Frontend", proficiency: "advanced", yearsOfExperience: 2, tags: ["animation", "ui", "web"], featured: true },
    { name: "React Native", url: "https://reactnative.dev/", category: "Frontend", proficiency: "advanced", yearsOfExperience: 3, tags: ["mobile", "cross-platform"], featured: false },
    { name: "UIKit", url: "https://developer.apple.com/documentation/uikit", category: "Frontend", proficiency: "advanced", yearsOfExperience: 5, tags: ["ios", "mobile", "legacy"], featured: false },
    { name: "WebGL", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API", category: "Frontend", proficiency: "intermediate", yearsOfExperience: 2, tags: ["3d", "graphics", "web"], featured: false },
    { name: "React Three Fiber", url: "https://docs.pmnd.rs/react-three-fiber/getting-started/introduction", category: "Frontend", proficiency: "intermediate", yearsOfExperience: 1, tags: ["3d", "graphics", "react"], featured: false },
    // Backend
    { name: "FastAPI", url: "https://fastapi.tiangolo.com/", category: "Backend", proficiency: "expert", yearsOfExperience: 3, tags: ["python", "api", "async"], featured: true },
    { name: "Node.js", url: "https://nodejs.org/", category: "Backend", proficiency: "advanced", yearsOfExperience: 5, tags: ["javascript", "server", "api"], featured: true },
    { name: "Prisma ORM", url: "https://www.prisma.io/", category: "Backend", proficiency: "expert", yearsOfExperience: 2, tags: ["database", "orm", "typescript"], featured: true },
    { name: "GraphQL", url: "https://graphql.org/", category: "Backend", proficiency: "advanced", yearsOfExperience: 3, tags: ["api", "query", "schema"], featured: false },
    { name: "tRPC", url: "https://trpc.io/", category: "Backend", proficiency: "advanced", yearsOfExperience: 1, tags: ["typescript", "api", "type-safe"], featured: true },
    { name: "WebSockets", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", category: "Backend", proficiency: "advanced", yearsOfExperience: 3, tags: ["real-time", "communication"], featured: false },
    // Database
    { name: "PostgreSQL", url: "https://www.postgresql.org/", category: "Database", proficiency: "expert", yearsOfExperience: 5, tags: ["sql", "relational", "database"], featured: true },
    { name: "Redis", url: "https://redis.io/", category: "Database", proficiency: "advanced", yearsOfExperience: 4, tags: ["cache", "nosql", "memory"], featured: true },
    { name: "pgvector", url: "https://github.com/pgvector/pgvector", category: "Database", proficiency: "advanced", yearsOfExperience: 1, tags: ["vector", "ai", "embeddings"], featured: true },
    { name: "DynamoDB", url: "https://aws.amazon.com/dynamodb/", category: "Database", proficiency: "advanced", yearsOfExperience: 3, tags: ["nosql", "aws", "serverless"], featured: false },
    { name: "Core Data", url: "https://developer.apple.com/documentation/coredata", category: "Database", proficiency: "advanced", yearsOfExperience: 4, tags: ["ios", "mobile", "persistence"], featured: false },
    // AI/ML
    { name: "OpenAI", url: "https://openai.com/", category: "AI/ML", proficiency: "expert", yearsOfExperience: 2, tags: ["llm", "gpt", "ai"], featured: true },
    { name: "Gemini", url: "https://ai.google.dev/", category: "AI/ML", proficiency: "expert", yearsOfExperience: 1, tags: ["llm", "google", "multimodal"], featured: true },
    { name: "Vector Embeddings", url: "https://platform.openai.com/docs/guides/embeddings", category: "AI/ML", proficiency: "expert", yearsOfExperience: 2, tags: ["embeddings", "semantic", "search"], featured: true },
    { name: "Vercel AI SDK", url: "https://sdk.vercel.ai/docs", category: "AI/ML", proficiency: "expert", yearsOfExperience: 1, tags: ["ai", "streaming", "typescript"], featured: true },
    { name: "Prompt Engineering", category: "AI/ML", proficiency: "expert", yearsOfExperience: 2, tags: ["llm", "optimization", "ai"], featured: true },
    { name: "Agentic Systems", category: "AI/ML", proficiency: "advanced", yearsOfExperience: 1, tags: ["ai", "agents", "automation"], featured: true },
    { name: "PyTorch", url: "https://pytorch.org/", category: "AI/ML", proficiency: "intermediate", yearsOfExperience: 2, tags: ["ml", "training", "python"], featured: false },
    { name: "CoreML", url: "https://developer.apple.com/documentation/coreml", category: "AI/ML", proficiency: "intermediate", yearsOfExperience: 2, tags: ["ios", "mobile", "inference"], featured: false },
    // Cloud & Infrastructure
    { name: "AWS", url: "https://aws.amazon.com/", category: "Cloud & Infrastructure", proficiency: "expert", yearsOfExperience: 6, tags: ["cloud", "infrastructure", "enterprise"], featured: true },
    { name: "GCP", url: "https://cloud.google.com/", category: "Cloud & Infrastructure", proficiency: "advanced", yearsOfExperience: 2, tags: ["cloud", "google", "ai"], featured: true },
    { name: "Vercel", url: "https://vercel.com/", category: "Cloud & Infrastructure", proficiency: "expert", yearsOfExperience: 3, tags: ["deployment", "frontend", "serverless"], featured: true },
    { name: "Docker", url: "https://www.docker.com/", category: "Cloud & Infrastructure", proficiency: "advanced", yearsOfExperience: 5, tags: ["containers", "deployment"], featured: true },
    { name: "Serverless", url: "https://aws.amazon.com/serverless/", category: "Cloud & Infrastructure", proficiency: "advanced", yearsOfExperience: 4, tags: ["lambda", "functions", "scalable"], featured: true },
    { name: "Microservices", url: "https://aws.amazon.com/microservices/", category: "Cloud & Infrastructure", proficiency: "advanced", yearsOfExperience: 3, tags: ["architecture", "distributed"], featured: false },
    // Audio/Video
    { name: "AVFoundation", url: "https://developer.apple.com/av-foundation/", category: "Audio/Video", proficiency: "expert", yearsOfExperience: 3, tags: ["ios", "audio", "video"], featured: true },
    { name: "Web Audio API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API", category: "Audio/Video", proficiency: "advanced", yearsOfExperience: 2, tags: ["web", "audio", "processing"], featured: true },
    { name: "FFmpeg", url: "https://ffmpeg.org/", category: "Audio/Video", proficiency: "advanced", yearsOfExperience: 4, tags: ["video", "transcoding", "processing"], featured: true },
    { name: "AudioKit", url: "https://audiokit.io/", category: "Audio/Video", proficiency: "advanced", yearsOfExperience: 2, tags: ["ios", "audio", "synthesis"], featured: false },
    { name: "MIDI", url: "https://developer.apple.com/documentation/coremidi", category: "Audio/Video", proficiency: "advanced", yearsOfExperience: 2, tags: ["music", "protocol", "audio"], featured: false },
    // Tools & Practices
    { name: "Git", url: "https://git-scm.com/", category: "Tools & Practices", proficiency: "expert", yearsOfExperience: 10, tags: ["version-control", "collaboration"], featured: true },
    { name: "CI/CD", url: "https://about.gitlab.com/topics/ci-cd/", category: "Tools & Practices", proficiency: "advanced", yearsOfExperience: 5, tags: ["automation", "deployment"], featured: true },
    { name: "Testing", category: "Tools & Practices", proficiency: "advanced", yearsOfExperience: 6, tags: ["quality", "automation", "tdd"], featured: true },
    { name: "Agile/Scrum", url: "https://www.scrum.org/", category: "Tools & Practices", proficiency: "advanced", yearsOfExperience: 6, tags: ["methodology", "team"], featured: false },
    { name: "Code Review", category: "Tools & Practices", proficiency: "expert", yearsOfExperience: 8, tags: ["quality", "collaboration"], featured: false },
];
exports.skillCategories = [
    { name: "Programming Languages", skills: exports.skills.filter(s => s.category === "Programming Languages"), priority: 1 },
    { name: "Frontend", skills: exports.skills.filter(s => s.category === "Frontend"), priority: 2 },
    { name: "Backend", skills: exports.skills.filter(s => s.category === "Backend"), priority: 3 },
    { name: "AI/ML", skills: exports.skills.filter(s => s.category === "AI/ML"), priority: 4 },
    { name: "Database", skills: exports.skills.filter(s => s.category === "Database"), priority: 5 },
    { name: "Cloud & Infrastructure", skills: exports.skills.filter(s => s.category === "Cloud & Infrastructure"), priority: 6 },
    { name: "Audio/Video", skills: exports.skills.filter(s => s.category === "Audio/Video"), priority: 7 },
    { name: "Tools & Practices", skills: exports.skills.filter(s => s.category === "Tools & Practices"), priority: 8 },
];
const getSkillsByTags = (tags) => {
    return exports.skills.filter(skill => tags.some(tag => skill.tags.includes(tag)));
};
exports.getSkillsByTags = getSkillsByTags;
const getFeaturedSkills = () => {
    return exports.skills.filter(skill => skill.featured);
};
exports.getFeaturedSkills = getFeaturedSkills;
const getSkillsByCategory = (category) => {
    return exports.skills.filter(skill => skill.category === category);
};
exports.getSkillsByCategory = getSkillsByCategory;
const getSkillsByProficiency = (proficiency) => {
    return exports.skills.filter(skill => skill.proficiency === proficiency);
};
exports.getSkillsByProficiency = getSkillsByProficiency;
//# sourceMappingURL=skills.js.map