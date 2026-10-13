import { Router } from "express";
import { listLecturers, getLecturer, createLecturer, updateLecturer, deleteLecturer, } from "../controllers/lecturer.controller.js";
import { requireAuth } from "../middlewares/auth.js";
const router = Router();
router.get("/", listLecturers);
router.get("/:id", getLecturer);
router.post("/", requireAuth, createLecturer);
router.put("/:id", requireAuth, updateLecturer);
router.delete("/:id", requireAuth, deleteLecturer);
export default router;
//# sourceMappingURL=lecturer.routes.js.map