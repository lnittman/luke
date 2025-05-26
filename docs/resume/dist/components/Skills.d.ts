import { Skill } from '../data/skills';
interface SkillsOptions {
    skills: Skill[];
    includeLinks?: boolean;
    format?: 'standard' | 'latex';
    groupByCategory?: boolean;
    showProficiency?: boolean;
}
export declare function renderSkills({ skills, includeLinks, format, groupByCategory, showProficiency }: SkillsOptions): string;
export {};
//# sourceMappingURL=Skills.d.ts.map