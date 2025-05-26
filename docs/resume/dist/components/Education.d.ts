import { Education } from '../data/education';
interface EducationOptions {
    education: Education[];
    includeCoursework?: boolean;
    format?: 'standard' | 'latex';
}
export declare function renderEducation({ education, includeCoursework, format }: EducationOptions): string;
export {};
//# sourceMappingURL=Education.d.ts.map