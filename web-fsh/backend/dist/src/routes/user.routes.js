import { Router } from "express";
import { listUsers, createUser, updateUser, deleteUser, } from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
const router = Router();
// Seluruh route di sini khusus SUPER_ADMIN
router.use(requireAuth, requireRole("SUPER_ADMIN"));
router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
//# sourceMappingURL=user.routes.js.map