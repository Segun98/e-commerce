import React, { useState } from "react";
import Link from "next/link";
import { Button, Icon } from "@chakra-ui/core";
import Cookies from "js-cookie";
import { useUser } from "../../Context/UserProvider";
import { useRouter } from "next/router";
// import axios from "axios";
// import { logoutLink } from "./../../utils/client";

export const Navigation = () => {
  const role = Cookies.get("role");
  const [isOpen, setIsOpen] = useState(false);
  const { User } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to LogOut?")) {
      Cookies.remove("ecom");
      Cookies.remove("role");
      router.reload();
      // const instance = axios.create({
      //   withCredentials: true,
      // });

      // try {
      //   const res = await instance.post(logoutLink[0]);
      //   if (res.data) {
      //     router.reload();
      //   }
      // } catch (error) {
      //   console.log(error.message);
      // }
    }
  };

  return (
    <div className={isOpen ? "vendor-menu open" : "vendor-menu"}>
      <header>
        <span>PartyStore</span>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <Icon name="close" /> : <img src="/album.svg" alt="menu" />}
        </button>
      </header>

      {/* SHOW THIS TO VENDORS */}
      <div>
        {role === "vendor" ? (
          <section>
            <ul>
              <li>
                <Link href="/vendor/dashboard">
                  <a>Dashboard</a>
                </Link>
              </li>
              <li>
                <Link
                  href={`/store/${User && User.business_name_slug}`}
                  as={`/store/${User && User.business_name_slug}`}
                >
                  <a>Store</a>
                </Link>
              </li>
              <li>
                <Link href="/vendor/orders">
                  <a>Orders</a>
                </Link>
              </li>
              <li>
                <Link href="/store/new-item">
                  <a>New Product</a>
                </Link>
              </li>
              <li>
                <Link href="/vendor/account">
                  <a>Account</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>Payment</a>
                </Link>
              </li>
              <li>
                <Link href="/become-a-vendor#contact">
                  <a>Contact Us</a>
                </Link>
              </li>
              <div className="logout-btn">
                <Button
                  style={{ color: "white", background: "var(--deepblue)" }}
                  width="100%"
                  borderRadius="none"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </ul>
          </section>
        ) : (
          <ul className="menu-for-customers">
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/customer/account">
                <a>Account</a>
              </Link>
            </li>
            <li>
              <Link href="/customer/cart">
                <a>Cart</a>
              </Link>
            </li>
            <li>
              <Link href="/customer/orders">
                <a>Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/stores">
                <a>Stores</a>
              </Link>
            </li>
            <br />

            <div className="login-btn">
              <Button
                style={{ color: "white", background: "var(--deepblue)" }}
                width="100%"
                borderRadius="none"
              >
                <Link href="/vendor/login">
                  <a>Vendor Login</a>
                </Link>
              </Button>
            </div>
          </ul>
        )}
      </div>

      <button className="vendor-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <Icon name="close" />
        ) : (
          <img src="/menu.svg" alt="menu svg" />
        )}
      </button>
      <style jsx>{`
        .vendor-menu {
          background: #062863;
          /* background: var(--deepblue); */
          width: 300px;
          height: 100%;
          border-right: 0.6px solid var(--softgrey);
          margin-left: -300px;
          position: relative;
          position: fixed;
          z-index: 2;
          transition: 0.5s ease;
          min-height: 100vh;
          /* border-radius: 17px; */
        }

        .vendor-menu.open {
          margin-left: 0px;
          transition: 0.5s ease;
        }

        .vendor-menu ul {
          display: flex;
          flex-direction: column;
        }

        .vendor-menu header {
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          margin-bottom: 10px;
          margin-left: 0;
          padding: 20px 15px;
          display: flex;
          justify-content: space-between;
        }
        .vendor-menu ul li {
          margin: 10px 0;
          padding-left: 30px;
          padding-bottom: 5px;
          display: block;
          color: white;
        }
        .vendor-menu-btn {
          position: absolute;
          top: 0;
          right: 0;
          margin-right: -45px;
        }
        .vendor-menu-btn img {
          width: 35px;
        }

        .logout-btn {
          margin-top: 50px;
          padding-bottom: 2rem;
        }

        @media only screen and (min-width: 700px) {
          .vendor-menu {
            margin-left: 0px;
            width: 200px;
            position: static;
          }
          .vendor-menu-btn {
            display: none;
          }
        }

        @media only screen and (min-width: 1200px) {
          .vendor-menu {
            width: 250px;
          }
          .vendor-menu header {
            padding-top: 40px;
          }
          .vendor-menu ul li {
            margin: 10px 0;
            padding-bottom: 8px;
            font-size: 1.1rem;
          }
          .menu-for-customers li {
            padding-bottom: 5px;
            font-size: 1.1rem;
          }
          .logout-btn {
            padding-bottom: 10rem;
          }
        }

        @media only screen and (min-width: 1800px) {
          .vendor-menu ul li {
            font-size: 1.2rem;
          }
          .logout-btn {
            padding-bottom: 20rem;
          }
          .menu-for-customers li {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};
