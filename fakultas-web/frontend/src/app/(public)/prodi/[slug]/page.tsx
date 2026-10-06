import Link from "next/link";
import { notFound } from "next/navigation";
import { getData, getDetail, groupsOf, img, list, type Faculty, type Product, type Program } from "@/lib/public";
import { card, Checks, Dosen, Down, FokusBelajar, Head, Hero, Kontak, Produk, Sec, VisiMisi } from "@/components/public/DetailParts";

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: p, status } = await getDetail<Program>(`/programs/${slug}`);
  if (status === 404) notFound();
  if (!p) return <Down status={status} />;

  const [fac, products] = await Promise.all([
    p.faculty?.slug ? getData<Faculty>(`/faculties/${p.faculty.slug}`) : null,
    p.faculty?.slug ? getData<Product[]>(`/products?faculty=${p.faculty.slug}`) : null,
  ]);

  const careers = list(p.careerProspects);
  const mission = list(p.mission);
  const groups = groupsOf(p.courseGroups);
  const produk = products ?? [];
  const info = [["Jenjang", p.level], ["Akreditasi", p.accreditation], ["Total SKS", p.totalSks], ["Lama Studi", p.studyDuration], ["Kurikulum", p.curriculumYear]].filter(([, v]) => v);
  const kurikulum = img(p.curriculumFile);

  let n = 0;
  const tint = () => n++ % 2 === 1;

  return (
    <>
      <Hero
        kicker={`Program Studi / ${p.level}`}
        title={p.name}
        sub={p.faculty && <Link href={`/fakultas/${p.faculty.slug}`} className="underline">{p.faculty.name}</Link>}
        image={p.heroImage}
      />

      <Sec tint={tint()}>
        <Head eye="Pengenalan" title="Deskripsi Program Studi" />
        <p className="max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-[#3A4D6E]">{p.profile}</p>
        {info.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {info.map(([k, v]) => (
              <div key={String(k)} className={card} style={{ padding: 16 }}><dt className="text-xs text-[#47608F]">{k}</dt><dd className="mt-1 font-bold text-[#0B2A5E]">{String(v)}</dd></div>
            ))}
          </dl>
        )}
        {kurikulum && <a href={kurikulum} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-[10px] bg-[#1E6FD9] px-6 py-3 text-[15px] font-semibold text-white">Unduh Kurikulum (PDF)</a>}
      </Sec>

      {groups.length > 0 && <Sec tint={tint()}><Head eye="Kurikulum" title="Fokus Pembelajaran" /><FokusBelajar groups={groups} /></Sec>}
      {produk.length > 0 && <Sec tint={tint()}><Head eye="Produk" title="Produk yang Dihasilkan" /><Produk items={produk} /></Sec>}
      {careers.length > 0 && <Sec tint={tint()}><Head eye="Setelah Lulus" title="Prospek Karir" /><Checks items={careers} /></Sec>}
      {(p.vision || mission.length > 0) && <Sec tint={tint()}><Head eye="Arah dan Tujuan" title="Visi dan Misi" /><VisiMisi vision={p.vision} mission={mission} /></Sec>}
      <Sec tint={tint()}><Head eye="Pengajar" title="Dosen Program Studi" /><Dosen items={p.lecturers ?? []} /></Sec>
      <Kontak email={p.email ?? fac?.email} phone={fac?.phone} />
    </>
  );
}
