import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useAuth } from "./../../Context/AuthProvider";
import { CustomerCart } from "../../components/customer/Cart";
import { ShowUser } from "../../components/ShowUser";
import { UserProvider } from "../../Context/UserProvider";

export const Account = () => {
  const { Token } = useAuth();
  // let role = Cookies.get("role");

  // if (role !== "customer") {
  //   return "Redirecting...";
  // }
  return (
    <UserProvider>
      <div>
        <main>
          <ShowUser />
          <CustomerCart Token={Token} />
        </main>
      </div>
    </UserProvider>
  );
};
export default Account;
