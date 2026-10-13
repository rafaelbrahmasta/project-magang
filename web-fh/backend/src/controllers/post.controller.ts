import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "../middlewares/auth.js";
import { postSchema, postUpdateSchema, postListQuery } from "../validators/post.validator.js";
import { slugify, prismaCode } from "../utils/helpers.js";

async function uniqueSlug(base: string) {
    let slug = base;
    let i = 2;
    while (await prisma.post.findUnique({ where: { slug }, select: { id: true } })) {
        slug = `${base}-${i++}`;
    }
    return slug;
}

async function listPosts(req: Request, res: Response, adminMode: boolean) {
    const q = postListQuery.safeParse(req.query);
    if (!q.success) {
        res.status(400).json({ message: "Parameter tidak valid", errors: q.error.issues });
        return;
    }
    const { category, status, faculty, program, page, limit } = q.data;

    const where = {
        ...(adminMode ? (status ? { status } : {}) : { status: "PUBLISHED" as const }),
        ...(category ? { category } : {}),
        ...(faculty ? { faculty: { slug: faculty } } : {}),
        ...(program ? { studyProgram: { slug: program } } : {}),
    };

    const [rows, total] = await prisma.$transaction([
        prisma.post.findMany({
            where,
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                thumbnail: true,
                category: true,
                status: true,
                eventDate: true,
                publishedAt: true,
                facultyId: true,
                studyProgramId: true,
            },
        }),
        prisma.post.count({ where }),
    ]);

    const data = rows.map(({ content, ...rest }) => ({
        ...rest,
        excerpt: content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160),
    }));

    res.json({
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
}

export function listPublicPosts(req: Request, res: Response) {
    return listPosts(req, res, false);
}

export function listAdminPosts(req: Request, res: Response) {
    return listPosts(req, res, true);
}

export async function getPost(req: Request, res: Response) {
    const post = await prisma.post.findFirst({
        where: { slug: String(req.params.slug), status: "PUBLISHED" },
        include: {
            author: { select: { name: true } },
            faculty: { select: { id: true, name: true, slug: true } },
            studyProgram: { select: { id: true, name: true, slug: true } },
        },
    });
    if (!post) {
        res.status(404).json({ message: "Postingan tidak ditemukan" });
        return;
    }
    res.json(post);
}

export async function createPost(req: AuthRequest, res: Response) {
    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }

    const slug = await uniqueSlug(slugify(parsed.data.slug ?? parsed.data.title));
    const publishedAt =
        parsed.data.status === "PUBLISHED" ? (parsed.data.publishedAt ?? new Date()) : null;

    try {
        const post = await prisma.post.create({
            data: { ...parsed.data, slug, publishedAt, authorId: req.user!.id },
        });
        res.status(201).json(post);
    } catch (error) {
        if (prismaCode(error) === "P2003") {
            res.status(400).json({ message: "facultyId atau studyProgramId tidak ada" });
            return;
        }
        throw error;
    }
}

export async function updatePost(req: Request, res: Response) {
    const parsed = postUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }

    const id = Number(req.params.id);
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
        res.status(404).json({ message: "Postingan tidak ditemukan" });
        return;
    }

    const data = { ...parsed.data };
    if (data.slug) data.slug = slugify(data.slug);
    if (data.status === "PUBLISHED" && !existing.publishedAt && !data.publishedAt) {
        data.publishedAt = new Date();
    }

    try {
        const post = await prisma.post.update({ where: { id }, data });
        res.json(post);
    } catch (error) {
        const code = prismaCode(error);
        if (code === "P2002") {
            res.status(409).json({ message: "Slug sudah dipakai" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "facultyId atau studyProgramId tidak ada" });
            return;
        }
        throw error;
    }
}

export async function deletePost(req: Request, res: Response) {
    try {
        await prisma.post.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Postingan dihapus" });
    } catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Postingan tidak ditemukan" });
            return;
        }
        throw error;
    }
}
export async function getPostAdmin(req: Request, res: Response) {
    const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
    if (!post) {
        res.status(404).json({ message: "Postingan tidak ditemukan" });
        return;
    }
    res.json(post);
}