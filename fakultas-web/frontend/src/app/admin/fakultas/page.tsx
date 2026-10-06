"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";

const cfg: CrudConfig = {
    title: "Fakultas",
    singular: "Fakultas",
    basePath: "/faculties",
    columns: [
        { key: "name", label: "Nama" },
        { key: "slug", label: "Slug" },
        { key: "programs", label: "Prodi", render: (r) => (Array.isArray(r.programs) ? r.programs.length : 0) },
    ],
    fields: [
        { name: "name", label: "Nama Fakultas", type: "text", required: true },
        { name: "englishName", label: "Nama Inggris", type: "text" },
        { name: "slug", label: "Slug", type: "text", help: "Kosongkan agar dibuat otomatis dari nama." },
        { name: "description", label: "Deskripsi", type: "textarea", required: true },
        { name: "vision", label: "Visi", type: "textarea" },
        { name: "mission", label: "Misi", type: "lines", help: "Satu misi per baris." },
        { name: "careerProspects", label: "Prospek Karir", type: "lines", help: "Satu prospek per baris." },
        { name: "heroImage", label: "Gambar Utama", type: "image" },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Telepon", type: "text" },
        { name: "instagram", label: "Instagram", type: "text" },
        { name: "youtube", label: "YouTube", type: "text" },
        {
            name: "strengths",
            label: "Keunggulan (JSON)",
            type: "json",
            help: 'Contoh: [{"title":"Akreditasi Unggul","description":"Penjelasan singkat"}]',
        },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
