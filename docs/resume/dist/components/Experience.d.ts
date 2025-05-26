import { Experience } from '../data/experience';
interface ExperienceOptions {
    experiences: Experience[];
    includeLinks?: boolean;
    format?: 'standard' | 'latex';
    compactMode?: boolean;
}
export declare function renderExperience({ experiences, includeLinks, format, compactMode }: ExperienceOptions): string;
export {};
//# sourceMappingURL=Experience.d.ts.map