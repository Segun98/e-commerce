import React, { useState } from "react";
import Link from "next/link";
import { Button, Icon } from "@chakra-ui/core";
import Cookies from "js-cookie";
import { useUser } from "../../Context/UserProvider";
import { useRouter } from "next/router";
import axios from "axios";

export const Navigation = () => {
  const role = Cookies.get("role");
  const [isOpen, setIsOpen] = useState(false);
  const { User } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to LogOut?")) {
      const instance = axios.create({
        withCredentials: true,
      });

      try {
        const res = await instance.post(`http://localhost:4000/api/logout`);
        if (res.data) {
          router.reload();
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      <div className={isOpen ? "vendor-menu open" : "vendor-menu"}>
        <header>
          <span>PartyStore</span>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Icon name="arrow-right" />
          </button>
        </header>

        {/* SHOW THIS TO VENDORS */}
        {role && role === "vendor" && (
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
                <a>Add New Product</a>
              </Link>
            </li>
            <li>
              <Link href="/vendor/account">
                <a>Account</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Payout?</a>
              </Link>
            </li>
            <li>
              <Link href="/">
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
        )}

        {/* SHOW THIS TO CUSTOMERS */}
        {role !== "vendor" || !role ? (
          <ul className="menu-for-customers">
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Gifts">
                <a>Gifts</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Decorations">
                <a>Decorations</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Games">
                <a>Games</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Drinks">
                <a>Drinks</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Props">
                <a>Party Props</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Cakes">
                <a>Cakes</a>
              </Link>
            </li>
            {/* LOGIN BUTTON FOR VENDORS  */}
            <div className="logout-btn">
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
        ) : (
          ""
        )}
        <button className="vendor-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <Icon name="close" />
          ) : (
            <img src="/menu.svg" alt="menu svg" />
          )}
        </button>
        <style jsx>{`
          .vendor-menu {
            background: var(--softblue);
            width: 250px;
            height: 100vh;
            border-right: 0.6px solid var(--softgrey);
            margin-left: -250px;
            position: relative;
            position: fixed;
            z-index: 2;
            transition: 0.5s ease;
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
            font-style: italic;
            font-size: 1.2rem;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
            margin-left: 0;
            border-bottom: 1px solid;
            padding: 10px 15px;
            background: var(--deepblue);
            display: flex;
            justify-content: space-between;
          }
          .vendor-menu ul li {
            margin: 10px 0;
            padding-left: 10px;
            padding-bottom: 5px;
            display: block;
            color: var(--text);
          }
          .vendor-menu-btn {
            position: absolute;
            top: 0;
            right: 0;
            margin-right: -45px;
          }
          .vendor-menu-btn img {
            width: 40px;
          }
          .menu-for-customers li {
            font-weight: bold;
            color: var(--text);
            text-decoration: uppercase;
          }
          .logout-btn {
            margin-top: 80px;
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

            .vendor-menu ul li {
              margin: 10px 0;
              padding-left: 10px;
              padding-bottom: 5px;
              border-bottom: none;
              text-transform: none;
            }
            .menu-for-customers li {
              padding-bottom: 5px;
              font-size: 1.05rem;
            }
          }

          @media only screen and (min-width: 1800px) {
            .vendor-menu ul li {
              font-size: 1.2rem;
            }
            .menu-for-customers li {
              font-size: 1.2rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};
