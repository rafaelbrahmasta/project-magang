import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});
export async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Email atau password tidak valid" });
        return;
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    // Pesan sengaja sama agar tidak membocorkan apakah email terdaftar
    const valid = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !valid) {
        res.status(401).json({ message: "Email atau password salah" });
        return;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
}
export async function me(req, res) {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
        res.status(404).json({ message: "User tidak ditemukan" });
        return;
    }
    res.json(user);
}
//# sourceMappingURL=auth.controller.js.map