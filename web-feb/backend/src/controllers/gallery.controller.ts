import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
    gallerySchema,
    galleryUpdateSchema,
    galleryListQuery,
} from "../validators/gallery.validator.js";
import { prismaCode } from "../utils/helpers.js";

export async function listGalleries(req: Request, res: Response) {
    const q = galleryListQuery.safeParse(req.query);
    if (!q.success) {
        res.status(400).json({ message: "Parameter tidak valid", errors: q.error.issues });
        return;
    }
    const { page, limit } = q.data;

    const [data, total] = await prisma.$transaction([
        prisma.gallery.findMany({
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.gallery.count(),
    ]);

    res.json({
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
}

export async function getGallery(req: Request, res: Response) {
    const item = await prisma.gallery.findUnique({
        where: { id: Number(req.params.id) },
    });
    if (!item) {
        res.status(404).json({ message: "Foto galeri tidak ditemukan" });
        return;
    }
    res.json(item);
}

export async function createGallery(req: Request, res: Response) {
    const parsed = gallerySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    const item = await prisma.gallery.create({ data: parsed.data });
    res.status(201).json(item);
}

export async function updateGallery(req: Request, res: Response) {
    const parsed = galleryUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }

    try {
        const item = await prisma.gallery.update({
            where: { id: Number(req.params.id) },
            data: parsed.data,
        });
        res.json(item);
    } catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Foto galeri tidak ditemukan" });
            return;
        }
        throw error;
    }
}

export async function deleteGallery(req: Request, res: Response) {
    try {
        await prisma.gallery.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Foto galeri dihapus" });
    } catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Foto galeri tidak ditemukan" });
            return;
        }
        throw error;
    }
}