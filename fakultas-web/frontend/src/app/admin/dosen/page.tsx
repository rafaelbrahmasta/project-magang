"use client";

import CrudPage, { type CrudConfig } from "@/components/admin/CrudPage";

const cfg: CrudConfig = {
    title: "Dosen",
    singular: "Dosen",
    basePath: "/lecturers",
    columns: [
        { key: "name", label: "Nama" },
        { key: "position", label: "Jabatan" },
        { key: "studyProgram", label: "Program Studi", render: (r) => r.studyProgram?.name ?? "-" },
    ],
    filters: [
        {
            key: "studyProgramId",
            label: "Program Studi",
            get: (r) => String(r.studyProgram?.id ?? ""),
            optionsFrom: { path: "/programs", label: (r) => `${r.level} ${r.name}` },
        },
    ],
    sort: (a, b) => String(a.studyProgram?.name ?? "").localeCompare(String(b.studyProgram?.name ?? "")) || String(a.name).localeCompare(String(b.name)),
    groupBy: (r) => (r.studyProgram ? `${r.studyProgram.level} ${r.studyProgram.name}` : "Tanpa program studi"),
    fields: [
        {
            name: "studyProgramId",
            label: "Program Studi",
            type: "select",
            required: true,
            optionsFrom: { path: "/programs", label: (r) => `${r.level} ${r.name}` },
        },
        { name: "name", label: "Nama", type: "text", required: true },
        { name: "nidn", label: "NIDN", type: "text" },
        { name: "position", label: "Jabatan Fungsional", type: "text", required: true },
        { name: "photo", label: "Foto", type: "image" },
        { name: "email", label: "Email", type: "text" },
        { name: "bio", label: "Biografi", type: "textarea" },
    ],
};

export default function Page() {
    return <CrudPage cfg={cfg} />;
}
