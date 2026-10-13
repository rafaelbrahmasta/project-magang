import { Router } from "express";
import {
    listPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram,
} from "../controllers/program.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", listPrograms);
router.get("/:slug", getProgram);

router.post("/", requireAuth, createProgram);
router.put("/:id", requireAuth, updateProgram);
router.delete("/:id", requireAuth, deleteProgram);

export default router;