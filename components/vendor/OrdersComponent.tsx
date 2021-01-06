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
  Text,
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
                {screenWidth() < 990 && <th>More</th>}
                <th>Order ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Request</th>
                <th>Order Date</th>
                <th>Status</th>
                {screenWidth() > 990 && <th>More</th>}
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr className="order-item" key={o.order_id}>
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
                            More
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent zIndex={4}>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Order ID: {o.order_id}</PopoverHeader>
                          <PopoverBody>
                            <Button
                              color="var(--deepblue)"
                              isDisabled={
                                o.orderStatus.delivered === "true" &&
                                o.orderStatus.canceled === "true"
                                  ? true
                                  : false
                              }
                              // onClick={() =>
                              //   router.push(
                              //     `/customer?returnId=${lookup[o][0].orderStatus.order_id}`
                              //   )
                              // }
                            >
                              Contact
                            </Button>
                          </PopoverBody>
                          <PopoverFooter fontSize="0.7rem">
                            Ensure your products are always readily available
                            {o.orderStatus.delivered === "true" &&
                            o.orderStatus.delivery_date
                              ? `| Delivered: ${toDate(
                                  o.orderStatus.delivery_date
                                )}`
                              : ""}
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </td>
                  )}
                  <td style={{ display: "flex" }}>
                    {/* display "*" if order hasn't been delivered */}
                    <span
                      style={{
                        color: "red",
                        display:
                          o.orderStatus.canceled === "false" &&
                          o.orderStatus.delivered === "false" &&
                          o.orderStatus.in_transit === "false"
                            ? "block"
                            : "none",
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
                  <td>
                    {/* Canceled status  */}
                    {o.orderStatus.canceled === "true" ? "Cancelled" : ""}

                    {/* processing  */}
                    {o.orderStatus.delivered === "false" &&
                    o.orderStatus.in_transit === "false" &&
                    o.orderStatus.canceled === "false"
                      ? "Processing"
                      : ""}

                    {/* delivered shows "delivered", else in transit */}
                    {o.orderStatus.delivered === "true"
                      ? "delivered"
                      : o.orderStatus.in_transit === "true"
                      ? "In Transit"
                      : ""}
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
                            <div>
                              <Button
                                color="var(--deepblue)"
                                isDisabled={
                                  o.orderStatus.delivered === "true" &&
                                  o.orderStatus.canceled === "true"
                                    ? true
                                    : false
                                }
                                // onClick={() =>
                                //   router.push(
                                //     `/customer?returnId=${lookup[o][0].orderStatus.order_id}`
                                //   )
                                // }
                              >
                                Contact
                              </Button>
                            </div>
                          </PopoverBody>
                          <PopoverFooter fontSize="0.7rem">
                            Ensure your products are always readily available
                            {o.orderStatus.delivered === "true" &&
                            o.orderStatus.delivery_date
                              ? `| Delivered: ${toDate(
                                  o.orderStatus.delivery_date
                                )}`
                              : ""}
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
