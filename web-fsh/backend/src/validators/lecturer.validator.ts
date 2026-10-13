import { z } from "zod";

export const lecturerSchema = z.object({
    name: z.string().min(3),
    nidn: z.string().optional(),
    position: z.string().min(1),
    photo: z.string().optional(),
    email: z.string().optional(),
    bio: z.string().optional(),
    studyProgramId: z.number().int().positive(),
});

export const lecturerUpdateSchema = lecturerSchema.partial();