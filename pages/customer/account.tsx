import { useToken } from "../../Context/TokenProvider";
import { ShowUser } from "../../components/ShowUser";
import { UserProvider } from "../../Context/UserProvider";
import { Layout } from "../../components/Layout";
import React from "react";
import { Button } from "@chakra-ui/core";
import Cookies from "js-cookie";
import Link from "next/link";

export const Account = () => {
  const { Token } = useToken();
  const role = Cookies && Cookies.get("role");

  return (
    <UserProvider>
      <Layout>
        {!Token && !role && (
          <div className="indicator">
            <div>
              <strong>Looks Like You're Not Logged in</strong>
              <br />
              <div style={{ textAlign: "center" }}>
                <Button variantColor="blue">
                  <Link href="/customer/login">
                    <a>LogIn</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* vendors trying to access this Page  */}
        {Token && role === "vendor" && (
          <div className="indicator">
            <div>
              <strong>
                This Page is Unauthorised For Vendors, Login as a Customer or
                Visit Your Dashboard{" "}
              </strong>
              <br />
              <div style={{ textAlign: "center" }}>
                <Button variantColor="blue">
                  <Link href="/vendor/dashboard">
                    <a>Dashboard</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        <main>{Token ? <ShowUser /> : ""}</main>
      </Layout>
    </UserProvider>
  );
};
export default Account;
