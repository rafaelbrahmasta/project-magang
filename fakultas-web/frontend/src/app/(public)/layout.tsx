import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// ===== Ubah teks di bagian ini =====
const NAMA = "Universitas Pignatelli Triputra";
const SINGKATAN = "UPT";
const DAFTAR_URL = "#"; // ganti dengan alamat pendaftaran yang sebenarnya

// Menu dipindahkan untuk bagian footer
const FOOTER_LINKS = [
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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${font.className} flex min-h-screen flex-col bg-white text-[#1B2A44]`}>
      {/* Header / Navbar Utama */}
      <header className="border-b border-[#DCE6F5]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0B3D91] text-[13px] font-extrabold text-white">
              {SINGKATAN}
            </span>
            <span className="text-sm font-extrabold uppercase leading-tight text-[#0B2A5E]">
              {NAMA}
            </span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {MENU.map((m) => (
              <Link key={m.label} href={m.href}>
                {m.label}
              </Link>
            ))}
          </nav>
          <a
            href={DAFTAR_URL}
            className="rounded-[10px] bg-[#1E6FD9] px-5 py-3 text-sm font-semibold text-white"
          >
            Daftar Sekarang
          </a>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1">{children}</main>

      {/* Footer dengan Menu Pindahan */}
      <footer className="bg-[#0A2A66] text-[#DCE6F5]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="font-extrabold text-white text-lg">{NAMA}</p>
            </div>

            {/* Menu Navigasi Footer */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-[#DCE6F5] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-[#1E3E7A] pt-6 text-[13px] text-[#9FB7E0]">
            © {new Date().getFullYear()} {NAMA}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}