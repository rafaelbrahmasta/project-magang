import { z } from "zod";
export const facultySchema = z.object({
    name: z.string().min(3),
    englishName: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().min(1),
    vision: z.string().optional(),
    mission: z.array(z.string()).optional(),
    careerProspects: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    strengths: z
        .array(z.object({
        icon: z.string().optional(),
        title: z.string().min(1),
        description: z.string().min(1),
    }))
        .optional(),
});
export const facultyUpdateSchema = facultySchema.partial();
//# sourceMappingURL=faculty.validator.js.map