import express from "express";
import {
  revenueByDay,
  topProducts,
  salesByCategory,
  getTotalUsers,
  getTotalCustomers,
  getUsersInfo,
  getStock
} from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/revDay", authenticate, revenueByDay);
router.get("/topProd", authenticate, topProducts);
router.get("/salesCat", authenticate, salesByCategory);
router.get("/customers",authenticate,getTotalCustomers);
router.get("/salesinfo",authenticate,getUsersInfo);
router.get("/users",authenticate,getTotalUsers);
router.get("/stocks",authenticate,getStock)
export default router;
