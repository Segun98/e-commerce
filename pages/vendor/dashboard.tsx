import React from "react";
import { useToken } from "../../Context/TokenProvider";
import { Orders } from "../../Typescript/types";
import Link from "next/link";
import { UserProvider } from "./../../Context/UserProvider";
import { ShowUser } from "../../components/ShowUser";
import { useQuery } from "./../../components/useQuery";

const getVendorOrders = `
query getVendorOrders{
  getVendorOrders{
    id
    name
    price
    quantity
    description
    completed
    canceled
    customer_email
    created_at
  }
}
`;

export const Dashboard: React.FC = () => {
  const { Token } = useToken();

  const [data, loading, error] = useQuery(getVendorOrders, {}, Token);

  const res = data ? data.getVendorOrders : undefined;

  function toDate(d) {
    let date = new Date(parseInt(d));
    return date.toLocaleString();
  }
  return (
    <UserProvider>
      <div>
        <h1>Dashboard</h1>
        <ShowUser />
        {error && "en error occured"}
        <br />
        {loading && "loading..."}
        <br />
        <p>{!loading && res && res.length === 0 && "you have no orders"}</p>
        <main>
          {res &&
            res.map((d: Orders) => (
              <div key={d.id}>
                <div>{d.name}</div>
                <div>{d.price}</div>
                <div>{d.quantity}</div>
                <div>{d.completed}</div>
                <div>{d.canceled}</div>
                <div>{d.customer_email}</div>
                <div>{toDate(d.created_at)}</div>
                <br />
              </div>
            ))}
        </main>
      </div>
    </UserProvider>
  );
};

export default Dashboard;
