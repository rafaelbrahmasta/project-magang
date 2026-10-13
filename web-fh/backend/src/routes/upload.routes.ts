import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { uploadImage, uploadDocument } from "../middlewares/upload.js";

const router = Router();

function respond(folder: string) {
    return (req: Request, res: Response) => {
        if (!req.file) {
            res.status(400).json({ message: "File tidak ditemukan. Kirim dengan field bernama 'file'" });
            return;
        }
        res.status(201).json({
            url: `/uploads/${folder}/${req.file.filename}`,
            size: req.file.size,
        });
    };
}

router.post("/image", requireAuth, uploadImage, respond("images"));
router.post("/document", requireAuth, uploadDocument, respond("documents"));

export default router;