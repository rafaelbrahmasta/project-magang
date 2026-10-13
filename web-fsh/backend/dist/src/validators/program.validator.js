import { z } from "zod";
export const programSchema = z.object({
    name: z.string().min(3),
    slug: z.string().optional(),
    level: z.enum(["D3", "D4", "S1", "S2", "S3"]),
    accreditation: z.string().optional(),
    profile: z.string().min(1),
    vision: z.string().optional(),
    mission: z.array(z.string()).optional(),
    totalSks: z.number().int().positive().optional(),
    studyDuration: z.string().optional(),
    curriculumYear: z.string().optional(),
    curriculumFile: z.string().optional(),
    courseGroups: z
        .array(z.object({ title: z.string(), courses: z.array(z.string()) }))
        .optional(),
    careerProspects: z.array(z.string()).optional(),
    facilities: z
        .array(z.object({ name: z.string(), image: z.string().optional() }))
        .optional(),
    heroImage: z.string().optional(),
    email: z.string().optional(),
    facultyId: z.number().int().positive(),
});
export const programUpdateSchema = programSchema.partial();
//# sourceMappingURL=program.validator.js.map