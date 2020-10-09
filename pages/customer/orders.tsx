import {
  Button,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
} from "@chakra-ui/core";
import React from "react";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";
import { Layout } from "../../components/Layout";
import { useQuery } from "../../components/useQuery";
import { useToken } from "../../Context/TokenProvider";
import { getCustomerOrders } from "../../graphql/customer";
import { Orders } from "../../Typescript/types";
import { Commas } from "../../utils/helpers";
import { ProtectRouteC } from "./../../utils/ProtectedRouteC";

export const CustomerOrders = () => {
  const { Token } = useToken();

  const [data, loading] = useQuery(getCustomerOrders, {}, Token);
  let orders = data && data.getCustomerOrders;

  //Parse Date
  function toDate(d) {
    let date = new Date(parseInt(d));
    let format = new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
    }).format(date);

    return format || date.toLocaleString();
  }

  return (
    <Layout>
      <main className="customer-orders">
        <div className="order-status">
          <List>
            <ListItem>
              * <strong>Processing</strong> signifies that your Order is being
              processed. It is either being Shipped or Has been Acknowledged
            </ListItem>
            <ListItem>
              * <strong>Cancelled</strong> signifies that Your Item has been
              cancelled by you or our vendor. Note: You cannnot cancel when our
              vendor has accepted your Order
            </ListItem>
            <ListItem>
              * <strong>Delivered</strong> signifies that Your Item Has Been
              delivered and accepted by You
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
          <tbody>
            {!loading && data && orders.length === 0
              ? "You Have No Orders..."
              : null}
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
                        >
                          Cancel
                        </MenuItem>
                        <MenuItem color="var(--deepblue)" isDisabled={true}>
                          Return
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
