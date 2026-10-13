import rateLimit from "express-rate-limit";
// Hanya kegagalan login yang dihitung
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit." },
});
// Hanya request yang mengubah data (POST, PUT, DELETE).
// GET tidak dibatasi, karena frontend akan mengambil data dari satu alamat IP yang sama.
export const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    skip: (req) => ["GET", "HEAD", "OPTIONS"].includes(req.method),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi." },
});
//# sourceMappingURL=rateLimit.js.map