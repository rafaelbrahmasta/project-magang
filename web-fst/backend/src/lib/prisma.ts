import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";

const url = new URL(process.env.DATABASE_URL!);

// Lokal (XAMPP) tanpa SSL. Database cloud (TiDB, dll.) wajib memakai SSL.
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  // Serverless: tiap instance membuka koneksi sendiri, jadi dibuat kecil di Vercel.
  connectionLimit: process.env.VERCEL ? 2 : 5,
  // Database cloud serverless bisa butuh beberapa detik untuk bangun dari idle.
  connectTimeout: 15000,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: true } }),
});

export const prisma = new PrismaClient({ adapter });