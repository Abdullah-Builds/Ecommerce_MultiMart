// src/controllers/paymentsController.js
import pool from "../config/db.js";

export async function createPayment(req, res) {
  const { order_id, transaction_id, amount, method } = req.body;
  if ( !order_id || !transaction_id || amount == null || !method) return res.status(400).json({ message: "Missing fields" });
  try {
    // validate order exists and amount matches
    const [ord] = await pool.query("SELECT total_amount FROM orders WHERE order_id = ?", [order_id]);
    if (!ord[0]) return res.status(404).json({ message: "Order not found" });
    if (Number(ord[0].total_amount) !== Number(amount)) return res.status(400).json({ message: "Amount mismatch" });

    // insert payment
    await pool.query("INSERT INTO payments (order_id, transaction_id, amount, method, status) VALUES (?, ?, ?, ?, 'Completed')", [order_id, transaction_id, amount, method]);

    // update order status to Processing or Paid
    await pool.query("UPDATE orders SET status = 'Processing' WHERE order_id = ?", [order_id]);

    res.json({ message: "Payment recorded" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Duplicate transaction_id" });
    res.status(500).json({ message: err.message });
  }
}

export async function getPayments(req, res) {
  try {
    const [rows] = await pool.query("SELECT p.*, o.user_id FROM payments p JOIN orders o ON p.order_id = o.order_id ORDER BY payment_date DESC");
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getPaymentById(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM payments WHERE payment_id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
}
