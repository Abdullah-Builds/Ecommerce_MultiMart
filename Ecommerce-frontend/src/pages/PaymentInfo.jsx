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

//   const handleSubmit =async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     console.log("User Info:", userInfo);
//     console.log("Payment Info:", paymentInfo);
    
//     try{
//        await address.InsertInfo({address_line1 : userInfo.address1, address_line2 :userInfo.address2,city:userInfo.city,state:userInfo.state
//         ,postal_code : userInfo.postalCode,country : userInfo.country
//         })
//        const response = await address.getAddress();
// const addresses = response?.data;

// console.log("Addresses:", addresses);

// if (addresses && addresses.length > 0) {

//   for (const item of addresses) {
//     const addressId = item.address_id;

//     console.log("Processing address:", addressId);

//     const response =  await order.InsertInfo({
//       address_id: addressId
//     });
//     await payment.InsertInfo({
//       order_id : response?.data?.order_id,
//       transaction_id: paymentInfo.transactionId,
//       amount: response?.data?.total,
//       method: paymentInfo.method
//     });

//   }

// }

//     }catch(err){
//          console.log(err)
//     }
//     alert("Checkout submitted successfully!");
//   };


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    toast.info("Processing checkout...");

    // 1️⃣ Insert Address
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

    // 2️⃣ Create Order
    const orderRes = await order.InsertInfo({
      address_id: newAddressId
    });

    if (!orderRes?.data?.order_id) {
      toast.error("Order creation failed.");
      return;
    }

    const orderId = orderRes.data.order_id;
    const totalAmount = orderRes.data.total;

    // 3️⃣ Create Payment
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
      <form onSubmit={handleSubmit} className="checkout-form">
        {/* User Info */}
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

        {/* Payment Info */}
        <div className="checkout-card">
          <h2>Payment Details</h2>
          <div className="form-grid">
            {/* Transaction ID */}
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

            {/* Amount */}
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

            {/* Payment Method */}
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
