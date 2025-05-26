export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: number;
    gpa?: number;
    honors?: string[];
    relevantCoursework?: string[];
    tags: string[];
}
export declare const education: Education[];
export declare const getEducationById: (id: string) => Education | undefined;
//# sourceMappingURL=education.d.ts.map