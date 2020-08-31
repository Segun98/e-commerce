import Cookies from "js-cookie";
import { graphQLClient } from "../../utils/client";
// import { ProtectRouteC } from "../../utils/ProtectedRouteC";
import { getCartItems } from "./../../graphql/customer";
import { useEffect } from "react";
import { useAuth } from "./../../Context/AuthProvider";

export async function getServerSideProps({ req }) {
  let c = [];
  //only run if theres a cookie in header
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split("; ");

    //loop to get the exact cookie "ecom"
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].split("=")[0] === "ecom") {
        c.push(cookies[i]);
        break;
      }
    }
    //get the cookie value which is accesstoken
    if (c[0]) {
      var cookie = c[0].split("=")[1];
    }
  }

  try {
    graphQLClient.setHeader("authorization", `bearer ${cookie}`);

    const res = await graphQLClient.request(getCartItems);
    const data = await res.getCartItems;

    return {
      props: {
        data,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err?.message,
      },
    };
  }
}

export const Account = ({ data, error }) => {
  const { Token } = useAuth();
  useEffect(() => {
    async function fetcho() {
      try {
        // graphQLClient.setHeader("authorization", `bearer ${Token}`);

        const res = await graphQLClient.request(getCartItems);
        const data = await res.getCartItems;
        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    if (Token) {
      fetcho();
    }
  }, [Token]);

  let role = Cookies.get("role");

  if (role !== "customer") {
    return "Redirecting...";
  }
  return <div>customer account</div>;
};
export default Account;
