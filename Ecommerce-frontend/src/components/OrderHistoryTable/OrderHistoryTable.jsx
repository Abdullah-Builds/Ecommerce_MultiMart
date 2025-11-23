import React, { useEffect, useState } from "react";
import "./OrderHistoryTable.css";
import { cart } from "../../api/index";
import { toast } from "react-toastify";

export default function OrderHistoryTable({ data }) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
    }
  }, [data]);

  const handleQtyChange = (id, newQty) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cart_item_id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleSave = (id, qty) => {
    new Promise((resolve, reject) => {
      try {
        cart.updateCart(id, { quantity: qty });
        resolve();
      } catch (err) {
        reject(err);
      }
    })
      .then(() => {
        toast.success("Item Updated Successfully!");
      })
      .catch(() => {
        toast.error("Something went wrong!");
      })
      .finally(() => {
        setEditingId(null);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    new Promise((resolve, reject) => {
      try {
        cart.deleteCartItem(id); 
        resolve();
      } catch (err) {
        reject(err);
      }
    })
      .then(() => {
        toast.success("Item removed!");
        setItems((prev) => prev.filter((item) => item.cart_item_id !== id));
      })
      .catch(() => {
        toast.error("Failed to delete item");
      });
  };

  return (
    <div className="history-wrapper">
      <h2 className="cart-title">Cart ID: {data.cart_id}</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Image</th>
            <th>Price (₹)</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.cart_item_id}>
              <td>{item.product_name}</td>

              <td>
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="product-img"
                />
              </td>

              <td className="price">₹{item.price}</td>

              <td>
                <input
                  type="number"
                  min="1"
                  disabled={editingId !== item.cart_item_id}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQtyChange(item.cart_item_id, Number(e.target.value))
                  }
                  className={`qty-input ${
                    editingId === item.cart_item_id ? "editable" : ""
                  }`}
                />
              </td>

              <td className="total">
                ₹{item.quantity * Number(item.price)}
              </td>

              {/* EDIT / SAVE BUTTON */}
              <td>
                {editingId === item.cart_item_id ? (
                  <button
                    className="save-btn"
                    onClick={() => handleSave(item.cart_item_id, item.quantity)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(item.cart_item_id)}
                  >
                    Edit
                  </button>
                )}
              </td>

              {/* 🔥 DELETE BUTTON */}
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.cart_item_id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
