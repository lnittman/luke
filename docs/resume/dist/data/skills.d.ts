export interface Skill {
    name: string;
    url?: string;
    category: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
    tags: string[];
    featured: boolean;
}
export interface SkillCategory {
    name: string;
    skills: Skill[];
    priority: number;
}
export declare const skills: Skill[];
export declare const skillCategories: SkillCategory[];
export declare const getSkillsByTags: (tags: string[]) => Skill[];
export declare const getFeaturedSkills: () => Skill[];
export declare const getSkillsByCategory: (category: string) => Skill[];
export declare const getSkillsByProficiency: (proficiency: Skill["proficiency"]) => Skill[];
//# sourceMappingURL=skills.d.ts.map