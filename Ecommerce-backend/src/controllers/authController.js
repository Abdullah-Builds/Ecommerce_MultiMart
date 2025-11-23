// src/controllers/authController.js
import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

export async function register(req, res) {
  const { full_name, email, password, phone } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  try {
    // default role = Customer => role_id 2 (ensure seed roles done)
    const roleDefaultId = 2;
    const password_hash = await hashPassword(password);
    const [result] = await pool.query(
      `INSERT INTO users (role_id, full_name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)`,
      [roleDefaultId, full_name, email, password_hash, phone || null]
    );
    const userId = result.insertId;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ userId, full_name, email, token });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email already exists" });
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  try {
    const [rows] = await pool.query("SELECT user_id, password_hash FROM users WHERE email = ?", [email]);
    if (!rows || rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    const user = rows[0];
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const [rows] = await pool.query("SELECT user_id, full_name, email, phone, role_id, created_at FROM users WHERE user_id = ?", [req.user.userId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}
