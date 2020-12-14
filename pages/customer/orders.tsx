import {
  Button,
  List,
  ListItem,
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
import Head from "next/head";
import React, { useState } from "react";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { Layout } from "@/components/Layout";
import { useQuery } from "@/components/useQuery";
import { useToken } from "@/Context/TokenProvider";
import { getCustomerOrders } from "@/graphql/customer";
import { Orders } from "@/Typescript/types";
import { Commas, differenceBetweenDates, formatDate } from "@/utils/helpers";
import { useMutation } from "@/utils/useMutation";
import { ProtectRouteC } from "@/utils/ProtectedRouteC";
import { gql } from "graphql-request";

export const CustomerOrders = () => {
  const { Token } = useToken();
  const toast = useToast();
  //point is to cause custome hook useQuery to refecth after i cancel or complete an order
  const [FakeDependency, setFakeDependency] = useState(false);
  const [data, loading] = useQuery(
    getCustomerOrders,
    {},
    Token,
    FakeDependency
  );
  let orders = data && data.getCustomerOrders;

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
        setFakeDependency(!FakeDependency);
        toast({
          title: "Order Has Been Cancelled",
          status: "info",
          position: "top",
        });
      }
      if (error) {
        let msg = error.response.errors[0].message || error.message;
        toast({
          title: "Error Cancelling Order",
          description: msg,
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

  //disable order return button if after 3 days of order reciept
  function disableReturnOrder(date) {
    //if no delivery date (order is most likely still in transit or was canceled before delivery)
    if (!date) {
      return true;
    }

    let day = differenceBetweenDates(date);

    if (day > 7) {
      return true;
    }
    return false;
  }

  return (
    <Layout>
      <Head>
        <title>Orders | Customer | PartyStore</title>
      </Head>
      <main className="customer-orders">
        <div className="order-status">
          <List>
            <ListItem>
              * <strong>Processing</strong> signifies that your Order is being
              processed. It has been acknowledged
            </ListItem>
            <ListItem>
              * <strong>Cancelled</strong> signifies that your item has been
              cancelled by you or our vendor.
            </ListItem>
            <ListItem>
              * <strong>Delivered</strong> signifies that your item has been
              delivered and accepted by you
            </ListItem>
          </List>
        </div>

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

        {!loading && data && (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            {orders.length === 0 ? "You Have No Orders..." : null}
            <tbody>
              {orders.map((o: Orders, i) => (
                <tr key={o.id}>
                  <td>{o.name}</td>
                  <td>{Commas(o.price)}</td>
                  <td>{o.quantity}</td>
                  <td>{Commas(o.subtotal)}</td>
                  <td>
                    {/* if order is completed return "Delivered" */}
                    {o.completed === "true" && "Delivered"}
                    {/* else run this logic- if accepted is true return "Processing" else if Cancelled is true return "Canceled" else return processing */}
                    {o.completed === "false" && (
                      <div>
                        {o.accepted === "true"
                          ? "Being shipped"
                          : o.canceled === "true"
                          ? "Cancelled"
                          : "Processing"}
                      </div>
                    )}
                  </td>
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
                              background="red"
                              color="white"
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
                            <Button
                              color="var(--deepblue)"
                              isDisabled={
                                disableReturnOrder(o.delivery_date) ||
                                o.canceled === "true"
                              }
                            >
                              Return
                            </Button>
                          </div>
                        </PopoverBody>
                        <PopoverFooter fontSize="0.7rem">
                          Orders are fulfilled within 2-4 days of placement
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <PurchaseSteps />
      <style jsx>{`
        table {
          border-spacing: 5px;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .customer-orders {
          margin: auto;
          width: 95%;
        }
        .order-status {
          font-size: 0.9rem;
          margin: 25px 0;
          box-shadow: var(--box) var(--softgrey);
          padding: 5px;
          border-radius: 8px;
        }

        .order-status strong {
          color: var(--deepblue);
        }

        th {
          text-align: center;
          font-size: 0.8rem;
        }
        td {
          text-align: center;
          font-size: 0.8rem;
        }

        @media only screen and (min-width: 700px) {
          .customer-orders {
            margin: auto;
            width: 80%;
          }
          .order-status {
            font-size: 1rem;
          }
          td {
            padding: 5px 10px;
          }
        }
        @media only screen and (min-width: 1000px) {
          .order-status {
            margin: 30px 0;
          }
          th {
            font-size: 1rem;
          }
          td {
            padding: 10px 10px;
            font-size: 1rem;
          }
        }

        @media only screen and (min-width: 1400px) {
          .customer-orders {
            width: 70%;
          }
          .order-status {
            margin: 40px 0;
          }
        }
        @media only screen and (min-width: 1800px) {
          .customer-orders {
            width: 60%;
          }
          .order-status {
            margin: 50px 0;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ProtectRouteC(CustomerOrders);
