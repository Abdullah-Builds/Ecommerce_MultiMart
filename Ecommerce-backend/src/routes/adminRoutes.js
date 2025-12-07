import express from "express";
import {CheckAccess} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/access",authenticate,CheckAccess)
export default router;
