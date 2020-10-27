import { List, ListItem } from "@chakra-ui/core";
import Head from "next/head";
import React from "react";
import { Navigation } from "../../components/vendor/Navigation";
import { OrdersComponent } from "../../components/vendor/OrdersComponent";
import { ProtectRouteV } from "./../../utils/ProtectedRouteV";

export const Orders = () => {
  return (
    <div className="orders-page">
      <Head>
        <title>Orders | Vendor | PartyStore</title>
      </Head>
      <div className="orders-layout">
        <Navigation />
        <main>
          <div className="order-status">
            <List>
              <ListItem>
                * <strong>Pending</strong> signifies that you have NOT ACCEPTED
                an Order
              </ListItem>
              <ListItem>
                * <strong>Cancelled</strong> signifies that You or a customer
                has cancelled the order. Note: You cannnot cancel after you have
                accepted an Order
              </ListItem>
              <ListItem>
                * <strong>Delivered</strong> signifies that Your Item Has Been
                delivered to your customer else you see NO under "Completed"
                column
              </ListItem>
            </List>
          </div>
          <h1>All Orders</h1>
          <p>
            <span
              style={{
                color: "red",
              }}
            >
              "*"
            </span>{" "}
            Signifies Pending Orders, Please take Action
          </p>
          <OrdersComponent limit={null} />
        </main>
      </div>

      <style jsx>{`
        .orders-layout {
          display: flex;
        }
        .order-status {
          margin: 30px 0;
        }
        .orders-page h1 {
          margin: 10px 0 10px 0;
          color: var(--deepblue);
          font-weight: bold;
          font-size: 1.2rem;
        }

        .orders-layout main {
          margin: 0 auto;
          width: 90%;
        }

        @media only screen and (min-width: 700px) {
          .orders-layout main {
            margin: 0 auto;
            width: 60%;
          }
        }

        @media only screen and (min-width: 1200px) {
          .orders-layout main {
            width: 70%;
            margin-top: 20px;
          }
        }
        @media only screen and (min-width: 1900px) {
          .orders-layout main {
            width: 80%;
          }
        }
        @media only screen and (min-width: 2200px) {
          .orders-layout main {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Orders);
