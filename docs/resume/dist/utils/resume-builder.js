"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResumeData = buildResumeData;
exports.generateMarkdown = generateMarkdown;
exports.generateResumeFromConfig = generateResumeFromConfig;
const personal_1 = require("../data/personal");
const experience_1 = require("../data/experience");
const projects_1 = require("../data/projects");
const skills_1 = require("../data/skills");
const education_1 = require("../data/education");
const Header_1 = require("../components/Header");
const Experience_1 = require("../components/Experience");
const Projects_1 = require("../components/Projects");
const Skills_1 = require("../components/Skills");
const Education_1 = require("../components/Education");
function buildResumeData(config) {
    // Get selected experiences
    const selectedExperiences = config.experiences
        .map(id => (0, experience_1.getExperienceById)(id))
        .filter((exp) => exp !== undefined)
        .slice(0, config.maxExperiences);
    // Get selected projects
    const selectedProjects = config.projects
        .map(id => (0, projects_1.getProjectById)(id))
        .filter((project) => project !== undefined)
        .slice(0, config.maxProjects);
    // Get filtered skills
    const selectedSkills = (0, skills_1.getSkillsByTags)(config.skillTags);
    return {
        personalInfo: personal_1.personalInfo,
        selectedExperiences,
        selectedProjects,
        selectedSkills,
        education: education_1.education
    };
}
function generateMarkdown(data, config) {
    const { personalInfo, selectedExperiences, selectedProjects, selectedSkills, education } = data;
    const { includeLinks, compactMode, format } = config;
    // Convert 'both' format to 'standard' for component rendering
    const componentFormat = format === 'latex' ? 'latex' : 'standard';
    let markdown = '';
    // Header
    markdown += (0, Header_1.renderHeader)({
        personalInfo,
        includeLinks,
        format: componentFormat
    });
    // Experience Section
    markdown += (0, Experience_1.renderExperience)({
        experiences: selectedExperiences,
        includeLinks,
        format: componentFormat,
        compactMode
    });
    // Projects Section
    markdown += (0, Projects_1.renderProjects)({
        projects: selectedProjects,
        includeLinks,
        format: componentFormat,
        compactMode,
        showDemoLink: true
    });
    // Education Section
    markdown += (0, Education_1.renderEducation)({
        education,
        includeCoursework: true,
        format: componentFormat
    });
    // Skills Section
    markdown += (0, Skills_1.renderSkills)({
        skills: selectedSkills,
        includeLinks,
        format: componentFormat,
        groupByCategory: true,
        showProficiency: false
    });
    return markdown;
}
function generateResumeFromConfig(config) {
    const data = buildResumeData(config);
    return generateMarkdown(data, config);
}
//# sourceMappingURL=resume-builder.js.map