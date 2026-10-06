/* eslint-disable @next/next/no-img-element */
import { img, type CourseGroup, type Lecturer, type Product } from "@/lib/public";

export const LEVELS = ["D3", "D4", "S1", "S2", "S3"];
export const card = "rounded-2xl border border-[#DCE6F5] bg-white p-6";
export const tag = "text-xs font-bold uppercase tracking-wide text-[#1559B8]";

export function Hero({ kicker, title, sub, image }: { kicker: string; title: string; sub?: React.ReactNode; image?: string | null }) {
  const u = img(image);
  return (
    <section className="relative overflow-hidden py-24 text-white" style={{ backgroundImage: "linear-gradient(120deg,#0A2A66 0%,#0B3D91 60%,#1E6FD9 100%)" }}>
      {u && <img src={u} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.3 }} />}
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#BFD6FF]">{kicker}</p>
        <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.1]">{title}</h1>
        {sub && <p className="mt-4 text-lg text-[#E3EDFF]">{sub}</p>}
      </div>
    </section>
  );
}

export function Sec({ id, tint, children }: { id?: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-16 ${tint ? "bg-[#F4F8FF]" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

export function Head({ eye, title }: { eye: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1559B8]">{eye}</p>
      <h2 className="text-[34px] font-extrabold leading-tight text-[#0B2A5E]">{title}</h2>
    </div>
  );
}

export function Down({ status }: { status: number }) {
  return (
    <section className="py-24"><div className="mx-auto max-w-6xl px-6">
      <h1 className="text-3xl font-extrabold text-[#0B2A5E]">Data belum bisa dimuat</h1>
      <p className="mt-3 text-slate-600">Pastikan MySQL dan backend menyala. (kode: {status || "tidak terhubung ke backend"})</p>
    </div></section>
  );
}

export function Foto({ src, label, h = "h-40" }: { src?: string | null; label: string; h?: string }) {
  const u = img(src);
  return u ? (
    <img src={u} alt={label} className={`${h} w-full rounded-xl object-cover`} />
  ) : (
    <div className={`${h} flex w-full items-center justify-center rounded-xl text-sm text-[#47608F]`} style={{ backgroundImage: "linear-gradient(135deg,#DCE6F5,#EAF2FF)" }}>{label}</div>
  );
}

export function Checks({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((t, i) => (
        <li key={i} className={`${card} flex items-start gap-3 text-[15px] text-[#3A4D6E]`} style={{ padding: 16 }}>
          <svg style={{ flexShrink: 0, marginTop: 2 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6FD9" strokeWidth="2.2" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>{t}
        </li>
      ))}
    </ul>
  );
}

export function VisiMisi({ vision, mission }: { vision?: string | null; mission: string[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {vision && (
        <div className="rounded-2xl bg-[#0B3D91] p-7 text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#BFD6FF]">Visi</p>
          <p className="text-lg font-semibold leading-relaxed">{vision}</p>
        </div>
      )}
      {mission.length > 0 && (
        <div className={card} style={{ gridColumn: vision ? "span 2 / span 2" : "1 / -1" }}>
          <p className={`${tag} mb-4`}>Misi</p>
          <ol className="space-y-3">
            {mission.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[#3A4D6E]">
                <span style={{ width: 28, height: 28, flexShrink: 0 }} className="flex items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-bold text-[#0B3D91]">{i + 1}</span>
                <span style={{ paddingTop: 3 }}>{m}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export function FokusBelajar({ groups }: { groups: CourseGroup[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {groups.map((g, i) => (
        <div key={g.title} className={card}>
          <div className="mb-3 text-3xl font-extrabold text-[#1E6FD9]">{String(i + 1).padStart(2, "0")}</div>
          <h3 className="mb-3 text-lg font-bold text-[#0B2A5E]">{g.title}</h3>
          <ul className="list-disc space-y-1 pl-5 text-[15px] text-[#3A4D6E]">{g.courses.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

export function Produk({ items }: { items: Product[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((p) => (
        <div key={p.id} className={card}>
          <Foto src={p.image} label="Foto produk" />
          <h3 className="mt-4 text-lg font-bold text-[#0B2A5E]">{p.name}</h3>
          <p className="mt-2 line-clamp-3 text-[15px] text-[#3A4D6E]">{p.description}</p>
          {p.usedBy && <p className="mt-2 text-[13px] text-[#47608F]">{p.usedBy}</p>}
          {p.link && <a href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-3 inline-block text-sm font-bold text-[#1559B8]">Kunjungi →</a>}
        </div>
      ))}
    </div>
  );
}

export function Dosen({ items, showProgram }: { items: Lecturer[]; showProgram?: boolean }) {
  if (items.length === 0) return <p className="text-[15px] text-slate-500">Data dosen belum tersedia.</p>;
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {items.map((l) => {
        const u = img(l.photo);
        const box = { aspectRatio: "3 / 4" } as const;
        return (
          <div key={l.id} className={card} style={{ padding: 12 }}>
            {u ? <img src={u} alt={l.name} className="w-full rounded-xl object-cover" style={box} /> : (
              <div className="flex w-full items-center justify-center rounded-xl bg-[#EAF2FF] text-3xl font-extrabold text-[#0B3D91]" style={box}>
                {l.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
            )}
            <p className="mt-3 font-bold text-[#0B2A5E]">{l.name}</p>
            <p className="text-[13px] text-[#47608F]">{l.position}</p>
            {showProgram && l.studyProgram && <p className={`${tag} mt-2`}>{l.studyProgram.level} {l.studyProgram.name}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function Kontak({ email, phone }: { email?: string | null; phone?: string | null }) {
  if (!email && !phone) return null;
  return (
    <section className="bg-[#0B3D91] py-12">
      <div className="mx-auto max-w-6xl px-6 text-white">
        <h2 className="text-2xl font-extrabold">Hubungi Kami</h2>
        <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
          {email && <a href={`mailto:${email}`} className="font-bold underline">{email}</a>}
          {phone && <a href={`tel:${phone}`} className="font-bold underline">{phone}</a>}
        </div>
      </div>
    </section>
  );
}
