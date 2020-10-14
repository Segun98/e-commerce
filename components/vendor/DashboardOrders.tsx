import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  useToast,
} from "@chakra-ui/core";
import React, { useState } from "react";
import { useToken } from "../../Context/TokenProvider";
import { Commas, truncate } from "../../utils/helpers";
import { useQuery } from "./../useQuery";
import { getVendorOrders } from "./../../graphql/vendor";
import { Orders } from "../../Typescript/types";
import { useMutation } from "../../utils/useMutation";
import { ordersThunk } from "../../redux/features/orders/fetchOrders";
import { useDispatch } from "react-redux";

//Recent Orders displayed in /vendor/dashboard.
export const DashboardOrders = () => {
  const { Token } = useToken();
  const toast = useToast();
  const dispatch = useDispatch();
  //point is to cause custome hook useQuery to refecth after i cancel or complete an order
  const [FakeDependency, setFakeDependency] = useState(false);
  const [data, loading, error] = useQuery(
    getVendorOrders,
    { limit: 5 },
    Token,
    FakeDependency
  );
  let orders = data && data.getVendorOrders;

  //accept order
  async function handleOrderAccept(id) {
    const acceptOrder = `
    mutation acceptOrder($id:ID!){
      acceptOrder(id:$id){
        message
      }
    }
    `;
    if (
      window.confirm(`Are you sure you want to Accept this Order? 
      
      *Note: Accepting an order means the product is READILY AVAILABLE. Expect a dispatch rider soon.`)
    ) {
      const { data, error } = await useMutation(acceptOrder, { id }, Token);
      if (data) {
        //causes useQuery to refecth and store to update
        setFakeDependency(!FakeDependency);
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
  async function handleOrderCancel(id) {
    const cancelOrder = `
    mutation cancelOrder($id:ID!){
      cancelOrder(id:$id){
        message
      }
    }
    `;
    const { data, error } = await useMutation(cancelOrder, { id }, Token);
    if (data) {
      setFakeDependency(!FakeDependency);
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
        {!loading && data && orders.length === 0
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
            </tr>
          )}
          {!loading &&
            !error &&
            data &&
            orders.map((o: Orders, i) => (
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
                  <span>{o.name}</span>
                  <span style={{ color: "var(--deepblue)" }}>
                    {toDate(o.created_at)}
                  </span>
                </td>
                <td>{Commas(o.price)}</td>
                <td>{o.quantity}</td>
                <td>{Commas(o.subtotal)}</td>
                <td>{truncate(o.request) || "none"}</td>
                <td>
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
                        color="var(--deepblue)"
                        isDisabled={
                          o.accepted === "true" || o.canceled === "true"
                            ? true
                            : false
                        }
                        onClick={() => handleOrderAccept(o.id)}
                      >
                        Accept
                      </MenuItem>
                      <MenuItem
                        color="var(--deepblue)"
                        isDisabled={
                          o.accepted === "true" || o.canceled === "true"
                            ? true
                            : false
                        }
                        onClick={() => handleOrderCancel(o.id)}
                      >
                        Cancel
                      </MenuItem>
                    </MenuList>
                  </Menu>
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
        td:nth-child(4) {
          color: var(--deepblue);
          font-weight: bold;
        }
        th {
          font-size: 0.8rem;
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

        @media only screen and (min-width: 1700px) {
          .orders-table {
            width: 70%;
          }
        }
      `}</style>
    </div>
  );
};
