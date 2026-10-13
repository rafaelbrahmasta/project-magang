import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { changePassword } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.get("/me", requireAuth, me);
router.put("/password", requireAuth, changePassword);

export default router;