import { prisma } from "../lib/prisma.js";
import { slugify } from "../utils/helpers.js";
const [, , name, englishName] = process.argv;
if (!name) {
    console.error('Pemakaian: npx tsx src/scripts/create-faculty.ts "Nama Fakultas" "English Name (opsional)"');
    process.exit(1);
}
const slug = slugify(name);
const faculty = await prisma.faculty.upsert({
    where: { slug },
    update: { name, ...(englishName ? { englishName } : {}) },
    create: {
        name,
        englishName: englishName || null,
        slug,
        description: "Deskripsi singkat fakultas.",
    },
});
console.log(`Fakultas siap: ${faculty.name} (slug: ${faculty.slug}, id ${faculty.id})`);
await prisma.$disconnect();
process.exit(0);
//# sourceMappingURL=create-faculty.js.map