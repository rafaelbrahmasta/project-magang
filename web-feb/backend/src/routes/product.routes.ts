import { Router } from "express";
import {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", listProducts);
router.get("/:slug", getProduct);

router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;