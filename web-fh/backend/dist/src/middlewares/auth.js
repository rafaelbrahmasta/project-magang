import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token tidak ditemukan" });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        req.user = { id: payload.id, role: payload.role };
        next();
    }
    catch {
        res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Akses ditolak" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map