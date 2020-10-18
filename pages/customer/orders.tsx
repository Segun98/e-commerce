import {
  Button,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  useToast,
} from "@chakra-ui/core";
import Head from "next/head";
import React, { useState } from "react";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";
import { Layout } from "../../components/Layout";
import { useQuery } from "../../components/useQuery";
import { useToken } from "../../Context/TokenProvider";
import { getCustomerOrders } from "../../graphql/customer";
import { Orders } from "../../Typescript/types";
import { Commas } from "../../utils/helpers";
import { useMutation } from "../../utils/useMutation";
import { ProtectRouteC } from "./../../utils/ProtectedRouteC";

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
        setFakeDependency(!FakeDependency);
        toast({
          title: "Order Has Been Cancelled",
          status: "info",
        });
      }
      if (error) {
        let msg = error.response.errors[0].message || error.message;
        toast({
          title: "Error Cancelling Order",
          description: msg,
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
    <Layout>
      <Head>
        <title>Orders | Customer | PartyStore</title>
      </Head>
      <main className="customer-orders">
        <div className="order-status">
          <List>
            <ListItem>
              * <strong>Processing</strong> signifies that your Order is being
              processed. It is either being Shipped or Has been Acknowledged
            </ListItem>
            <ListItem>
              * <strong>Cancelled</strong> signifies that Your Item has been
              cancelled by you or our vendor. Note: You cannnot cancel when
              order is being shipped.
            </ListItem>
            <ListItem>
              * <strong>Delivered</strong> signifies that Your Item Has Been
              delivered and accepted by You
            </ListItem>
            <ListItem>
              * Please Click <strong>Action</strong> to find your{" "}
              <strong>Order ID</strong>
            </ListItem>
          </List>
        </div>
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
          {!loading && data && orders.length === 0
            ? "You Have No Orders..."
            : null}
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
              </tr>
            )}
            {!loading &&
              data &&
              orders.map((o: Orders, i) => (
                <tr key={o.id}>
                  <td>
                    {o.name} -
                    <span style={{ color: "var(--deepblue)" }}>
                      {toDate(o.created_at)}
                    </span>
                  </td>
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
                          ? "Processing"
                          : o.canceled === "true"
                          ? "Cancelled"
                          : "Processing"}
                      </div>
                    )}
                  </td>
                  <td>
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="xs"
                        rightIcon="chevron-down"
                        style={{
                          background: "var(--deepblue)",
                          color: "white",
                        }}
                      >
                        Actions
                      </MenuButton>
                      <MenuList placement="left-start">
                        <MenuItem
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
                        </MenuItem>
                        <MenuItem color="var(--deepblue)" isDisabled={true}>
                          Return
                        </MenuItem>
                        <MenuItem color="var(--deepblue)">
                          Order ID: {o.order_id}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
          margin: 25px 0;
        }

        @media only screen and (min-width: 700px) {
          .customer-orders {
            margin: auto;
            width: 80%;
          }
          td {
            padding: 0 10px;
          }
        }
        @media only screen and (min-width: 1000px) {
          .order-status {
            margin: 30px 0;
          }
          td {
            padding: 10px 10px;
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
