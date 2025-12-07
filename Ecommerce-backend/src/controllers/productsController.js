// src/controllers/productsController.js
import pool from "../config/db.js";

export async function createProduct(req, res) {
  const { category_id, product_name, description, price, stock, image_url } = req.body;
  if (!category_id || !product_name || price == null) return res.status(400).json({ message: "Missing required fields" });
  try {
    const [r] = await pool.query(
      `INSERT INTO products (category_id, product_name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id, product_name, description || null, price, stock || 0, image_url || null]
    );
    res.status(201).json({ product_id: r.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /products?page=1&limit=10&category=2&search=phone&minPrice=100&maxPrice=2000
export async function getProducts(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (req.query.category) { conditions.push("p.category_id = ?"); params.push(req.query.category); }
    if (req.query.search) { conditions.push("(p.product_name LIKE ? OR p.description LIKE ?)"); params.push(`%${ req.query.search }%`, `%${ req.query.search }%`); }
    if (req.query.minPrice) { conditions.push("p.price >= ?"); params.push(req.query.minPrice); }
    if (req.query.maxPrice) { conditions.push("p.price <= ?"); params.push(req.query.maxPrice); }

    const where = conditions.length ? `WHERE ${ conditions.join(" AND ") }` : "";

    // join with categories
    const [rows] = await pool.query(
      `SELECT p.product_id, p.product_name, p.description, p.price, p.stock, p.image_url, c.category_name
       FROM products p
       JOIN categories c ON p.category_id = c.category_id
       ${ where }
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({ page, limit, data: rows });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

// Make Changes 
export async function getProductById(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.category_name FROM products p JOIN categories c ON p.category_id = c.category_id WHERE p.category_id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateProduct(req, res) {
  const { category_id, product_name, description, price, stock, image_url } = req.body;

  try {
    await pool.query(
      `UPDATE products SET category_id=?, product_name=?, description=?, price=?, stock=?, image_url=? WHERE product_id=?`,
      [category_id, product_name, description, price, stock, image_url, req.params.id]
    );
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function deleteProduct(req, res) {
  try {
    await pool.query("DELETE FROM products WHERE product_id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
} 


export async function getStockbyId(req, res) {
  const id = req.params.id;

  try {
    const [rows] = await pool.query(
      `SELECT stock FROM products WHERE product_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ stock: rows[0].stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
