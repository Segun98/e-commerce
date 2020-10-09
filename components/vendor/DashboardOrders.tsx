import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
} from "@chakra-ui/core";
import React from "react";
import { useToken } from "../../Context/TokenProvider";
import { Commas, truncate } from "../../utils/helpers";
import { useQuery } from "./../useQuery";
import { getVendorOrders } from "./../../graphql/vendor";
import { Orders } from "../../Typescript/types";

//Recent Orders displayed in dashboard. was created specifically for mobile screens
export const DashboardOrders = () => {
  const { Token } = useToken();

  const [data, loading] = useQuery(getVendorOrders, { limit: 5 }, Token);
  let orders = data && data.getVendorOrders;

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
        td {
          font-size: 0.9rem;
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
          }
        }
      `}</style>
    </div>
  );
};
