import { Router } from "express";
import {
    listFaculties,
    getFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
} from "../controllers/faculty.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", listFaculties);
router.get("/:slug", getFaculty);

router.post("/", requireAuth, createFaculty);
router.put("/:id", requireAuth, updateFaculty);
router.delete("/:id", requireAuth, deleteFaculty);

export default router;