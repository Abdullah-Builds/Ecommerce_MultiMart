import React, { useEffect, useState } from "react";
import { cart } from "../api/index";
import OrderHistoryTable from "../components/OrderHistoryTable/OrderHistoryTable";
import { useNavigate } from "react-router-dom";
export default function OrderHistory() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const res = await cart.getCart();
      console.log(res?.data);
      setData(res?.data);
    })();
  }, []);
  const NavigateTo = () => {
    navigate("/cart/payment");
  };
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <OrderHistoryTable data={data} />
      <div className="w-full flex justify-center items-center mt-4">
        <button
          type="button"
          className="checkout-button mx-auto  px-4 py-2"
          onClick={NavigateTo}
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
}
