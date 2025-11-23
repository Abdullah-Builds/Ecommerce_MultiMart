import express from "express";
import {
  addAddress,
  // getUserAddresses,
  // updateAddress,
  // deleteAddress,
  // setDefaultAddress
} from "../controllers/addressControllers.js";
import {authenticate} from "../middleware/auth.js";

const router = express.Router();

// Create new address
router.post("/", authenticate, addAddress);

// // Get  user addresses
// router.get("/", authenticate, getUserAddresses);

// // Update address
// router.put("/:address_id", authenticate, updateAddress);

// // Delete address
// router.delete("/:address_id", authenticate, deleteAddress);

// // Set as default
// router.patch("/:address_id/default", authenticate, setDefaultAddress);

export default router;
