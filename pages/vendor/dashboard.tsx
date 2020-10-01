import React, { useEffect } from "react";
import Link from "next/link";
import { useToken } from "../../Context/TokenProvider";
import { ProtectRouteV } from "../../utils/ProtectedRouteV";
import { Navigation } from "../../components/vendor/Navigation";
import Head from "next/head";
import { OrdersComponent } from "./../../components/vendor/OrdersComponent";
import { Button, Icon } from "@chakra-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  IOrderInitialState,
  ordersThunk,
} from "../../redux/features/orders/fetchOrders";
import { useUser } from "../../Context/UserProvider";

interface DefaultOrderState {
  orders: IOrderInitialState;
}

export const Dashboard: React.FC = () => {
  const { User } = useUser();
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
  const pending = orders.filter(
    (c) => c.completed === "false" && c.canceled === "false"
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
                  <Icon name="check-circle" color="blue" />
                </div>
                <h2>{orders.length}</h2>
                <p>Total Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon name="unlock" color="green" />
                </div>
                <h2>{pending.length}</h2>
                <p>Pending Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon color="yellow" name="star" />
                </div>
                <hr />
                <h2>{completed.length}</h2>
                <p>Completed Orders</p>
              </div>

              <div className="order-status_item">
                <div className="icon">
                  <Icon name="not-allowed" />
                </div>
                <h2>{canceled.length}</h2>
                <p>Canceled Orders</p>
              </div>
            </div>
          </div>

          <div className="account-snippet">
            <h1>
              Account Information{" "}
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
          </div>
          <div className="recent-orders">
            <div className="recent-orders_wrap">
              <h1>Recent Orders</h1>
              <Button
                size="sm"
                style={{ background: "var(--deepblue)", color: "white" }}
              >
                <Link href="/vendor/orders">
                  <a>Full List</a>
                </Link>
              </Button>
            </div>
            {/* ORDERS COMPONENT  */}
            <div className="orders">
              <OrdersComponent limit={5} />
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default ProtectRouteV(Dashboard);
