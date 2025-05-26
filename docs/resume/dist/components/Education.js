"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEducation = renderEducation;
function renderEducationItem(education, includeCoursework, format) {
    const { institution, degree, field, graduationYear, gpa, honors, relevantCoursework } = education;
    let markdown = `**${institution}**\n`;
    markdown += `${degree} in ${field} (${graduationYear})`;
    if (gpa) {
        markdown += ` - GPA: ${gpa}`;
    }
    markdown += '\n\n';
    if (honors && honors.length > 0) {
        markdown += `**Honors:** ${honors.join(', ')}\n\n`;
    }
    if (includeCoursework && relevantCoursework && relevantCoursework.length > 0) {
        markdown += `**Notable Coursework:**\n`;
        relevantCoursework.forEach(course => {
            markdown += `  - **${course}**\n`;
        });
        markdown += '\n';
    }
    return markdown;
}
function renderEducation({ education, includeCoursework = true, format = 'standard' }) {
    if (education.length === 0)
        return '';
    let markdown = `## Education\n\n`;
    education.forEach(edu => {
        markdown += renderEducationItem(edu, includeCoursework, format);
    });
    return markdown;
}
//# sourceMappingURL=Education.js.map