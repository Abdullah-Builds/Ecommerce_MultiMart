import express from "express";
import { createPayment, getPayments, getPaymentById } from "../controllers/paymentsController.js";
import { authenticate, authorizeRole } from "../middleware/auth.js";
const router = express.Router();

router.post("/", createPayment); // You might protect in real life
router.get("/", authenticate, authorizeRole("Admin"), getPayments);
router.get("/:id", authenticate, authorizeRole("Admin"), getPaymentById);

export default router;
