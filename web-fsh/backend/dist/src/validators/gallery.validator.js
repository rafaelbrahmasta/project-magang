import { z } from "zod";
export const gallerySchema = z.object({
    title: z.string().min(1),
    imageUrl: z.string().min(1),
});
export const galleryUpdateSchema = gallerySchema.partial();
export const galleryListQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
});
//# sourceMappingURL=gallery.validator.js.map