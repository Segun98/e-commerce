import React, { useEffect } from "react";
import Link from "next/link";
import { useToken } from "../../Context/TokenProvider";
import { ProtectRouteV } from "../../utils/ProtectedRouteV";
import { Navigation } from "../../components/vendor/Navigation";
import Head from "next/head";
import { Button, Icon } from "@chakra-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  IOrderInitialState,
  ordersThunk,
} from "../../redux/features/orders/fetchOrders";
import { DashboardOrders } from "../../components/vendor/DashboardOrders";
import { Chart } from "../../components/vendor/Chart";
import { Commas } from "../../utils/helpers";

interface DefaultOrderState {
  orders: IOrderInitialState;
}

export const Dashboard: React.FC = () => {
  // Redux stuff
  const dispatch = useDispatch();

  const { orders } = useSelector<DefaultOrderState, IOrderInitialState>(
    (state) => state.orders
  );

  //Token from context
  const { Token } = useToken();

  useEffect(() => {
    if (Token) {
      dispatch(ordersThunk(Token, { limit: null }));
    }
  }, [Token]);

  //Order Status
  const completed = orders.filter((c) => c.completed === "true");

  //Getting Revenue
  const subtotal = completed.map((c) => c.subtotal);
  //ensure subtotal has run before reducing
  const revenue = subtotal.length > 0 ? subtotal.reduce((a, c) => a + c) : 0;

  const pending = orders.filter(
    (c) => c.accepted === "false" && c.canceled === "false"
  );
  const canceled = orders.filter((c) => c.canceled === "true"); // order.length - completed.length - pending.length

  return (
    <div className="dashboard">
      <Head>
        <title>Dashboard | Vendor | PartyStore</title>
      </Head>
      <section className="dashboard_layout">
        <div>
          <Navigation />
        </div>
        <main>
          <div className="headline-wrap">
            <h1 className="headline"> Your Dashboard</h1>
            <Button
              size="sm"
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
                <h2>{orders.length}</h2>
                <p>Total Orders</p>
              </div>

              <div className="order-status_item">
                <div
                  className="icon"
                  style={{
                    color: "#41C7BF",
                    // fontSize: "30px",
                    fontWeight: "bolder",
                  }}
                >
                  {/* &#42; */}
                  <Icon name="triangle-up" color="#41C7BF" size="30px" />
                </div>
                <h2>{pending.length}</h2>
                <p>Pending Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon name="check-circle" color="#32CD32" size="30px" />
                </div>
                <hr />
                <h2>{completed.length}</h2>
                <p>Completed Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon
                    name="not-allowed"
                    style={{ color: "red" }}
                    size="30px"
                  />
                </div>
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
                <h2>&#8358; {Commas(revenue)}</h2>
                <p>Revenue</p>
              </div>
            </div>
            <div className="dashboard_chart">
              <Chart orders={orders} />
            </div>
          </div>

          {/* <div className="account-snippet">
            <h1>
              Account Information{"  "}
              <Link href="/vendor/account">
                <a>
                  <Icon name="edit" />
                </a>
              </Link>
            </h1>

            <div className="account-infos">
              <div className="account-info">
                <h2>Email</h2>
                <hr />
                <p>{User.email}</p>
              </div>

              <div className="account-info">
                <h2>Address Book</h2>
                <hr />
                <p>{User.phone || `090 3000 4000 55`}</p>
                <p>
                  {User.business_address || `No5, My Business Address, Lagos.`}
                </p>
              </div>
            </div>
          </div> */}
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
                  Signifies Pending Orders, Please take Action
                </p>
              </div>

              <Button
                size="sm"
                style={{ background: "var(--deepblue)", color: "white" }}
              >
                <Link href="/vendor/orders">
                  <a>Full List</a>
                </Link>
              </Button>
            </div>
            {/* DASHBOARD ORDERS COMPONENT, IT WAS ABSTRACTED FOR MOBILE SCREENS */}
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
