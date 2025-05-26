import { PersonalInfo } from '../data/personal';
interface HeaderOptions {
    personalInfo: PersonalInfo;
    includeLinks?: boolean;
    format?: 'standard' | 'latex';
}
export declare function renderHeader({ personalInfo, includeLinks, format }: HeaderOptions): string;
export {};
//# sourceMappingURL=Header.d.ts.map