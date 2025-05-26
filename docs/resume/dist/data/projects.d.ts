import { TechStack } from './experience';
export interface Project {
    id: string;
    name: string;
    url?: string;
    description: string;
    highlights: string[];
    techStack: TechStack[];
    tags: string[];
    featured: boolean;
    startDate?: string;
    endDate?: string;
    status: 'active' | 'completed' | 'archived';
}
export declare const projects: Project[];
export declare const getProjectsByTags: (tags: string[]) => Project[];
export declare const getFeaturedProjects: () => Project[];
export declare const getProjectById: (id: string) => Project | undefined;
//# sourceMappingURL=projects.d.ts.map