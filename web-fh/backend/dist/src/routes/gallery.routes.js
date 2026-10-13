import { Router } from "express";
import { listGalleries, getGallery, createGallery, updateGallery, deleteGallery, } from "../controllers/gallery.controller.js";
import { requireAuth } from "../middlewares/auth.js";
const router = Router();
router.get("/", listGalleries);
router.get("/:id", getGallery);
router.post("/", requireAuth, createGallery);
router.put("/:id", requireAuth, updateGallery);
router.delete("/:id", requireAuth, deleteGallery);
export default router;
//# sourceMappingURL=gallery.routes.js.map