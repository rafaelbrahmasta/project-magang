import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: number; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token tidak ditemukan" });
        return;
    }

    try {
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as {
            id: number;
            role: string;
        };
        req.user = { id: payload.id, role: payload.role };
        next();
    } catch {
        res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
}

export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Akses ditolak" });
            return;
        }
        next();
    };
}