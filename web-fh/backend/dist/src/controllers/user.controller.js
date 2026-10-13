import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { userCreateSchema, userUpdateSchema, changePasswordSchema, } from "../validators/user.validator.js";
import { prismaCode } from "../utils/helpers.js";
// Kolom password tidak pernah ikut dikirim
const safeUser = { id: true, name: true, email: true, role: true, createdAt: true };
export async function listUsers(_req, res) {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        select: safeUser,
    });
    res.json(users);
}
export async function createUser(req, res) {
    const parsed = userCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    const password = await bcrypt.hash(parsed.data.password, 10);
    try {
        const user = await prisma.user.create({
            data: { ...parsed.data, password },
            select: safeUser,
        });
        res.status(201).json(user);
    }
    catch (error) {
        if (prismaCode(error) === "P2002") {
            res.status(409).json({ message: "Email atau username sudah dipakai" });
            return;
        }
        throw error;
    }
}
export async function updateUser(req, res) {
    const parsed = userUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    const id = Number(req.params.id);
    if (parsed.data.role && id === req.user.id) {
        res.status(400).json({ message: "Role akun sendiri tidak dapat diubah" });
        return;
    }
    const { password, ...rest } = parsed.data;
    const data = {
        ...rest,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
    };
    try {
        const user = await prisma.user.update({ where: { id }, data, select: safeUser });
        res.json(user);
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2025") {
            res.status(404).json({ message: "Pengguna tidak ditemukan" });
            return;
        }
        if (code === "P2002") {
            res.status(409).json({ message: "Email atau username sudah dipakai" });
            return;
        }
        throw error;
    }
}
export async function deleteUser(req, res) {
    const id = Number(req.params.id);
    if (id === req.user.id) {
        res.status(400).json({ message: "Tidak dapat menghapus akun sendiri" });
        return;
    }
    try {
        await prisma.user.delete({ where: { id } });
        res.json({ message: "Pengguna dihapus" });
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2025") {
            res.status(404).json({ message: "Pengguna tidak ditemukan" });
            return;
        }
        if (code === "P2003") {
            res.status(409).json({ message: "Pengguna masih memiliki postingan dan tidak bisa dihapus" });
            return;
        }
        throw error;
    }
}
// Ganti password akun sendiri
export async function changePassword(req, res) {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Password baru minimal 8 karakter" });
        return;
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(parsed.data.currentPassword, user.password))) {
        res.status(401).json({ message: "Password saat ini salah" });
        return;
    }
    await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(parsed.data.newPassword, 10) },
    });
    res.json({ message: "Password berhasil diganti" });
}
//# sourceMappingURL=user.controller.js.map