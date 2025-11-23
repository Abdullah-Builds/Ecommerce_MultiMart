import express from "express";
import { createOrderFromCart, getOrders, getOrderById, updateOrderStatus } from "../controllers/ordersController.js";
import { authenticate, authorizeRole } from "../middleware/auth.js";
const router = express.Router();

router.use(authenticate);
router.post("/", createOrderFromCart);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", authorizeRole("Admin"), updateOrderStatus);

export default router;
