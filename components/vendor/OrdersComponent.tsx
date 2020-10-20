import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToken } from "../../Context/TokenProvider";
import { Commas } from "./../../utils/helpers";
import {
  IOrderInitialState,
  ordersThunk,
} from "../../redux/features/orders/fetchOrders";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  useToast,
} from "@chakra-ui/core";
import { useMutation } from "../../utils/useMutation";

interface Iprops {
  limit: number | null;
}

interface DefaultOrderState {
  orders: IOrderInitialState;
}

export const OrdersComponent: React.FC<Iprops> = ({ limit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const [cancel, setCancel] = useState(false);
  // Redux stuff
  const dispatch = useDispatch();
  const toast = useToast();
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

  //accept order
  async function handleOrderAccept(id, name, quantity, subtotal) {
    const acceptOrder = `
    mutation acceptOrder($id:ID!){
      acceptOrder(id:$id){
        message
      }
    }
    `;
    if (
      window.confirm(`Are you sure you want to Accept this Order? 
      
      *Note: Accepting an order means the product is READILY AVAILABLE. Expect a dispatch rider soon.
      
      *Details -

      Product: ${name}

      Quantity: ${quantity}
      
      Subtotal: ${subtotal}
      `)
    ) {
      const { data, error } = await useMutation(acceptOrder, { id }, Token);
      if (data) {
        dispatch(ordersThunk(Token, { limit: null }));
        toast({
          title: "Order Has Been Accepted",
          description: "A Dispatch Rider Will Get In Touch Soon",
          status: "info",
          duration: 7000,
        });
      }
      if (error) {
        toast({
          title: "Error Accepting Order",
          description: "Check Your Internet Connection",
          status: "error",
        });
      }
    }
  }

  //cancel order
  async function handleOrderCancel(id, name, quantity, subtotal) {
    const cancelOrder = `
    mutation cancelOrder($id:ID!){
      cancelOrder(id:$id){
        message
      }
    }
    `;
    let answer = window.prompt(
      `Please Tell Us Why You wish to cancel This Order

      *Details -

      Product: ${name}

      Quantity: ${quantity}
      
      Subtotal: ${subtotal}
      `
    );
    if (answer) {
      const { data, error } = await useMutation(cancelOrder, { id }, Token);
      if (data) {
        dispatch(ordersThunk(Token, { limit: null }));
        toast({
          title: "Order Has Been Cancelled",
          status: "info",
        });
      }
      if (error) {
        toast({
          title: "Error Cancelling Order",
          status: "error",
        });
      }
    }
  }

  //Parse Date
  function toDate(d) {
    let date = new Date(parseInt(d));
    let format = new Intl.DateTimeFormat("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    return format || date.toLocaleString();
  }

  return (
    <div className="vendor-orders-p">
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Request</th>
            <th>Order Date</th>
            <th>Completed</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        {!loading && orders && orders.length === 0
          ? "You Have No Orders..."
          : null}
        {!loading &&
          error &&
          "error Fetching Your Orders, Check your internet connection and refresh"}
        <tbody>
          {loading && (
            <tr className="skeleton">
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
              <td>
                <Skeleton height="40px" my="10px" />
              </td>
            </tr>
          )}
          {!loading &&
            !error &&
            orders &&
            orders.map((o) => (
              <tr className="order-item" key={o.id}>
                <td style={{ display: "flex" }}>
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
                </td>
                <td>{o.name}</td>
                <td>{o.price}</td>
                <td>{o.quantity}</td>
                <td>{Commas(o.price * o.quantity)}</td>
                <td>{o.request || "none"}</td>
                <td>{toDate(o.created_at)}</td>
                {/* completed means customer has recieved item */}
                <td>{o.completed === "false" ? "No" : "Delivered"}</td>
                {/* not accepted or not cancelled should mean the item is pending  */}
                <td>
                  {o.accepted === "true"
                    ? "Accepted"
                    : o.canceled === "true"
                    ? "Cancelled"
                    : "Pending"}
                </td>
                <td>
                  <Popover placement="left" usePortal={true}>
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        rightIcon="chevron-down"
                        style={{
                          background: "var(--deepblue)",
                          color: "white",
                        }}
                      >
                        Action
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent zIndex={4}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Order ID: {o.order_id}</PopoverHeader>
                      <PopoverBody>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Button
                            color="var(--deepblue)"
                            isDisabled={
                              o.accepted === "true" || o.canceled === "true"
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleOrderAccept(
                                o.id,
                                o.name,
                                o.quantity,
                                o.subtotal
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            color="var(--deepblue)"
                            isDisabled={
                              o.accepted === "true" || o.canceled === "true"
                                ? true
                                : false
                            }
                            onClick={() =>
                              handleOrderCancel(
                                o.id,
                                o.name,
                                o.quantity,
                                o.subtotal
                              )
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </PopoverBody>
                      <PopoverFooter fontSize="0.7rem">
                        Ensure the product is readily available before accepting
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <style jsx>{`
        table {
          border-spacing: 5px;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        td:nth-child(5) {
          color: var(--deepblue);
          font-weight: bold;
        }
        th {
          font-size: 0.7rem;
          background-color: #f2f2f2;
        }
        td {
          font-size: 0.8rem;
          padding: 5px 0;
        }
        .name {
          display: flex;
        }
        @media only screen and (min-width: 700px) {
          td {
            padding: 0 10px;
          }
        }
        @media only screen and (min-width: 1000px) {
          td {
            padding: 10px 10px;
          }
        }
        @media only screen and (min-width: 1200px) {
          td {
            padding: 10px 10px;
            font-size: 1rem;
          }
          th {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
