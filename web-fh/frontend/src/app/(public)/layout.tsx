import Link from "next/link";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FACULTY } from "@/lib/site";
import { getData, type Faculty } from "@/lib/public";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// ===== Ubah teks di bagian ini =====
const NAMA = "Universitas Pignatelli Triputra";
const SINGKATAN = "UPT";
const DAFTAR_URL = "#"; // ganti dengan alamat pendaftaran yang sebenarnya
const TOP = [
  { label: "Berita Terkini", href: "/berita" },
  { label: "Fakultas", href: "/#fakultas" },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Kehidupan Kampus", href: "/#kehidupan-kampus" },
];
const MENU = [
  { label: "Tentang", href: "/#visi-misi" },
  { label: "Akademik", href: "/#fakultas" },
  { label: "Produk", href: "/#produk" },
  { label: "Kehidupan Kampus", href: "/#kehidupan-kampus" },
];
const MENU_FAKULTAS = [
  { label: "Tentang", href: "/#tentang" },
  { label: "Program Studi", href: "/#prodi" },
  { label: "Produk", href: "/#produk" },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Berita", href: "/#berita" },
  { label: "Dosen", href: "/#dosen" },
];

const loadFaculty = () => (FACULTY ? getData<Faculty>(`/faculties/${FACULTY}`) : Promise.resolve(null));

export async function generateMetadata(): Promise<Metadata> {
  const f = await loadFaculty();
  return { title: f ? `${f.name} | ${NAMA}` : NAMA };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const f = await loadFaculty();
  const judul = f?.name ?? NAMA;
  const menu = FACULTY ? MENU_FAKULTAS : MENU;

  return (
    <div className={`${font.className} flex min-h-screen flex-col bg-white text-[#1B2A44]`}>
      <div className="bg-[#0A2A66] py-2">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 px-6">
          {FACULTY ? (
            <span className="text-xs font-semibold text-white">Bagian dari {NAMA}</span>
          ) : (
            TOP.map((t) => (<Link key={t.label} href={t.href} className="text-xs font-semibold text-white">{t.label}</Link>))
          )}
        </div>
      </div>
      <header className="border-b border-[#DCE6F5]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0B3D91] text-[13px] font-extrabold text-white">{SINGKATAN}</span>
            <span className="text-sm font-extrabold uppercase leading-tight text-[#0B2A5E]">{judul}</span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {menu.map((m) => (<Link key={m.label} href={m.href}>{m.label}</Link>))}
          </nav>
          <a href={DAFTAR_URL} className="rounded-[10px] bg-[#1E6FD9] px-5 py-3 text-sm font-semibold text-white">Daftar Sekarang</a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-[#0A2A66] text-[#DCE6F5]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-extrabold text-white">{judul}</p>
          {f && <p className="mt-1 text-sm">{NAMA}</p>}
          <p className="mt-6 text-[13px] text-[#9FB7E0]">© {new Date().getFullYear()} {NAMA}</p>
        </div>
      </footer>
    </div>
  );
}
