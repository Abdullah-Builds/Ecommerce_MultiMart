// src/controllers/categoriesController.js
import pool from "../config/db.js";

export async function createCategory(req, res) {
  const { category_name, description } = req.body;
  if (!category_name) return res.status(400).json({ message: "category_name required" });
  try {
    const [resq] = await pool.query("INSERT INTO categories (category_name, description) VALUES (?, ?)", [category_name, description || null]);
    res.status(201).json({ category_id: resq.insertId, category_name, description });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Category exists" });
    res.status(500).json({ message: "Failed to create category", error: err.message });
  }
}

export async function getAllCategories(req, res) {
  try {
    const [rows] = await pool.query("SELECT category_id, category_name, description FROM categories ORDER BY category_name");
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getCategoryById(req, res) {
  try {
    const [rows] = await pool.query("SELECT category_id, category_name, description FROM categories WHERE category_id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateCategory(req, res) {
  const { category_name, description } = req.body;
  try {
    await pool.query("UPDATE categories SET category_name=?, description=? WHERE category_id=?", [category_name, description, req.params.id]);
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function deleteCategory(req, res) {
  try {
    await pool.query("DELETE FROM categories WHERE category_id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
