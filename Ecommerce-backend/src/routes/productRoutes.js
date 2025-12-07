import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getStockbyId } from "../controllers/productsController.js";
import { authenticate, authorizeRole } from "../middleware/auth.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/stock/:id",getStockbyId);
export default router;
