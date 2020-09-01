import Cookies from "js-cookie";
import { graphQLClient } from "../../utils/client";
import { getCartItems } from "../../graphql/customer";
import { useEffect, useState } from "react";
import { useAuth } from "./../../Context/AuthProvider";

export const Account = () => {
  const { Token } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState();

  useEffect(() => {
    if (Token) {
      fetchCartItems();
    }
  }, [Token]);

  async function fetchCartItems() {
    try {
      setLoading(true);
      graphQLClient.setHeader("authorization", `bearer ${Token}`);

      const res = await graphQLClient.request(getCartItems);
      const data = await res.getCartItems;
      setData(data);
    } catch (err) {
      // console.log(err.message);
      console.log(err.response?.errors[0].message);
    }
  }
  console.log(data);

  let role = Cookies.get("role");

  if (role !== "customer") {
    return "Redirecting...";
  }
  return (
    <div>
      <main>
        {data &&
          data.map((d) => (
            <div key={d.id}>
              <div>{d.product_id}</div>
              <div>{d.quantity}</div>
              <div>{d.product.price}</div>
              <div>{d.product.name}</div>
              <div>{d.product.description}</div>
              <div>Subtotal - {d.product.price * d.quantity}</div>
              <div>Cart creator </div>
              <div>{d.cartCreator.first_name}</div>
              <div>{d.cartCreator.email}</div>
            </div>
          ))}
      </main>
    </div>
  );
};
export default Account;
