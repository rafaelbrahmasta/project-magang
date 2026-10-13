import { prisma } from "../lib/prisma.js";
import { slugify } from "../utils/helpers.js";
const faculties = [
    {
        name: "Fakultas Sains dan Teknologi",
        englishName: "Faculty of Science and Technology",
        description: "Fakultas yang mengembangkan sains dan teknologi untuk menjawab kebutuhan industri dan masyarakat.",
        vision: "Menjadi fakultas sains dan teknologi yang unggul dan inovatif.",
        mission: [
            "Menyelenggarakan pendidikan berbasis praktik industri.",
            "Mengembangkan riset terapan yang bermanfaat bagi masyarakat.",
            "Membangun kolaborasi dengan industri dan perguruan tinggi lain.",
        ],
        careerProspects: ["Software Engineer", "Data Scientist", "System Analyst", "IT Consultant", "Peneliti", "Wirausaha Teknologi"],
        programs: [
            { name: "Informatika", level: "S1", profile: "Profil program studi S1 Informatika." },
            { name: "Rekayasa Perangkat Lunak", level: "S1", profile: "Profil program studi S1 Rekayasa Perangkat Lunak." },
            { name: "Sistem Informasi", level: "S1", profile: "Profil program studi S1 Sistem Informasi." },
        ],
    },
    {
        name: "Fakultas Ekonomi dan Bisnis",
        englishName: "Faculty of Economics and Business",
        description: "Fakultas yang mencetak lulusan ekonomi dan bisnis yang profesional dan berjiwa wirausaha.",
        vision: "Menjadi fakultas ekonomi dan bisnis yang unggul dan berdaya saing.",
        mission: [
            "Menyelenggarakan pendidikan ekonomi dan bisnis yang berkualitas.",
            "Mengembangkan penelitian yang relevan dengan dunia usaha.",
            "Mendorong semangat kewirausahaan mahasiswa.",
        ],
        careerProspects: ["Akuntan", "Konsultan Bisnis", "Analis Keuangan", "Entrepreneur", "Manajer Pemasaran"],
        programs: [
            { name: "Manajemen", level: "S1", profile: "Profil program studi S1 Manajemen." },
            { name: "Akuntansi", level: "S1", profile: "Profil program studi S1 Akuntansi." },
            { name: "Bisnis Digital", level: "S1", profile: "Profil program studi S1 Bisnis Digital." },
        ],
    },
    {
        name: "Fakultas Vokasi",
        englishName: "Faculty of Vocational Studies",
        description: "Fakultas yang menyelenggarakan pendidikan vokasi dengan penekanan pada keterampilan siap kerja.",
        vision: "Menjadi fakultas vokasi yang menghasilkan lulusan terampil dan siap kerja.",
        mission: [
            "Menyelenggarakan pendidikan vokasi berbasis praktik.",
            "Menjalin kerja sama dengan dunia usaha dan industri.",
            "Menghasilkan lulusan yang kompeten dan bersertifikasi.",
        ],
        careerProspects: ["Teknisi", "Staf Administrasi Keuangan", "Staf Pemasaran", "Software Developer"],
        programs: [
            { name: "Teknik Informatika", level: "D3", profile: "Profil program studi D3 Teknik Informatika." },
            { name: "Akuntansi", level: "D3", profile: "Profil program studi D3 Akuntansi." },
            { name: "Manajemen Pemasaran", level: "D3", profile: "Profil program studi D3 Manajemen Pemasaran." },
        ],
    },
];
for (const f of faculties) {
    const { programs, ...facultyData } = f;
    const slug = slugify(f.name);
    const faculty = await prisma.faculty.upsert({
        where: { slug },
        update: {},
        create: { ...facultyData, slug },
    });
    for (const p of programs) {
        await prisma.studyProgram.upsert({
            where: { slug: `${p.level.toLowerCase()}-${slugify(p.name)}` },
            update: {},
            create: {
                name: p.name,
                level: p.level,
                profile: p.profile,
                accreditation: "Unggul",
                totalSks: 144,
                studyDuration: p.level === "D3" ? "6 Semester" : "8 Semester",
                curriculumYear: "2024",
                slug: `${p.level.toLowerCase()}-${slugify(p.name)}`,
                facultyId: faculty.id,
            },
        });
    }
    console.log(`OK: ${faculty.name} (${programs.length} prodi)`);
}
await prisma.$disconnect();
process.exit(0);
//# sourceMappingURL=seed.js.map