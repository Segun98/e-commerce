import {
  Button,
  Skeleton,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Text,
} from "@chakra-ui/core";
import { useEffect } from "react";
import { useToken } from "@/Context/TokenProvider";
import { Commas, truncate } from "@/utils/helpers";
import { getVendorOrders } from "@/graphql/vendor";
import { Orders } from "@/Typescript/types";
import { useMutation } from "@/utils/useMutation";
import { ordersThunk } from "@/redux/features/orders/fetchOrders";
import { useDispatch } from "react-redux";
import { gql } from "graphql-request";
import useSWR, { mutate } from "swr";
import queryFunc from "@/utils/fetcher";

//Recent Orders displayed in /vendor/dashboard.
export const DashboardOrders = () => {
  const { Token } = useToken();
  const toast = useToast();
  const dispatch = useDispatch();

  //using SWR to fetch data
  const { data, error } = useSWR(`getVendorOrders`, () =>
    queryFunc(getVendorOrders, { limit: 5 }, Token)
  );

  //refetch when token loads
  useEffect(() => {
    mutate(`getVendorOrders`);
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
        //causes useQuery to refetch and store to update
        mutate(`getVendorOrders`);

        //dispatching to update central redux store, to update the dashboard metrics
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
          status: "error",
          position: "top",
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
      
      Subtotal: ${Commas(subtotal)}
      `
    );
    if (answer) {
      const { data, error } = await useMutation(
        cancelOrder,
        { id, cancel_reason: answer },
        Token
      );
      if (data) {
        mutate(`getVendorOrders`);

        //dispatching to update central redux store, to update the dashboard metrics
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
          status: "error",
          position: "top",
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
    <div className="orders-table">
      {!data && !error && (
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
      {error &&
        "error Fetching Your Orders, Check your internet connection and refresh"}
      {data && (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Req</th>
              <th>Action</th>
            </tr>
          </thead>
          {data.getVendorOrders.length === 0 ? "You Have No Orders..." : null}
          <tbody>
            {data.getVendorOrders.map((o: Orders) => (
              <tr key={o.id}>
                <td className="name">
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
                  <span>{o.name} </span>
                </td>
                <td>{Commas(o.price)}</td>
                <td>{o.quantity}</td>
                <td>{Commas(o.subtotal)}</td>
                <td>{truncate(o.request, 60) || "none"}</td>
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
                      <PopoverHeader>
                        <Text as="span">
                          Order ID:{" "}
                          <Text as="span" color="var(--deepblue)">
                            {o.order_id}
                          </Text>
                          <Text as="span" padding="0 12px">
                            |
                          </Text>
                          <Text as="span" color="var(--deepblue)">
                            {toDate(o.created_at)}
                          </Text>
                        </Text>
                      </PopoverHeader>
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
                        Ensure the product is readily available before accepting
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        table {
          border-spacing: 5px;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        td:nth-child(4) {
          color: var(--deepblue);
          font-weight: bold;
        }
        th {
          font-size: 0.8rem;
          background-color: #f2f2f2;
          text-align: center;
        }
        td {
          font-size: 0.8rem;
          padding: 5px 0;
          text-align: center;
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

        @media only screen and (min-width: 1700px) {
          .orders-table {
            width: 70%;
          }
        }
      `}</style>
    </div>
  );
};
