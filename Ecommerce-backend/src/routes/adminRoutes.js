import express from "express";
import {
  getAdminLogs,
  logAction,
  CheckAccess
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/getLogs", authenticate, getAdminLogs);
router.post("/logActions", authenticate, logAction);
router.get("/access",authenticate,CheckAccess)
export default router;
