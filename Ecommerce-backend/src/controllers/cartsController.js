import pool from "../config/db.js";

/* --------------------------- Helper: get or create cart --------------------------- */
async function getOrCreateActiveCart(userId) {
  const [rows] = await pool.query(
    "SELECT cart_id FROM carts WHERE user_id = ? AND is_active = TRUE",
    [userId]
  );

  if (rows.length === 0) {
    const [ins] = await pool.query(
      "INSERT INTO carts (user_id, is_active) VALUES (?, TRUE)",
      [userId]
    );
    return ins.insertId;
  }

  return rows[0].cart_id;
}

/* --------------------------- Get full cart --------------------------- */
export async function getCart(req, res) {
  const userId = req.user.userId;
  try {
    const cartId = await getOrCreateActiveCart(userId);

    const [items] = await pool.query(
      `SELECT 
         ci.cart_item_id, 
         ci.quantity, 
         p.product_id, 
         p.product_name, 
         p.price, 
         p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.product_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    res.json({ cart_id: cartId, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* --------------------------- Add item to cart --------------------------- */
export async function addToCart(req, res) {
  const userId = req.user.userId;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity)
    return res.status(400).json({ message: "Missing product_id or quantity" });

  try {
    // verify product exists
    const [product] = await pool.query(
      "SELECT product_id FROM products WHERE product_id = ?",
      [product_id]
    );
    if (product.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const cartId = await getOrCreateActiveCart(userId);

    // check if cart item already exists (upsert)
    const [existing] = await pool.query(
      "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, product_id]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
        [existing[0].quantity + quantity, existing[0].cart_item_id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, product_id, quantity]
      );
    }

    return res.json({ message: "Item added to cart", cart_id: cartId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* --------------------------- Update an item --------------------------- */
export async function updateCartItem(req, res) {
  const { cart_item_id } = req.params;
  const { quantity } = req.body;
  const userId = req.user.userId;

  if (!quantity || quantity <= 0)
    return res.status(400).json({ message: "Invalid quantity" });

  try {
    // ensure the cart item belongs to this user
    const [rows] = await pool.query(
      `SELECT ci.cart_id FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.cart_id
       WHERE ci.cart_item_id = ? AND c.user_id = ? AND c.is_active = TRUE`,
      [cart_item_id, userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Item not found in your cart" });

    await pool.query(
      "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
      [quantity, cart_item_id]
    );

    res.json({ message: "Cart item updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* --------------------------- Remove an item --------------------------- */
export async function removeCartItem(req, res) {
  const { cart_item_id } = req.params;
  const userId = req.user.userId;

  try {
    // check ownership
    const [rows] = await pool.query(
      `SELECT ci.cart_id FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.cart_id
       WHERE ci.cart_item_id = ? AND c.user_id = ? AND c.is_active = TRUE`,
      [cart_item_id, userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Item not found in your cart" });

    await pool.query("DELETE FROM cart_items WHERE cart_item_id = ?", [
      cart_item_id,
    ]);

    res.json({ message: "Cart item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* --------------------------- Clear entire cart --------------------------- */
export async function clearCart(req, res) {
  const userId = req.user.userId;
  try {
    const cartId = await getOrCreateActiveCart(userId);

    await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


