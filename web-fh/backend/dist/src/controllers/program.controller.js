import { prisma } from "../lib/prisma.js";
import { programSchema, programUpdateSchema } from "../validators/program.validator.js";
import { slugify, prismaCode } from "../utils/helpers.js";
export async function listPrograms(req, res) {
    const faculty = typeof req.query.faculty === "string" ? req.query.faculty : undefined;
    const programs = await prisma.studyProgram.findMany({
        where: faculty ? { faculty: { slug: faculty } } : {},
        orderBy: [{ level: "asc" }, { name: "asc" }],
        select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            accreditation: true,
            facultyId: true,
        },
    });
    res.json(programs);
}
export async function getProgram(req, res) {
    const program = await prisma.studyProgram.findUnique({
        where: { slug: String(req.params.slug) },
        include: {
            faculty: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    programs: {
                        select: { id: true, name: true, slug: true, level: true },
                        orderBy: { name: "asc" },
                    },
                },
            },
            lecturers: { orderBy: { name: "asc" } },
        },
    });
    if (!program) {
        res.status(404).json({ message: "Program studi tidak ditemukan" });
        return;
    }
    res.json(program);
}
export async function createProgram(req, res) {
    const parsed = programSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    try {
        const program = await prisma.studyProgram.create({
            data: {
                ...parsed.data,
                slug: slugify(parsed.data.slug ?? `${parsed.data.level}-${parsed.data.name}`),
            },
        });
        res.status(201).json(program);
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2002") {
            res.status(409).json({ message: "Slug program studi sudah dipakai" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "Fakultas dengan facultyId tersebut tidak ada" });
            return;
        }
        throw error;
    }
}
export async function updateProgram(req, res) {
    const parsed = programUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    const data = { ...parsed.data };
    if (data.slug)
        data.slug = slugify(data.slug);
    try {
        const program = await prisma.studyProgram.update({
            where: { id: Number(req.params.id) },
            data,
        });
        res.json(program);
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2025") {
            res.status(404).json({ message: "Program studi tidak ditemukan" });
            return;
        }
        if (code === "P2002") {
            res.status(409).json({ message: "Slug program studi sudah dipakai" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "Fakultas dengan facultyId tersebut tidak ada" });
            return;
        }
        throw error;
    }
}
export async function deleteProgram(req, res) {
    try {
        await prisma.studyProgram.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Program studi dihapus" });
    }
    catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Program studi tidak ditemukan" });
            return;
        }
        throw error;
    }
}
//# sourceMappingURL=program.controller.js.map