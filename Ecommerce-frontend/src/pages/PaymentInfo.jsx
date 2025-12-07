import React, { useState } from "react";
import { address , payment, order} from "../api/index";
import { toast } from "react-toastify";

const PaymentInfo = () => {
  const [userInfo, setUserInfo] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    country: "",
    city: "",
    state: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    transactionId: "",
    amount: "",
    method: "", 
  });

  const [errors, setErrors] = useState({});


  

  const handleUserChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(userInfo).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });
    Object.entries(paymentInfo).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    toast.info("Processing checkout...");

    const addressRes = await address.InsertInfo({
      address_line1: userInfo.address1,
      address_line2: userInfo.address2,
      city: userInfo.city,
      state: userInfo.state,
      postal_code: userInfo.postalCode,
      country: userInfo.country
    });

    const newAddressId = addressRes?.data?.address_id;
    if (!newAddressId) {
      toast.error("Failed to save address.");
      return;
    }

    const orderRes = await order.InsertInfo({
      address_id: newAddressId
    });

    if (!orderRes?.data?.order_id) {
      toast.error("Order creation failed.");
      return;
    }

    const orderId = orderRes.data.order_id;
    const totalAmount = orderRes.data.total;

    if( Number(paymentInfo.amount) != Number(totalAmount)){
      toast.error(`Payable Amount is ${totalAmount} `)
      return;
    }

    const paymentRes = await payment.InsertInfo({
      order_id: orderId,
      transaction_id: paymentInfo.transactionId,
      amount: totalAmount,
      method: paymentInfo.method
    });

    if (!paymentRes || paymentRes.status !== 200) {
      toast.error("Payment failed.");
      return;
    }
 
    toast.success("Checkout completed successfully!");

  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong during checkout";
    toast.error(msg);
  }
};

  const paymentOptions = [
    "Credit Card",
    "Debit Card",
    "PayPal",
    "Bank Transfer",
    "COD",
  ];

  return (
    <div className="checkout-container">
      <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "15px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Transaction Details</h3>

      <div
        style={{
          background: "#f5f5f5",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Transaction ID:</strong> TXN-123456789
        </p>
      </div>
    </div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-card">
          <h2>User Information</h2>
          <div className="form-grid">
            {["address1", "address2", "postalCode", "country", "city", "state"].map((field) => (
              <div key={field} className="form-group">
                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type="text"
                  name={field}
                  value={userInfo[field]}
                  onChange={handleUserChange}
                />
                {errors[field] && <span className="error">{errors[field]}</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-card">
          <h2>Payment Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={paymentInfo.transactionId}
                onChange={handlePaymentChange}
              />
              {errors.transactionId && <span className="error">{errors.transactionId}</span>}
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="text"
                name="amount"
                value={paymentInfo.amount}
                onChange={handlePaymentChange}
              />
              {errors.amount && <span className="error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="method"
                value={paymentInfo.method}
                onChange={handlePaymentChange}
              >
                <option value="">Select Payment Method</option>
                {paymentOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.method && <span className="error">{errors.method}</span>}
            </div>
          </div>
        </div>

        <button type="submit" className="checkout-button" onChange={handleSubmit}>
          Complete Checkout
        </button>
      </form>
    </div>
  );
};

export default PaymentInfo;
