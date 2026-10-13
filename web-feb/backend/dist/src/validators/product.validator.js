import { z } from "zod";
export const productSchema = z.object({
    name: z.string().min(3),
    slug: z.string().optional(),
    description: z.string().min(1),
    image: z.string().optional(),
    usedBy: z.string().optional(),
    // Hanya http(s) atau alamat internal, supaya tidak ada tautan berbahaya seperti javascript:
    link: z.string().regex(/^(https?:\/\/|\/)/, "Tautan harus diawali http://, https://, atau /").optional(),
    sortOrder: z.number().int().optional(),
    facultyId: z.number().int().positive(),
});
export const productUpdateSchema = productSchema.partial();
//# sourceMappingURL=product.validator.js.map