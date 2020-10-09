import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToken } from "../../Context/TokenProvider";
import { Commas } from "./../../utils/helpers";
import {
  IOrderInitialState,
  ordersThunk,
} from "../../redux/features/orders/fetchOrders";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
} from "@chakra-ui/core";

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
    let format = new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(date);

    return format || date.toLocaleString();
  }

  return (
    <div className="vendor-orders-p">
      <div className="orders-table">
        <div className="order-title">
          <div>Order ID</div>
          <div>Name</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
          <div>Request</div>
          <div>Order Date</div>
          <div>Completed</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        {!loading && orders.length === 0 ? "You Have No Orders..." : null}
        {loading && (
          <section className="skeleton">
            <div>
              <Skeleton height="40px" my="10px" />
            </div>
            <div>
              <Skeleton height="40px" my="10px" />
            </div>
            <div>
              <Skeleton height="40px" my="10px" />
            </div>
            <div>
              <Skeleton height="40px" my="10px" />
            </div>
            <div>
              <Skeleton height="40px" my="10px" />
            </div>
          </section>
        )}
        {orders.map((o) => (
          <div className="order-item" key={o.id}>
            <div style={{ display: "flex" }}>
              {/* display "*" if order is pending */}
              <span
                style={{
                  color: "red",
                  display:
                    o.accepted === "true"
                      ? "none"
                      : o.canceled === "true"
                      ? "none"
                      : "block",
                }}
              >
                *
              </span>
              <span>{o.order_id}</span>
            </div>
            <div>{o.name}</div>
            <div>{o.price}</div>
            <div>{o.quantity}</div>
            <div>{Commas(o.price * o.quantity)}</div>
            <div>{o.request || "none"}</div>
            <div>{toDate(o.created_at)}</div>
            {/* completed means customer has recieved item */}
            <div>{o.completed === "false" ? "No" : "Delivered"}</div>
            {/* not accepted or not cancelled should mean the item is pending  */}
            <div>
              {o.accepted === "true"
                ? "Accepted"
                : o.canceled === "true"
                ? "Cancelled"
                : "Pending"}
            </div>
            <div>
              <Menu>
                <MenuButton
                  as={Button}
                  size="xs"
                  rightIcon="chevron-down"
                  style={{ background: "var(--deepblue)", color: "white" }}
                >
                  Actions
                </MenuButton>
                <MenuList placement="left-start">
                  <MenuItem
                    isDisabled={
                      o.accepted === "true" || o.canceled === "true"
                        ? true
                        : false
                    }
                  >
                    Accept
                  </MenuItem>
                  <MenuItem
                    isDisabled={
                      o.accepted === "true" || o.canceled === "true"
                        ? true
                        : false
                    }
                  >
                    Cancel
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        ))}
      </div>
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
          border-bottom: 0.6px solid var(--softgrey);
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
