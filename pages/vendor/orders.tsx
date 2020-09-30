import React from "react";
import { OrdersComponent } from "../../components/vendor/OrdersComponent";

export const Orders = () => {
  return (
    <div>
      <h1>ORDERS PAGE</h1>
      <div>
        <OrdersComponent limit={null} />
      </div>
    </div>
  );
};

export default Orders;
