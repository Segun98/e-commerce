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
                an Order, Please take action.
              </ListItem>
              <ListItem mt="2" mb="2">
                * <strong>Cancelled</strong> signifies that You or a customer
                has cancelled the order. Note: You cannnot cancel after you have
                accepted an Order
              </ListItem>
              <ListItem>
                * <strong>Delivered</strong> (under 'Completed' column)
                signifies that Your Item Has Been delivered to your customer
                else you see 'NO'
              </ListItem>
            </List>
          </div>
          <h1>All Orders</h1>
          <p
            style={{
              fontSize: "0.8rem",
            }}
          >
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
          font-size: 0.9rem;
          margin: 45px 0 30px 0;
          box-shadow: var(--box) var(--softgrey);
          padding: 5px;
          border-radius: 8px;
        }

        .order-status strong {
          color: var(--deepblue);
        }

        .orders-page h1 {
          margin: 10px 0 10px 0;
          color: var(--deepblue);
          font-weight: bold;
          font-size: 0.9rem;
        }

        .orders-layout main {
          margin: 0 auto;
          width: 90%;
        }

        @media only screen and (min-width: 700px) {
          .order-status {
            font-size: 1rem;
          }
          .orders-layout main {
            margin: 0 auto;
            width: 60%;
          }
        }

        @media only screen and (min-width: 1200px) {
          .order-status {
            padding: 10px;
          }

          .orders-layout main {
            width: 70%;
            margin-top: 20px;
          }
          .orders-page h1 {
            font-size: 1.2rem;
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
