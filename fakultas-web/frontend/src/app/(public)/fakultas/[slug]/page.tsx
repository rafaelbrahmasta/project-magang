import Link from "next/link";
import { notFound } from "next/navigation";
import { getData, getDetail, list, strengthsOf, type Faculty, type Lecturer, type Product } from "@/lib/public";
import { card, Checks, Dosen, Down, Head, Hero, Kontak, LEVELS, Produk, Sec, VisiMisi } from "@/components/public/DetailParts";

export default async function FacultyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ data: f, status }, lecturers, products] = await Promise.all([
    getDetail<Faculty>(`/faculties/${slug}`),
    getData<Lecturer[]>("/lecturers"),
    getData<Product[]>(`/products?faculty=${slug}`),
  ]);
  if (status === 404) notFound();
  if (!f) return <Down status={status} />;

  const programs = f.programs ?? [];
  const slugs = new Set(programs.map((p) => p.slug));
  const dosen = (lecturers ?? []).filter((l) => l.studyProgram && slugs.has(l.studyProgram.slug));
  const careers = list(f.careerProspects);
  const mission = list(f.mission);
  const strengths = strengthsOf(f.strengths);
  const produk = products ?? [];

  let n = 0;
  const tint = () => n++ % 2 === 1; // latar bagian berselang-seling

  return (
    <>
      <Hero kicker={`Fakultas / ${f.name.replace(/^Fakultas\s+/i, "")}`} title={f.name} sub={f.englishName} image={f.heroImage} />

      <Sec tint={tint()}>
        <Head eye="Pengenalan" title="Sekilas Tentang Fakultas" />
        <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-[#3A4D6E]">{f.description}</p>
        {strengths.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {strengths.map((s, i) => (
              <div key={s.title} className={card}>
                <div className="mb-3 text-3xl font-extrabold text-[#1E6FD9]">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mb-2 text-lg font-bold text-[#0B2A5E]">{s.title}</h3>
                <p className="text-[15px] text-[#3A4D6E]">{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </Sec>

      {careers.length > 0 && <Sec tint={tint()}><Head eye="Setelah Lulus" title="Prospek Karir" /><Checks items={careers} /></Sec>}
      {(f.vision || mission.length > 0) && <Sec tint={tint()}><Head eye="Arah dan Tujuan" title="Visi dan Misi" /><VisiMisi vision={f.vision} mission={mission} /></Sec>}

      {programs.length > 0 && (
        <Sec tint={tint()}>
          <Head eye="Akademik" title="Program Studi" />
          {LEVELS.filter((l) => programs.some((p) => p.level === l)).map((l) => (
            <div key={l} className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">Jenjang {l}</p>
              <div className="grid gap-5 md:grid-cols-3">
                {programs.filter((p) => p.level === l).map((p) => (
                  <Link key={p.id} href={`/prodi/${p.slug}`} className={`${card} block font-bold text-[#0B2A5E] transition hover:shadow-md`}>{p.name} <span className="text-[#1559B8]">→</span></Link>
                ))}
              </div>
            </div>
          ))}
        </Sec>
      )}

      {produk.length > 0 && <Sec tint={tint()}><Head eye="Produk" title="Karya dan Inovasi Fakultas" /><Produk items={produk} /></Sec>}
      <Sec tint={tint()}><Head eye="Pengajar" title="Dosen" /><Dosen items={dosen} showProgram /></Sec>
      <Kontak email={f.email} phone={f.phone} />
    </>
  );
}
