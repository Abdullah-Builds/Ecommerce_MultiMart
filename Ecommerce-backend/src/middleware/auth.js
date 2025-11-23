// src/middleware/auth.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    // fetch minimal user info (role)
    const [rows] = await pool.query("SELECT user_id, full_name, email, role_id FROM users WHERE user_id = ?", [payload.userId]);
    if (!rows || rows.length === 0) return res.status(401).json({ message: "User not found" });
    req.user = { userId: rows[0].user_id, fullName: rows[0].full_name, email: rows[0].email, roleId: rows[0].role_id };
    next();
  } catch (err) {
    console.error(err)
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}

export function authorizeRole(requiredRoleName) {
  return async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT r.role_name FROM roles r JOIN users u ON u.role_id = r.role_id WHERE u.user_id = ?`,
        [req.user.userId]
      );
      if (!rows || rows.length === 0) return res.status(403).json({ message: "Forbidden" });
      if (rows[0].role_name !== requiredRoleName) return res.status(403).json({ message: "Forbidden - insufficient role" });
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
}
