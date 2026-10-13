import { prisma } from "../lib/prisma.js";
import { productSchema, productUpdateSchema } from "../validators/product.validator.js";
import { slugify, prismaCode } from "../utils/helpers.js";
export async function listProducts(req, res) {
    const faculty = typeof req.query.faculty === "string" ? req.query.faculty : undefined;
    const products = await prisma.product.findMany({
        where: faculty ? { faculty: { slug: faculty } } : {},
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json(products);
}
export async function getProduct(req, res) {
    const product = await prisma.product.findUnique({
        where: { slug: String(req.params.slug) },
        include: { faculty: { select: { id: true, name: true, slug: true } } },
    });
    if (!product) {
        res.status(404).json({ message: "Produk tidak ditemukan" });
        return;
    }
    res.json(product);
}
export async function createProduct(req, res) {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    try {
        const product = await prisma.product.create({
            data: { ...parsed.data, slug: slugify(parsed.data.slug ?? parsed.data.name) },
        });
        res.status(201).json(product);
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2002") {
            res.status(409).json({ message: "Slug produk sudah dipakai, gunakan nama atau slug lain" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "Fakultas dengan facultyId tersebut tidak ada" });
            return;
        }
        throw error;
    }
}
export async function updateProduct(req, res) {
    const parsed = productUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: "Data tidak valid", errors: parsed.error.issues });
        return;
    }
    const data = { ...parsed.data };
    if (data.slug)
        data.slug = slugify(data.slug);
    try {
        const product = await prisma.product.update({
            where: { id: Number(req.params.id) },
            data,
        });
        res.json(product);
    }
    catch (error) {
        const code = prismaCode(error);
        if (code === "P2025") {
            res.status(404).json({ message: "Produk tidak ditemukan" });
            return;
        }
        if (code === "P2002") {
            res.status(409).json({ message: "Slug produk sudah dipakai" });
            return;
        }
        if (code === "P2003") {
            res.status(400).json({ message: "Fakultas dengan facultyId tersebut tidak ada" });
            return;
        }
        throw error;
    }
}
export async function deleteProduct(req, res) {
    try {
        await prisma.product.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Produk dihapus" });
    }
    catch (error) {
        if (prismaCode(error) === "P2025") {
            res.status(404).json({ message: "Produk tidak ditemukan" });
            return;
        }
        throw error;
    }
}
//# sourceMappingURL=product.controller.js.map