import { List, ListItem, Skeleton, Text } from "@chakra-ui/core";
import Head from "next/head";
import { useEffect } from "react";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { Layout } from "@/components/Layout";
import { useToken } from "@/Context/TokenProvider";
import { getCustomerOrders } from "@/graphql/customer";
import { ProtectRouteC } from "@/utils/ProtectedRouteC";
import queryFunc from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { OrderPage } from "@/components/customer/OrderPage";

export const CustomerOrders = () => {
  const { Token } = useToken();

  //using SWR to fetch data
  const { data } = useSWR(`getCustomerOrders`, () =>
    queryFunc(getCustomerOrders, {}, Token)
  );

  //refetch when token loads
  useEffect(() => {
    mutate(`getCustomerOrders`);
  }, [Token]);

  //Lookup helper to map order_id to order(s). {8219681236: [{order}, {order}], 8219681236: [{another order}]}

  //makes it easy to handle multiple orders sharing the same order_id and easily look them up

  const lookup = data
    ? data.getCustomerOrders.reduce((acc, row) => {
        if (!(row.order_id in acc)) {
          acc[row.order_id] = [];
        }
        acc[row.order_id].push(row);
        return acc;
      }, {})
    : {};

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
              * <strong>In Transit</strong> signifies that your Order is on its
              way!
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

        {/* Loading screen  */}
        {!data && (
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

        {data && data.getCustomerOrders.length === 0 ? (
          <Text as="div" textAlign="center">
            You Have No Orders...
          </Text>
        ) : null}

        {data && data.getCustomerOrders.length > 0 && (
          <OrderPage lookup={lookup} Token={Token} />
        )}
      </main>
      <PurchaseSteps />
      <style jsx>{`
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

        @media only screen and (min-width: 700px) {
          .customer-orders {
            margin: auto;
            width: 80%;
          }
          .order-status {
            font-size: 1rem;
          }
        }
        @media only screen and (min-width: 1000px) {
          .order-status {
            margin: 30px 0;
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
