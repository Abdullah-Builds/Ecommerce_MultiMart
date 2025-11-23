// src/controllers/analyticsController.js
import pool from "../config/db.js";

export async function salesByCategory(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT c.category_id, c.category_name, SUM(oi.quantity * oi.price_at_purchase) AS total_sales
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       JOIN categories c ON p.category_id = c.category_id
       GROUP BY c.category_id, c.category_name
       ORDER BY total_sales DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function topProducts(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;
    const [rows] = await pool.query(
      `SELECT p.product_id, p.product_name, SUM(oi.quantity) AS total_sold
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       GROUP BY p.product_id, p.product_name
       ORDER BY total_sold DESC
       LIMIT ?`, [limit]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
}

export async function revenueByDay(req, res) {
  try {
    // Today's revenue
    const [todayRows] = await pool.query(
      `SELECT SUM(amount) AS total_revenue
       FROM payments
       WHERE DATE(payment_date) = CURDATE();`
    );

    // Yesterday's revenue
    const [yesterdayRows] = await pool.query(
      `SELECT SUM(amount) AS total_revenue
       FROM payments
       WHERE DATE(payment_date) = CURDATE() - INTERVAL 1 DAY;`
    );

    res.json({
      today: todayRows[0].total_revenue || 0,
      yesterday: yesterdayRows[0].total_revenue || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getTotalCustomers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
       SUM(CASE WHEN DATE(u.created_at) = CURDATE() THEN 1 ELSE 0 END) AS users_today,
       SUM(CASE WHEN DATE(u.created_at) < CURDATE() THEN 1 ELSE 0 END) AS users_before_today
       FROM users u
       JOIN orders o ON o.user_id = u.user_id
       WHERE u.role_id = 2;`
    )

    res.json({
      users_today: rows[0].users_today,
      users_before_today: rows[0].users_before_today
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getUsersInfo(req, res) {
  try {
    const [rows] = await pool.query(`
    select count(*) as total, DATE(created_at) as date from users where role_id = 2 group by created_at order by date asc ;
    `)

    res.json({
      sales: rows
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getTotalUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
       SUM(CASE WHEN DATE(u.created_at) <= CURDATE() THEN 1 ELSE 0 END) AS users_today,
       SUM(CASE WHEN DATE(u.created_at) < CURDATE() THEN 1 ELSE 0 END) AS users_before_today
       FROM users u
       WHERE u.role_id = 2;`
    )

    res.json({
      users_today: rows[0].users_today,
      users_before_today: rows[0].users_before_today
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export async function getStock(req, res) {
  try {
    const [rows] = await pool.query(
      `select p.category_id,count(*) as total,c.category_name  from products p 
       join categories c on c.category_id = p.category_id group by p.category_id order by p.category_id desc`
    )

    res.json({
      stock: rows
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}