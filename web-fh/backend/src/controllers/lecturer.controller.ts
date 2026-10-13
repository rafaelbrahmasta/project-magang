import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { lecturerSchema, lecturerUpdateSchema } from "../validators/lecturer.validator.js";
import { prismaCode } from "../utils/helpers.js";

const withProgram = {
    studyProgram: { select: { id: true, name: true, slug: true, level: true } },
};

export async function listLecturers(req: Request, res: Response) {
    const program = typeof req.query.program === "string" ? req.query.program : undefined;

    const lecturers = await prisma.lecturer.findMany({
        where: program ? { studyProgram: { slug: program } } : {},
        orderBy: { name: "asc" },
        include: withProgram,
    });
    res.json(lecturers);
}

export async function getLecturer(req: Request, res: Response) {
    const lecturer = await prisma.lecturer.findUnique({
        where: { id: Number(req.params.id) },
        include: withProgram,
    });
    if (!lecturer) {
        res.status(404).json({ message: "Dosen tidak ditemukan" });
        return;
    }
    res.json(lecturer);
}

export async function createLecturer(req: Request, res: Response) {
    const parsed = lecturerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }

    try {
        const lecturer = await prisma.lecturer.create({ data: parsed.data });
        res.status(201).json(lecturer);
    } catch (error) {
        const code = prismaCode(error);
        if (code === "P2002") {
            res.status(409).json({ message: "NIDN sudah terdaftar" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "Program studi dengan studyProgramId tersebut tidak ada" });
            return;
        }
        throw error;
    }
}

export async function updateLecturer(req: Request, res: Response) {
    const parsed = lecturerUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }

    try {
        const lecturer = await prisma.lecturer.update({
            where: { id: Number(req.params.id) },
            data: parsed.data,
        });
        res.json(lecturer);
    } catch (error) {
        const code = prismaCode(error);
        if (code === "P2025") {
            res.status(404).json({ message: "Dosen tidak ditemukan" });
            return;
        }
        if (code === "P2002") {
            res.status(409).json({ message: "NIDN sudah terdaftar" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "Program studi dengan studyProgramId tersebut tidak ada" });
            return;
        }
        throw error;
    }
}

export async function deleteLecturer(req: Request, res: Response) {
    try {
        await prisma.lecturer.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Dosen dihapus" });
    } catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Dosen tidak ditemukan" });
            return;
        }
        throw error;
    }
}