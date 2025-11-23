// src/controllers/ordersController.js
import pool from "../config/db.js";

/**
 * Create order from user's cart:
 * 1) Read cart items
 * 2) Check stock
 * 3) Begin transaction
 * 4) Create order
 * 5) Insert order_items (snapshot price)
 * 6) Deduct stock
 * 7) Clear cart_items
 * 8) Commit
 */
export async function createOrderFromCart(req, res) {
  const userId = req.user.userId;
  const { address_id } = req.body;
  if (!address_id) return res.status(400).json({ message: "address_id required" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // get cart_id
    const [cartRows] = await conn.query("SELECT cart_id FROM carts WHERE user_id = ?", [userId]);
    if (cartRows.length === 0) { await conn.rollback(); return res.status(400).json({ message: "Cart empty" }); }
    const cartId = cartRows[0].cart_id;

    // get cart items with product info
    const [items] = await conn.query(
      `SELECT ci.cart_item_id, ci.product_id, ci.quantity, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = ? FOR UPDATE`,
      [cartId]
    );

    if (items.length === 0) { await conn.rollback(); return res.status(400).json({ message: "Cart empty" }); }

    // check stock
    for (const it of items) {
      if (it.quantity > it.stock) {
        await conn.rollback();
        return res.status(400).json({ message: `Insufficient stock for product ${it.product_id}` });
      }
    }

    // calculate total
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);

    // create order
    const [orderRes] = await conn.query("INSERT INTO orders (user_id, address_id, total_amount) VALUES (?, ?, ?)", [userId, address_id, total]);
    const orderId = orderRes.insertId;

    // insert order_items and deduct stock
    for (const it of items) {
      await conn.query("INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)", [orderId, it.product_id, it.quantity, it.price]);
      const newStock = it.stock - it.quantity;
      await conn.query("UPDATE products SET stock = ? WHERE product_id = ?", [newStock, it.product_id]);
    }

    // clear cart_items
    await conn.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

    await conn.commit();
    res.status(201).json({ order_id: orderId, total });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Checkout failed", error: err.message });
  } finally {
    conn.release();
  }
}

export async function getOrders(req, res) {
  const userId = req.user.userId;
  const isAdmin = req.user && req.user.roleId === 1; // roleId 1 => Admin by seeding
  try {
    let rows;
    if (isAdmin) {
      [rows] = await pool.query("SELECT o.*, u.full_name FROM orders o JOIN users u ON o.user_id = u.user_id ORDER BY created_at DESC");
    } else {
      [rows] = await pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    }
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function getOrderById(req, res) {
  const userId = req.user.userId;
  const orderId = req.params.id;
  try {
    // fetch order
    const [orders] = await pool.query("SELECT * FROM orders WHERE order_id = ?", [orderId]);
    if (!orders[0]) return res.status(404).json({ message: "Not found" });
    const order = orders[0];
    // check access: admin or owner
    const [roleCheck] = await pool.query("SELECT role_id FROM users WHERE user_id = ?", [req.user.userId]);
    const isAdmin = roleCheck[0] && roleCheck[0].role_id === 1;
    if (!isAdmin && order.user_id !== userId) return res.status(403).json({ message: "Forbidden" });

    const [items] = await pool.query("SELECT oi.*, p.product_name FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?", [orderId]);
    res.json({ order, items });
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function updateOrderStatus(req, res) {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    await pool.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, orderId]);
    res.json({ message: "Status updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
}
