import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { Orders } from "../../Typescript/types";
import { graphQLClient } from "../../utils/client";

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
  const { Token } = useAuth();

  const [data, setData] = useState<Array<Orders>>([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState();

  useEffect(() => {
    getOrders();
  }, [Token]);

  async function getOrders() {
    try {
      setLoading(true);
      graphQLClient.setHeader("authorization", `bearer ${Token}`);

      const res = await graphQLClient.request(getVendorOrders);
      const data = res.getVendorOrders;
      if (data) {
        setData(data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err.message);
      setLoading(false);
      console.log(err.response?.errors[0].message);
    }
  }

  function toDate(d) {
    let date = new Date(parseInt(d));
    return date.toLocaleString();
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <main>
        {data &&
          data.map((d) => (
            <div key={d.id}>
              <div>{d.name}</div>
              <div>{d.price}</div>
              <div>{d.quantity}</div>
              <div>{d.completed}</div>
              <div>{d.canceled}</div>
              <div>{d.customer_email}</div>
              <div>{toDate(d.created_at)}</div>
            </div>
          ))}
      </main>
    </div>
  );
};

export default Dashboard;
