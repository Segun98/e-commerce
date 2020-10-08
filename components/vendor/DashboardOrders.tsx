import { Button, Skeleton } from "@chakra-ui/core";
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
      <div className="order-title">
        <div>Name</div>
        <div>Price</div>
        <div>Qty</div>
        <div>Total</div>
        <div>Request</div>
        <div>Action</div>
      </div>
      {data && orders.length === 0 ? "You Have No Orders..." : null}
      {loading && (
        <section className="skeleton">
          <div>
            <Skeleton height="40px" my="10px" />
          </div>
          <div>
            <Skeleton height="40px" my="10px" />
          </div>
          <div>
            <Skeleton height="40px" my="10px" />
          </div>
          <div>
            <Skeleton height="40px" my="10px" />
          </div>
          <div>
            <Skeleton height="40px" my="10px" />
          </div>
        </section>
      )}
      {data &&
        orders.map((o: Orders, i) => (
          <div className="order-item" key={o.id}>
            <div className="name">{o.name}</div>
            <div className="price">{Commas(o.price)}</div>
            <div className="qty">{o.quantity}</div>
            <div className="total">{Commas(o.subtotal)}</div>
            <div>{truncate(o.request) || "none"}</div>
            <div>
              <Button size="xs" background="var(--deepblue)" color="white">
                Action
              </Button>
            </div>
          </div>
        ))}
      <style jsx>{`
        .orders-table {
          box-shadow: var(--box) var(--softgrey);
          padding: 10px;
          margin-bottom: 50px;
          border-radius: 3px;
        }
        .order-title {
          background: var(--softblue);
          border-radius: 10px;
          padding: 5px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .order-item,
        .order-title {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }

        .order-item {
          margin: 4px 0;
          margin-bottom: 0.6px solid var(--softgrey);
          font-size: 0.8rem;
        }
        .order-item .price,
        .total {
          width: 40px;
          word-wrap: break-word;
        }
        @media only screen and (min-width: 1200px) {
          .order-title {
            font-size: 1rem;
          }
          .order-item {
            font-size: 1rem;
          }
          .order-item .price,
          .total {
            width: 100%;
            word-wrap: none;
          }
        }
        @media only screen and (min-width: 1800px) {
          .order-item,
          .order-title {
            gap: 1px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};
