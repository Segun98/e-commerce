import React, { useEffect } from "react";
import Link from "next/link";
import { useToken } from "@/Context/TokenProvider";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import { Navigation } from "@/components/vendor/Navigation";
import Head from "next/head";
import { Button, Icon, useToast } from "@chakra-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  IOrderInitialState,
  ordersThunk,
} from "@/redux/features/orders/fetchOrders";
import { DashboardOrders } from "@/components/vendor/DashboardOrders";
import { Chart } from "@/components/vendor/Chart";
import { Commas } from "@/utils/helpers";
import { useUser } from "@/Context/UserProvider";

interface DefaultOrderState {
  orders: IOrderInitialState;
}

export const Dashboard: React.FC = () => {
  // Redux stuff
  const dispatch = useDispatch();

  const { orders, error } = useSelector<DefaultOrderState, IOrderInitialState>(
    (state) => state.orders
  );

  const toast = useToast();
  const { User } = useUser();

  //Token from context
  const { Token } = useToken();

  useEffect(() => {
    if (Token) {
      dispatch(ordersThunk(Token, { limit: null }));
    }
  }, [Token]);

  //delivered orders
  const delivered = orders.filter((o) => o.orderStatus.delivered === "true");

  //Getting Revenue
  const subtotal = delivered.map((d) => d.subtotal);

  //ensure subtotal has run before reducing
  const revenue = subtotal.length > 0 ? subtotal.reduce((a, c) => a + c) : 0;

  const pending = orders.filter(
    (o) =>
      o.orderStatus.canceled === "false" &&
      o.orderStatus.delivered === "false" &&
      o.orderStatus.in_transit === "false"
  );

  const canceled = orders.filter((o) => o.orderStatus.canceled === "true");

  useEffect(() => {
    if (orders.length > 0 && pending.length > 0) {
      toast({
        title: "You have New Orders",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [orders]);

  return (
    <div className="dashboard">
      <Head>
        <title>Dashboard | Vendor | PartyStore</title>
      </Head>
      <>
        {error &&
          error === "Network request failed" &&
          toast({
            title: "Network Error",
            description: "Check your internet connection and refresh.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          })}
      </>
      <section className="dashboard_layout">
        <div>
          <Navigation />
        </div>
        <main>
          <div className="headline-wrap">
            {/* <h1 className="headline"> Your Dashboard</h1> */}
            <h1 className="headline">Hi, {User && User.first_name}</h1>
            <Button
              size="xs"
              style={{ background: "var(--deepblue)", color: "white" }}
            >
              <Link href="/store/new-item">
                <a>New Product</a>
              </Link>
            </Button>
          </div>
          <div className="order-status">
            <h1>Order Status</h1>

            <div className="order-status_items">
              <div className="order-status_item">
                <div className="icon">
                  <Icon name="repeat" color="#805AD5" size="30px" />
                </div>
                <hr />
                <h2>{orders.length}</h2>
                <p>Total Orders</p>
              </div>

              <div className="order-status_item">
                <div
                  className="icon"
                  style={{
                    color: "#41C7BF",
                    fontWeight: "bolder",
                  }}
                >
                  {/* &#42; */}
                  <Icon name="triangle-up" color="#41C7BF" size="30px" />
                </div>
                <hr />
                <h2>{pending.length}</h2>
                <p>Pending Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon name="check-circle" color="#32CD32" size="30px" />
                </div>
                <hr />
                <h2>{delivered.length}</h2>
                <p>Delivered Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon
                    name="not-allowed"
                    style={{ color: "red" }}
                    size="30px"
                  />
                </div>
                <hr />
                <h2>{canceled.length}</h2>
                <p>Canceled Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon
                    name="lock"
                    style={{ color: "var(--deepblue)" }}
                    size="30px"
                  />
                </div>
                <hr />
                <h2>&#8358; {Commas(revenue)}</h2>
                <p>Revenue</p>
              </div>
            </div>

            {/* CHART  */}

            <div className="dashboard_chart">
              <Chart orders={orders} />
            </div>
          </div>

          <div className="recent-orders">
            <div className="recent-orders_wrap">
              <div>
                <h1>Recent Orders</h1>
                <p style={{ fontSize: "0.8rem" }}>
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    "*"
                  </span>{" "}
                  Signifies Pending Orders
                </p>
              </div>

              <Button
                size="xs"
                style={{ background: "var(--deepblue)", color: "white" }}
              >
                <Link href="/vendor/orders">
                  <a>Full List</a>
                </Link>
              </Button>
            </div>
            <section>
              <DashboardOrders />
              <br />
              <br />
            </section>
          </div>
        </main>
      </section>
    </div>
  );
};

export default ProtectRouteV(Dashboard);
