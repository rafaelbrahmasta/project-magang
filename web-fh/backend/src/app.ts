import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import { prisma } from "./lib/prisma.js";
import { loginLimiter, writeLimiter } from "./middlewares/rateLimit.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import programRoutes from "./routes/program.routes.js";
import lecturerRoutes from "./routes/lecturer.routes.js";
import postRoutes from "./routes/post.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Saat dipasang di belakang Nginx atau proxy, aktifkan baris ini:
// app.set("trust proxy", 1);

// FRONTEND_URL boleh lebih dari satu, dipisah koma
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

// Izinkan frontend (alamat berbeda) memuat gambar dari /uploads
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", writeLimiter);

app.get("/", (_req, res) => {
  res.json({ message: "API Website Fakultas berjalan" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    const faculties = await prisma.faculty.count();
    res.json({ status: "ok", faculties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Database tidak terjangkau" });
  }
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), { dotfiles: "deny" }));

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/galleries", galleryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Alamat tidak ditemukan" });
});

app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Ukuran file terlalu besar" : "Upload gagal";
      res.status(400).json({ message });
      return;
    }
    if (err instanceof Error && err.message === "Tipe file tidak diizinkan") {
      res.status(400).json({ message: err.message });
      return;
    }
    if (typeof err === "object" && err !== null && "status" in err && err.status === 400) {
      res.status(400).json({ message: "Request tidak valid" });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
);

export default app;