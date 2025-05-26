"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderExperience = renderExperience;
function renderTechStack(techStack, includeLinks, compactMode) {
    if (compactMode) {
        const allTechs = techStack.flatMap(stack => stack.technologies);
        const techList = allTechs.map(tech => includeLinks && tech.url ? `[${tech.name}](${tech.url})` : tech.name).join(', ');
        return `**Tech Stack:** ${techList}\n\n`;
    }
    let markdown = `**Tech Stack:**\n`;
    techStack.forEach(stack => {
        const techList = stack.technologies.map(tech => includeLinks && tech.url ? `[${tech.name}](${tech.url})` : tech.name).join(', ');
        markdown += `  - **${stack.category}:** ${techList}\n`;
    });
    markdown += '\n';
    return markdown;
}
function renderExperienceItem(experience, includeLinks, format, compactMode) {
    const { company, position, location, startDate, endDate, description, techStack } = experience;
    let markdown = `### ${company}\n\n`;
    markdown += `*${position} (${location}) | ${startDate} - ${endDate}*\n`;
    description.forEach(desc => {
        markdown += `  - ${desc}\n`;
    });
    markdown += '\n';
    markdown += renderTechStack(techStack, includeLinks, compactMode);
    return markdown;
}
function renderExperience({ experiences, includeLinks = true, format = 'standard', compactMode = false }) {
    if (experiences.length === 0)
        return '';
    let markdown = `## Experience\n\n`;
    experiences.forEach(experience => {
        markdown += renderExperienceItem(experience, includeLinks, format, compactMode);
    });
    return markdown;
}
//# sourceMappingURL=Experience.js.map