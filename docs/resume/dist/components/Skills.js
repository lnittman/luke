"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSkills = renderSkills;
function renderSkillCategory(categoryName, categorySkills, includeLinks, showProficiency) {
    if (categorySkills.length === 0)
        return '';
    let markdown = `### ${categoryName}\n`;
    categorySkills.forEach(skill => {
        const skillText = includeLinks && skill.url ? `[${skill.name}](${skill.url})` : skill.name;
        let skillLine = `- ${skillText}`;
        if (showProficiency) {
            skillLine += ` (${skill.proficiency})`;
            if (skill.yearsOfExperience) {
                skillLine += ` - ${skill.yearsOfExperience}+ years`;
            }
        }
        markdown += `${skillLine}\n`;
    });
    markdown += '\n';
    return markdown;
}
function renderFlatSkillsList(skills, includeLinks, showProficiency) {
    let markdown = '';
    skills.forEach(skill => {
        const skillText = includeLinks && skill.url ? `[${skill.name}](${skill.url})` : skill.name;
        let skillLine = `- ${skillText}`;
        if (showProficiency) {
            skillLine += ` (${skill.proficiency})`;
            if (skill.yearsOfExperience) {
                skillLine += ` - ${skill.yearsOfExperience}+ years`;
            }
        }
        markdown += `${skillLine}\n`;
    });
    return markdown;
}
function getCategoryPriority(categoryName) {
    const priorities = {
        'Programming Languages': 1,
        'Frontend': 2,
        'Backend': 3,
        'AI/ML': 4,
        'Database': 5,
        'Cloud & Infrastructure': 6,
        'Audio/Video': 7,
        'Tools & Practices': 8,
    };
    return priorities[categoryName] || 999;
}
function renderSkills({ skills, includeLinks = true, format = 'standard', groupByCategory = true, showProficiency = false }) {
    if (skills.length === 0)
        return '';
    let markdown = `## Skills\n\n`;
    if (!groupByCategory) {
        markdown += renderFlatSkillsList(skills, includeLinks, showProficiency);
        return markdown;
    }
    // Group skills by category
    const categorizedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});
    // Sort categories by priority
    const sortedCategories = Object.entries(categorizedSkills)
        .sort(([a], [b]) => getCategoryPriority(a) - getCategoryPriority(b));
    sortedCategories.forEach(([categoryName, categorySkills]) => {
        markdown += renderSkillCategory(categoryName, categorySkills, includeLinks, showProficiency);
    });
    return markdown;
}
//# sourceMappingURL=Skills.js.map