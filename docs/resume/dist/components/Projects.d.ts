import { Project } from '../data/projects';
interface ProjectsOptions {
    projects: Project[];
    includeLinks?: boolean;
    format?: 'standard' | 'latex';
    compactMode?: boolean;
    showDemoLink?: boolean;
}
export declare function renderProjects({ projects, includeLinks, format, compactMode, showDemoLink }: ProjectsOptions): string;
export {};
//# sourceMappingURL=Projects.d.ts.map