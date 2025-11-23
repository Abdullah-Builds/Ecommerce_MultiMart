import React, { useEffect, useState } from "react";
import { cart } from "../api/index";
import OrderHistoryTable from "../components/OrderHistoryTable/OrderHistoryTable";

export default function OrderHistory() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await cart.getCart();
      console.log(res?.data)
      setData(res?.data);
    })();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <OrderHistoryTable data={data} />
    </div>
  );
}
