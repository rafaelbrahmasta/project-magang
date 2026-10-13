import "dotenv/config";
import app from "./app.js";
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
    console.error("JWT_SECRET belum diisi atau terlalu pendek (minimal 32 karakter).");
    process.exit(1);
}
const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map