"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderProjects = renderProjects;
function renderProjectTechStack(techStack, includeLinks, compactMode) {
    if (compactMode) {
        const allTechs = techStack.flatMap(stack => stack.technologies);
        const techList = allTechs.map(tech => includeLinks && tech.url ? `[${tech.name}](${tech.url})` : tech.name).join(', ');
        return `- **Tech Stack:** ${techList}\n\n`;
    }
    let markdown = `- **Tech Stack:**\n`;
    techStack.forEach(stack => {
        const techList = stack.technologies.map(tech => includeLinks && tech.url ? `[${tech.name}](${tech.url})` : tech.name).join(', ');
        markdown += `  - **${stack.category}:** ${techList}\n`;
    });
    markdown += '\n';
    return markdown;
}
function renderProjectItem(project, includeLinks, format, compactMode) {
    const { name, url, description, highlights, techStack } = project;
    const projectTitle = includeLinks && url ? `${name} ${url}` : name;
    let markdown = `#### ${projectTitle}\n`;
    markdown += `*${description}*\n`;
    highlights.forEach(highlight => {
        markdown += `- ${highlight}\n`;
    });
    markdown += renderProjectTechStack(techStack, includeLinks, compactMode);
    return markdown;
}
function renderProjects({ projects, includeLinks = true, format = 'standard', compactMode = false, showDemoLink = true }) {
    if (projects.length === 0)
        return '';
    let markdown = `## Independent Projects (2023 - Present)\n\n`;
    markdown += `Building production-grade applications, focusing on AI-native experiences and thoughtful UI/UX design:\n\n`;
    projects.forEach(project => {
        markdown += renderProjectItem(project, includeLinks, format, compactMode);
    });
    if (showDemoLink && includeLinks) {
        markdown += `*Demo materials available at [luke-nittmann.vercel.app/projects](https://luke-nittmann.vercel.app/projects)*\n\n`;
    }
    return markdown;
}
//# sourceMappingURL=Projects.js.map