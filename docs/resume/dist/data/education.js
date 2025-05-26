"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEducationById = exports.education = void 0;
exports.education = [
    {
        id: "university-of-michigan",
        institution: "University of Michigan, Ann Arbor",
        degree: "Bachelor of Science",
        field: "Computer Science and German Studies",
        graduationYear: 2017,
        relevantCoursework: [
            "EECS 381: Object-oriented and Advanced Programming",
            "EECS 484: Database Management Systems",
            "EECS 495: Accessible Software Systems Design"
        ],
        tags: ["computer-science", "programming", "database", "accessibility", "university"]
    }
];
const getEducationById = (id) => {
    return exports.education.find(edu => edu.id === id);
};
exports.getEducationById = getEducationById;
//# sourceMappingURL=education.js.map