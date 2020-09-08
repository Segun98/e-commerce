import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAuth } from "./../../Context/AuthProvider";
import { Cart } from "../../components/customer_account/Cart";

export const Account = () => {
  const { Token } = useAuth();
  // let role = Cookies.get("role");

  // if (role !== "customer") {
  //   return "Redirecting...";
  // }
  return (
    <div>
      <main>
        <Cart Token={Token} />
      </main>
    </div>
  );
};
export default Account;
