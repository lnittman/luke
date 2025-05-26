"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultResumeConfig = exports.getResumeConfigsByTags = exports.getResumeConfigById = exports.resumeConfigs = void 0;
exports.resumeConfigs = [
    {
        id: "general",
        name: "General Software Engineer",
        description: "Comprehensive resume showcasing full-stack development and AI experience",
        experiences: ["titles-inc", "stems-labs", "amazon-address-intelligence", "aws-elemental"],
        projects: ["ther", "cards", "voet", "loops", "sine"],
        skillTags: ["frontend", "backend", "ai", "cloud", "fullstack"],
        maxProjects: 6,
        format: "both",
        includeLinks: true,
        compactMode: false,
        jobTags: ["software-engineer", "fullstack", "frontend", "backend", "web"],
        priority: 1
    },
    {
        id: "ford",
        name: "Ford Motor Company",
        description: "Enterprise-focused resume emphasizing automotive and large-scale systems",
        experiences: ["amazon-address-intelligence", "aws-elemental", "stems-labs"],
        projects: ["voet", "cards"], // Focus on data/analytics projects
        skillTags: ["enterprise", "cloud", "backend", "data", "microservices"],
        maxProjects: 2,
        format: "latex",
        includeLinks: false,
        compactMode: true,
        jobTags: ["automotive", "enterprise", "backend", "cloud", "data"],
        priority: 2
    },
    {
        id: "ai-focused",
        name: "AI/ML Engineer",
        description: "AI-heavy resume showcasing machine learning and intelligent systems",
        experiences: ["titles-inc", "stems-labs"],
        projects: ["ther", "cards", "voet", "squish"],
        skillTags: ["ai", "ml", "embeddings", "llm", "python"],
        maxProjects: 4,
        format: "both",
        includeLinks: true,
        compactMode: false,
        jobTags: ["ai", "ml", "machine-learning", "data-science", "llm"],
        priority: 1
    },
    {
        id: "mobile-ios",
        name: "iOS Developer",
        description: "Mobile-focused resume highlighting iOS development and Swift expertise",
        experiences: ["stems-labs", "titles-inc"],
        projects: ["sine", "ther"], // iOS-relevant projects
        skillTags: ["ios", "mobile", "swift", "audio"],
        maxProjects: 2,
        format: "both",
        includeLinks: true,
        compactMode: false,
        jobTags: ["ios", "mobile", "swift", "apple", "audio"],
        priority: 1
    },
    {
        id: "startup",
        name: "Startup/Scale-up",
        description: "Entrepreneurial resume emphasizing independent projects and versatility",
        experiences: ["stems-labs", "titles-inc"],
        projects: ["ther", "cards", "voet", "loops", "sine", "squish"],
        skillTags: ["fullstack", "ai", "startup", "frontend", "backend"],
        maxProjects: 6,
        format: "standard",
        includeLinks: true,
        compactMode: false,
        jobTags: ["startup", "scale-up", "early-stage", "versatile", "independent"],
        priority: 1
    },
    {
        id: "frontend",
        name: "Frontend Engineer",
        description: "Frontend-focused resume highlighting UI/UX and modern web technologies",
        experiences: ["titles-inc", "stems-labs"],
        projects: ["loops", "ther", "voet", "squish"],
        skillTags: ["frontend", "react", "typescript", "ui", "animation"],
        maxProjects: 4,
        format: "both",
        includeLinks: true,
        compactMode: false,
        jobTags: ["frontend", "react", "ui", "web", "javascript"],
        priority: 1
    },
    {
        id: "audio-tech",
        name: "Audio Technology",
        description: "Audio-specialized resume for music tech and audio processing roles",
        experiences: ["stems-labs"],
        projects: ["sine", "loops"],
        skillTags: ["audio", "music", "ios", "web-audio", "processing"],
        maxProjects: 2,
        format: "both",
        includeLinks: true,
        compactMode: false,
        jobTags: ["audio", "music", "dsp", "audio-processing", "music-tech"],
        priority: 1
    }
];
const getResumeConfigById = (id) => {
    return exports.resumeConfigs.find(config => config.id === id);
};
exports.getResumeConfigById = getResumeConfigById;
const getResumeConfigsByTags = (tags) => {
    return exports.resumeConfigs.filter(config => tags.some(tag => config.jobTags.includes(tag))).sort((a, b) => a.priority - b.priority);
};
exports.getResumeConfigsByTags = getResumeConfigsByTags;
const getDefaultResumeConfig = () => {
    return exports.resumeConfigs.find(config => config.id === "general");
};
exports.getDefaultResumeConfig = getDefaultResumeConfig;
//# sourceMappingURL=resume-configs.js.map