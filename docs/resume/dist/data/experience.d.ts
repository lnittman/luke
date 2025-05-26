export interface TechStack {
    category: string;
    technologies: Array<{
        name: string;
        url?: string;
    }>;
}
export interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
    techStack: TechStack[];
    highlights?: string[];
    tags: string[];
}
export declare const experiences: Experience[];
export declare const getExperiencesByTags: (tags: string[]) => Experience[];
export declare const getExperienceById: (id: string) => Experience | undefined;
//# sourceMappingURL=experience.d.ts.map