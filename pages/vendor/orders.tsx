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
          <h1>All Orders</h1>
          <OrdersComponent limit={null} />
        </main>
      </div>

      <style jsx>{`
        .orders-page h1 {
          margin: 10px 0 10px 0;
          color: var(--deepblue);
          font-weight: bold;
          font-size: 1.2rem;
        }
        .orders-layout {
          display: flex;
        }

        .orders-layout main {
          margin: 0 auto;
          width: 76%;
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
