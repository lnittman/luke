export interface ResumeConfig {
    id: string;
    name: string;
    description: string;
    experiences: string[];
    projects: string[];
    skillTags: string[];
    maxProjects?: number;
    maxExperiences?: number;
    format: 'standard' | 'latex' | 'both';
    includeLinks: boolean;
    compactMode: boolean;
    jobTags: string[];
    priority: number;
}
export declare const resumeConfigs: ResumeConfig[];
export declare const getResumeConfigById: (id: string) => ResumeConfig | undefined;
export declare const getResumeConfigsByTags: (tags: string[]) => ResumeConfig[];
export declare const getDefaultResumeConfig: () => ResumeConfig;
//# sourceMappingURL=resume-configs.d.ts.map