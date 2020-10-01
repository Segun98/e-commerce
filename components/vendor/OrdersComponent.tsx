import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToken } from "../../Context/TokenProvider";
import { Commas } from "./../../utils/helpers";
import {
  IOrderInitialState,
  ordersThunk,
} from "../../redux/features/orders/fetchOrders";
import { Button } from "@chakra-ui/core";

interface Iprops {
  limit: number | null;
}

interface DefaultOrderState {
  orders: IOrderInitialState;
}
export const OrdersComponent: React.FC<Iprops> = ({ limit }) => {
  // Redux stuff
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector<
    DefaultOrderState,
    IOrderInitialState
  >((state) => state.orders);

  //Token from context
  const { Token } = useToken();

  useEffect(() => {
    if (Token) {
      dispatch(ordersThunk(Token, { limit }));
    }
  }, [Token]);

  //Parse Date
  function toDate(d) {
    let date = new Date(parseInt(d));
    return date.toLocaleString();
  }

  return (
    <div className="orders-table">
      <div className="order-title">
        <div>Order ID</div>
        <div>Name</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Subtotal</div>
        <div>Description</div>
        <div>Order Date</div>
        <div>Completed</div>
        <div>Canceled</div>
        <div>Action</div>
      </div>
      {orders.map((o) => (
        <div className="order-item" key={o.id}>
          <div>{o.id}</div>
          <div>{o.name}</div>
          <div>{o.price}</div>
          <div>{o.quantity}</div>
          <div>{Commas(o.price * o.quantity)}</div>
          <div>{o.description}</div>
          <div>{toDate(o.created_at)}</div>
          <div>{o.completed === "false" ? "No" : "Yes"}</div>
          <div>{o.canceled === "false" ? "No" : "Yes"}</div>
          <div>
            <Button variantColor="blue">Action</Button>
          </div>
        </div>
      ))}
      <style jsx>{`
        .orders-table {
          box-shadow: var(--box) var(--softgrey);
          padding: 10px;
          margin-bottom: 50px;
          border-radius: 3px;
          position: absolute;
        }
        .order-title {
          background: var(--softblue);
          border-radius: 10px;
          padding: 5px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .order-item,
        .order-title {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 20px;
        }

        .order-item {
          margin: 4px 0;
          margin-bottom: 0.6px solid var(--softgrey);
        }
        @media only screen and (min-width: 1200px) {
          .orders-table {
            position: static;
          }
        }
        @media only screen and (min-width: 1800px) {
          .order-item,
          .order-title {
            gap: 1px;
          }
        }
      `}</style>
    </div>
  );
};
