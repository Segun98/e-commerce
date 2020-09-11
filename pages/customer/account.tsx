import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useToken } from "../../Context/TokenProvider";
import { CustomerCart } from "../../components/customer/Cart";
import { ShowUser } from "../../components/ShowUser";
import { UserProvider } from "../../Context/UserProvider";

export const Account = () => {
  const { Token } = useToken();
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
