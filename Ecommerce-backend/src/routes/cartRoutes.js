import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  deactivateCart,
} from "../controllers/cartsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

// cart level
router.get("/", getCart);
router.delete("/", clearCart);
router.patch("/deactivate", deactivateCart);

// cart_items level
router.post("/items", addToCart);
router.put("/items/:cart_item_id", updateCartItem);
router.delete("/items/:cart_item_id", removeCartItem);

export default router;
