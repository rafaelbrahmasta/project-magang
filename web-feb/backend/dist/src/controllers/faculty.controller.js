import { prisma } from "../lib/prisma.js";
import { facultySchema, facultyUpdateSchema } from "../validators/faculty.validator.js";
import { slugify, prismaCode } from "../utils/helpers.js";
const withPrograms = {
    programs: {
        select: { id: true, name: true, slug: true, level: true },
        orderBy: { name: "asc" },
    },
};
export async function listFaculties(_req, res) {
    const faculties = await prisma.faculty.findMany({
        orderBy: { name: "asc" },
        include: withPrograms,
    });
    res.json(faculties);
}
export async function getFaculty(req, res) {
    const faculty = await prisma.faculty.findUnique({
        where: { slug: String(req.params.slug) },
        include: withPrograms,
    });
    if (!faculty) {
        res.status(404).json({ message: "Fakultas tidak ditemukan" });
        return;
    }
    res.json(faculty);
}
export async function createFaculty(req, res) {
    const parsed = facultySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    try {
        const faculty = await prisma.faculty.create({
            data: {
                ...parsed.data,
                slug: slugify(parsed.data.slug ?? parsed.data.name),
            },
        });
        res.status(201).json(faculty);
    }
    catch (error) {
        if (prismaCode(error) === "P2002") {
            res.status(409).json({ message: "Slug fakultas sudah dipakai" });
            return;
        }
        throw error;
    }
}
export async function updateFaculty(req, res) {
    const parsed = facultyUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    const data = { ...parsed.data };
    if (data.slug)
        data.slug = slugify(data.slug);
    try {
        const faculty = await prisma.faculty.update({
            where: { id: Number(req.params.id) },
            data,
        });
        res.json(faculty);
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2025") {
            res.status(404).json({ message: "Fakultas tidak ditemukan" });
            return;
        }
        if (code === "P2002") {
            res.status(409).json({ message: "Slug fakultas sudah dipakai" });
            return;
        }
        throw error;
    }
}
export async function deleteFaculty(req, res) {
    try {
        await prisma.faculty.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Fakultas dihapus" });
    }
    catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Fakultas tidak ditemukan" });
            return;
        }
        throw error;
    }
}
//# sourceMappingURL=faculty.controller.js.map