import pool from "../config/db.js";

// -------------------------------------------------------
// Create address
// -------------------------------------------------------
export async function addAddress(req, res) {
  const userId = req.user.userId;
  const {
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default, 
  } = req.body;

  if (!address_line1 || !city || !country || !userId) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    if (address_line1 == address_line2) {
      await pool.query(
        "UPDATE user_addresses SET is_default = TRUE WHERE user_id = ?",
        [userId]
      );
    }

    const [result] = await pool.query(
      `INSERT INTO user_addresses
      (user_id, address_line1, address_line2, city, state, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        address_line1,
        address_line2 || null,
        city,
        state || null,
        postal_code || null,
        country,
      ]
    );

    res.status(201).json({ message: "Address added", address_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
}

