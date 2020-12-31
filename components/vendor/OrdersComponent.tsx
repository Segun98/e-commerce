import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToken } from "@/Context/TokenProvider";
import { Commas, screenWidth } from "@/utils/helpers";
import {
  IOrderInitialState,
  ordersThunk,
} from "@/redux/features/orders/fetchOrders";
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
  Text,
} from "@chakra-ui/core";
import { useMutation } from "@/utils/useMutation";
import { gql } from "graphql-request";

interface Iprops {
  limit: number | null;
}

interface DefaultOrderState {
  orders: IOrderInitialState;
}

export const OrdersComponent: React.FC<Iprops> = ({ limit }) => {
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
    const acceptOrder = gql`
      mutation acceptOrder($id: ID!) {
        acceptOrder(id: $id) {
          message
        }
      }
    `;
    if (
      window.confirm(`A dispatch rider will get in touch after you accept an order.
      
      *Details -

       Product: ${name}

       Quantity: ${quantity}
       
       Subtotal: ${Commas(subtotal)}
      `)
    ) {
      const { data, error } = await useMutation(acceptOrder, { id }, Token);
      if (data) {
        dispatch(ordersThunk(Token, { limit: null }));
        toast({
          title: "Order Has Been Accepted",
          description: "A Dispatch Rider Will Get In Touch Soon",
          status: "info",
          position: "top",
          duration: 7000,
        });
      }
      if (error) {
        toast({
          title: "Error Accepting Order",
          description: "Check Your Internet Connection",
          position: "top",
          status: "error",
        });
      }
    }
  }

  //cancel order
  async function handleOrderCancel(id, name, quantity, subtotal) {
    const cancelOrder = gql`
      mutation cancelOrder($id: ID!, $cancel_reason: String) {
        cancelOrder(id: $id, cancel_reason: $cancel_reason) {
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
      const { data, error } = await useMutation(
        cancelOrder,
        { id, cancel_reason: answer },
        Token
      );

      if (data) {
        dispatch(ordersThunk(Token, { limit: null }));
        toast({
          title: "Order Has Been Cancelled",
          position: "top",
          status: "info",
        });
      }
      if (error) {
        toast({
          title: "Error Cancelling Order",
          position: "top",
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
      {loading && (
        <Text as="div" className="skeleton">
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
        </Text>
      )}

      {!loading &&
        error &&
        "Error fetching your orders, check your internet connection and refresh..."}

      {!loading && !error && orders && orders.length === 0 ? (
        <Text as="div" textAlign="center">
          You Have No Orders...
        </Text>
      ) : null}

      {!loading && !error && orders && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                {screenWidth() < 990 && <th>Action</th>}
                <th>Order ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Request</th>
                <th>Order Date</th>
                <th>Completed</th>
                <th>Status</th>
                {screenWidth() > 990 && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr className="order-item" key={o.id}>
                  {screenWidth() < 990 && (
                    <td>
                      <Popover placement="left" usePortal={true}>
                        <PopoverTrigger>
                          <Button
                            size="xs"
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
                                color="white"
                                background="red"
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
                            Ensure the product is readily available before
                            accepting
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </td>
                  )}
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
                  {screenWidth() > 990 && (
                    <td>
                      <Popover placement="left" usePortal={true}>
                        <PopoverTrigger>
                          <Button
                            size="xs"
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
                                color="white"
                                background="red"
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
                            Ensure the product is readily available before
                            accepting
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
          text-align: center;
          background-color: #f2f2f2;
        }
        td {
          font-size: 0.8rem;
          text-align: center;
          padding: 5px 0;
        }
        .name {
          display: flex;
        }
        @media only screen and (min-width: 700px) {
          td {
            padding: 5px 10px;
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
