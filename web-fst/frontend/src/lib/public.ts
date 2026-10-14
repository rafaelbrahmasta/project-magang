export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type Prog = { id: number; name: string; slug: string; level: string };
export type Strength = { icon?: string; title: string; description: string };
export type Faculty = {
  id: number; name: string; englishName?: string | null; slug: string; description: string;
  vision?: string | null; mission?: unknown; careerProspects?: unknown; strengths?: unknown;
  heroImage?: string | null; aboutImage?: string | null; // BARU: aboutImage (foto Sekilas Tentang)
  email?: string | null; phone?: string | null; programs?: Prog[];
};
export type Lecturer = {
  id: number; name: string; position: string; photo?: string | null; email?: string | null;
  studyProgram?: { id: number; name: string; slug: string; level: string };
};
export type Program = Prog & {
  accreditation?: string | null; profile: string; vision?: string | null; mission?: unknown;
  totalSks?: number | null; studyDuration?: string | null; curriculumYear?: string | null;
  curriculumFile?: string | null; careerProspects?: unknown; heroImage?: string | null;
  email?: string | null; courseGroups?: unknown; roadmap?: unknown; // BARU: roadmap
  faculty?: { name: string; slug: string }; lecturers?: Lecturer[];
};
export type Post = {
  id: number; title: string; slug: string; excerpt?: string; content?: string; thumbnail?: string | null;
  category: string; publishedAt?: string | null; author?: { name: string }; faculty?: { name: string; slug: string } | null;
};
export type PostList = { data: Post[]; meta: { page: number; totalPages: number; total: number } };
export type Product = {
  id: number; name: string; slug: string; description: string; image?: string | null;
  usedBy?: string | null; link?: string | null; facultyId: number;
};
export type GalleryItem = { id: number; title: string; imageUrl: string };

/** Ambil data dari backend. Mengembalikan null kalau gagal / tidak ditemukan. */
export async function getData<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${API}/api${path}`, { cache: "no-store" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}
/** Ubah path upload (/uploads/...) menjadi URL lengkap. */
export const img = (p?: string | null) => (!p ? null : p.startsWith("http") ? p : `${API}${p}`);
export const tgl = (d?: string | null) => (d ? new Date(d).toLocaleDateString("id-ID", { dateStyle: "long" }) : "");
/** Pastikan field JSON (misi, prospek karir) berupa array teks. */
export const list = (x: unknown): string[] => (Array.isArray(x) ? x.filter((i) => typeof i === "string") : []);
/** Pastikan field keunggulan berupa array {title, description}. */
export const strengthsOf = (x: unknown): Strength[] =>
  Array.isArray(x) ? x.filter((i) => i && typeof i.title === "string" && typeof i.description === "string") : [];

export type CourseGroup = { title: string; courses: string[] };
/** Pastikan field kelompok mata kuliah berupa array {title, courses[]}. */
export const groupsOf = (x: unknown): CourseGroup[] =>
  Array.isArray(x)
    ? x.filter((g) => g && typeof g.title === "string").map((g) => ({
      title: g.title as string,
      courses: Array.isArray(g.courses) ? (g.courses as unknown[]).filter((c): c is string => typeof c === "string") : [],
    }))
    : [];

// BARU: roadmap studi per semester
export type SemesterPlan = { semester: number; courses: string[] };
/** Pastikan field roadmap berupa array {semester, courses[]}, urut semester, semester kosong dibuang. */
export const roadmapOf = (x: unknown): SemesterPlan[] =>
  Array.isArray(x)
    ? x
      .filter((s) => s && typeof s.semester === "number")
      .map((s) => ({
        semester: s.semester as number,
        courses: Array.isArray(s.courses) ? (s.courses as unknown[]).filter((c): c is string => typeof c === "string") : [],
      }))
      .filter((s) => s.courses.length > 0)
      .sort((a, b) => a.semester - b.semester)
    : [];

/** Seperti getData, tapi membawa kode status agar 404 asli bisa dibedakan dari error server. */
export async function getDetail<T>(path: string): Promise<{ data: T | null; status: number }> {
  try {
    const r = await fetch(`${API}/api${path}`, { cache: "no-store" });
    return { data: r.ok ? ((await r.json()) as T) : null, status: r.status };
  } catch {
    return { data: null, status: 0 };
  }
}