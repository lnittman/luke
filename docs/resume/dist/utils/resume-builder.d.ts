import { personalInfo } from '../data/personal';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import { skills } from '../data/skills';
import { education } from '../data/education';
import { ResumeConfig } from '../data/resume-configs';
export interface ResumeData {
    personalInfo: typeof personalInfo;
    selectedExperiences: typeof experiences;
    selectedProjects: typeof projects;
    selectedSkills: typeof skills;
    education: typeof education;
}
export declare function buildResumeData(config: ResumeConfig): ResumeData;
export declare function generateMarkdown(data: ResumeData, config: ResumeConfig): string;
export declare function generateResumeFromConfig(config: ResumeConfig): string;
//# sourceMappingURL=resume-builder.d.ts.map