import { z } from "zod";

const categoryEnum = z.enum(["BERITA", "PENGUMUMAN", "AGENDA", "PRESTASI"]);
const statusEnum = z.enum(["DRAFT", "PUBLISHED"]);

// Dasar tanpa nilai bawaan, dipakai untuk update
const postBase = z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    content: z.string().min(1),
    thumbnail: z.string().optional(),
    category: categoryEnum,
    status: statusEnum,
    eventDate: z.coerce.date().optional(),
    publishedAt: z.coerce.date().optional(),
    facultyId: z.number().int().positive().nullable().optional(),
    studyProgramId: z.number().int().positive().nullable().optional(),
});

// Untuk membuat postingan: category dan status punya nilai bawaan
export const postSchema = postBase.extend({
    category: categoryEnum.default("BERITA"),
    status: statusEnum.default("DRAFT"),
});

// Untuk update: semua field opsional dan tanpa nilai bawaan
export const postUpdateSchema = postBase.partial();

export const postListQuery = z.object({
    category: categoryEnum.optional(),
    status: statusEnum.optional(),
    faculty: z.string().optional(),
    program: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
});