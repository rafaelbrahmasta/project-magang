import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const imageTypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};
const documentTypes = {
    "application/pdf": ".pdf",
};
function makeUploader(folder, allowed, maxMb) {
    const dir = path.join(UPLOAD_ROOT, folder);
    fs.mkdirSync(dir, { recursive: true });
    return multer({
        storage: multer.diskStorage({
            destination: (_req, _file, cb) => cb(null, dir),
            filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${allowed[file.mimetype]}`),
        }),
        limits: { fileSize: maxMb * 1024 * 1024, files: 1 },
        fileFilter: (_req, file, cb) => {
            if (allowed[file.mimetype])
                cb(null, true);
            else
                cb(new Error("Tipe file tidak diizinkan"));
        },
    });
}
export const uploadImage = makeUploader("images", imageTypes, 5).single("file");
export const uploadDocument = makeUploader("documents", documentTypes, 20).single("file");
//# sourceMappingURL=upload.js.map