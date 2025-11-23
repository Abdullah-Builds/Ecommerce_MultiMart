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
    is_default, // added
  } = req.body;

  if (!address_line1 || !city || !country || !userId) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // Handle default address
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



// // -------------------------------------------------------
// // Get user's addresses
// // -------------------------------------------------------
// export async function getUserAddresses(req, res) {
//   const userId = req.user.userId;

//   try {
//     const [rows] = await pool.query(
//       "SELECT address_id FROM user_addresses WHERE user_id = ? ",
//       [userId]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Could not fetch addresses" });
//   }
// }


// // -------------------------------------------------------
// // Update address
// // -------------------------------------------------------
// export async function updateAddress(req, res) {
//   const userId = req.user.userId;
//   const { address_id } = req.params;
//   const {
//     address_line1,
//     address_line2,
//     city,
//     state,
//     postal_code,
//     country,
//     is_default
//   } = req.body;

//   try {
//     // Make default
//     if (is_default) {
//       await pool.query(
//         "UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?",
//         [userId]
//       );
//     }

//     const [result] = await pool.query(
//       `UPDATE user_addresses
//        SET address_line1=?, address_line2=?, city=?, state=?, postal_code=?, country=?, is_default=?
//        WHERE address_id=? AND user_id=?`,
//       [
//         address_line1,
//         address_line2,
//         city,
//         state,
//         postal_code,
//         country,
//         is_default ? true : false,
//         address_id,
//         userId
//       ]
//     );

//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Address not found" });

//     res.json({ message: "Address updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Could not update address" });
//   }
// }


// // -------------------------------------------------------
// // Delete address
// // -------------------------------------------------------
// export async function deleteAddress(req, res) {
//   const userId = req.user.userId;
//   const { address_id } = req.params;

//   try {
//     const [result] = await pool.query(
//       "DELETE FROM user_addresses WHERE address_id=? AND user_id=?",
//       [address_id, userId]
//     );

//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Address not found" });

//     res.json({ message: "Address deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Could not delete address" });
//   }
// }


// // -------------------------------------------------------
// // Set as default address
// // -------------------------------------------------------
// export async function setDefaultAddress(req, res) {
//   const userId = req.user.userId;
//   const { address_id } = req.params;

//   try {
//     // Remove default from others
//     await pool.query(
//       "UPDATE user_addresses SET is_default = FALSE WHERE user_id=?",
//       [userId]
//     );

//     // Set selected address to default
//     const [result] = await pool.query(
//       "UPDATE user_addresses SET is_default = TRUE WHERE address_id=? AND user_id=?",
//       [address_id, userId]
//     );

//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: "Address not found" });

//     res.json({ message: "Default address updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Could not update default address" });
//   }
// }
