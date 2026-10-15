import "dotenv/config";
import app from "./app.js";

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET belum diisi atau terlalu pendek (minimal 32 karakter).");
}

const port = Number(process.env.PORT ?? 5000);

// Di Vercel server dijalankan oleh platform, jadi listen() hanya dipakai di lokal / pm2.
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });
}

// Vercel membaca aplikasi Express dari export default ini.
export default app;