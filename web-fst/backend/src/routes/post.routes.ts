import { Router } from "express";
import {
    listPublicPosts,
    listAdminPosts,
    getPostAdmin,
    getPost,
    createPost,
    updatePost,
    deletePost,
} from "../controllers/post.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", listPublicPosts);
router.get("/admin/list", requireAuth, listAdminPosts);
router.get("/admin/item/:id", requireAuth, getPostAdmin);
router.get("/:slug", getPost);

router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;