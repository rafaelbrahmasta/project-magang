import { z } from "zod";
const roleEnum = z.enum(["SUPER_ADMIN", "ADMIN"]);
export const userCreateSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(3),
    password: z.string().min(8),
    role: roleEnum.default("ADMIN"),
});
export const userUpdateSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().min(3).optional(),
    password: z.string().min(8).optional(),
    role: roleEnum.optional(),
});
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
});
//# sourceMappingURL=user.validator.js.map