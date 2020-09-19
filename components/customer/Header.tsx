import {
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from "@chakra-ui/core";
import Link from "next/link";
import React, { useState } from "react";
import { useToken } from "../../Context/TokenProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useUser } from "../../Context/UserProvider";
import axios from "axios";

export const Header = () => {
  const { Token } = useToken();
  const router = useRouter();
  const role = Cookies && Cookies.get("role");
  const { User } = useUser();
  const [IsOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to LogOut?")) {
      const instance = axios.create({
        withCredentials: true,
      });

      try {
        const res = await instance.post(`http://localhost:4000/api/logout`);
        if (res.data) {
          router.reload();
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div>
      <div className="header-component">
        <header>
          <div className="header-wrap">
            <div className="header-wrap_left">
              <button
                className="hamburger"
                onClick={() => {
                  setIsOpen(!IsOpen);
                }}
              >
                <img src="/menu.svg" alt="menu" />
              </button>
              <div className="logo">
                <Link href="/">
                  <a>PartyStore</a>
                </Link>
              </div>
            </div>

            <div className="large-bar">
              <InputGroup size="md">
                <InputLeftAddon
                  onClick={() => {
                    console.log("clicked");
                  }}
                  cursor="pointer"
                  children={<Icon name="search" color="blue.800" />}
                  borderTop="none"
                  color="blue.400"
                />
                <Input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search our 1000+ products"
                />
              </InputGroup>
            </div>

            <div className="header-wrap_right">
              <div>
                <Popover usePortal>
                  <PopoverTrigger>
                    <Button
                      style={{ color: "white", background: "var(--deepblue)" }}
                      rightIcon="chevron-down"
                    >
                      {!Token && !role && <div>Login</div>}
                      {Token && role && (
                        <div
                          className="profile-icon"
                          style={{ cursor: "pointer" }}
                        >
                          <div>Hi, {Token && User && User.first_name}</div>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent width="30" zIndex={999}>
                    <div className="pop-over-body">
                      {!Token && !role && (
                        <p
                          style={{
                            color: "var(--deepblue)",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <Link href="/customer/login">
                            <a>LOGIN</a>
                          </Link>
                        </p>
                      )}
                      {!Token && !role && (
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Or
                        </p>
                      )}
                      {!Token && !role && (
                        <p
                          style={{
                            color: "var(--deepblue)",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <Link href="/customer/register">
                            <a>CREATE AN ACCOUNT</a>
                          </Link>
                        </p>
                      )}
                      {!Token && !role && <Divider />}
                      <div className="pop-over-body-rest">
                        <p>
                          <Link href="/customer/account">
                            <a>Account</a>
                          </Link>
                        </p>
                        <p>
                          <Link href="/customer/cart">
                            <a>Cart</a>
                          </Link>
                        </p>
                        <Divider />

                        <p>Help</p>
                        {Token && role && (
                          <Button
                            variantColor="blue"
                            width="100%"
                            display="block"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="cart-icon">
                <Link href="/customer/cart">
                  <a>
                    <img src="/shopping-cart.svg" alt="cart-icon" />
                    Cart
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>
        {/* dont show in these routes  */}
        {router.pathname !== "/customer/login" &&
          router.pathname !== "/customer/register" && (
            <div className="search-bar">
              <InputGroup size="md">
                <InputLeftAddon
                  onClick={() => {
                    console.log("clicked");
                  }}
                  cursor="pointer"
                  children={<Icon name="search" color="blue.800" />}
                  borderTop="none"
                  color="blue.400"
                />
                <Input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search our 1000+ products"
                />
              </InputGroup>
            </div>
          )}
      </div>
      <section className={IsOpen ? "navigation" : "navigation open-nav"}>
        <nav>
          <button
            className="close-nav"
            onClick={() => {
              setIsOpen(!IsOpen);
            }}
          >
            <img src="close-o.svg" alt="close-icon" />
          </button>
          <div
            className="nav-profile"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {!Token && !role && (
              <Link href="/customer/login">
                <p>
                  <a>Hello, Login</a>
                </p>
              </Link>
            )}
            {Token && role && (
              <div style={{ cursor: "pointer" }}>
                {/* <img src="/profile.svg" alt="profile-icon" /> */}
                <div>Hi, {Token && User && User.first_name}</div>
              </div>
            )}
            <button
              onClick={() => {
                setIsOpen(!IsOpen);
              }}
            >
              <Icon name="close" color="white" />
            </button>
          </div>
          <h1>SHOP BY CATEGORY</h1>
          <ul>
            <li>
              <Link href="/">
                <a>Gifts</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Decoration</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Birthdays</a>
              </Link>
            </li>

            <li>
              <Link href="/">
                <a>Decorations</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Games</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Drinks</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Party Props</a>
              </Link>
            </li>
          </ul>
          <h1>PROFILE</h1>
          <ul>
            <li>Account</li>
            <li>Cart</li>
            <li>Contact</li>
          </ul>
        </nav>
      </section>

      <style jsx>{`
        header {
          box-shadow: var(--box) var(--softgrey);
          padding: 5px 0;
        }
        .header-component {
          position: sticky;
          position: -webkit-sticky;
          top: 0;
          background: white;
        }
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: auto;
          width: 90%;
        }
        .header-wrap img {
          width: 40px;
          height: 35px;
        }
        .header-wrap_left,
        .header-wrap_right {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          color: var(--deepblue);
          margin-left: 10px;
          font-weight: bold;
          font-size: 1.2rem;
          font-style: italic;
        }

        .cart-icon {
          color: var(--deepblue);
          margin-left: 10px;
          font-size: 0.8rem;
          text-align: center;
          font-weight: bold;
        }
        .cart-icon img {
          width: 30px;
          height: 25px;
        }

        .large-bar {
          display: none;
        }

        /* Navigation and Hamburger  */

        .navigation {
          position: absolute;
          background: var(--softgrey);
          top: 0;
          width: 100%;
          height: 100%;
          transition: ease 0.4s;
          z-index: 100;
        }

        .navigation.open-nav {
          margin-left: -100%;
          transition: ease 0.4s;
        }

        .navigation nav {
          background: white;
          width: 70%;
          height: 100%;
          position: relative;
          padding-bottom: 20px;
          z-index: 100;
        }

        .navigation nav ul li {
          padding: 10px;
          border-bottom: 1px solid var(--lightblue);
        }

        .navigation h1 {
          color: $text;
          font-weight: bold;
          padding: 8px;
          text-align: center;
        }

        .navigation .close-nav {
          position: absolute;
          right: 0;
          margin-right: -45px;
          margin-top: 50px;
        }

        .navigation .close-nav img {
          height: 40px;
        }

        .nav-profile {
          background: var(--deepblue);
          color: white;
          padding: 10px;
          font-weight: bold;
          font-style: italic;
        }

        .pop-over-body {
          padding: 0 5px;
        }
        .pop-over-body-rest p {
          font-weight: bold;
          padding: 2px 5px;
          text-align: center;
        }

        @media only screen and (min-width: 700px) {
          .header-wrap {
            justify-content: space-around;
          }
          .large-bar {
            display: block;
          }
          .large-bar {
            width: 60%;
          }
          .search-bar {
            display: none;
          }

          .navigation nav {
            width: 45%;
          }
          .cart-icon {
            font-size: 1rem;
          }

          .cart-icon img {
            width: 35px;
            height: 30px;
          }
        }

        @media only screen and (min-width: 1000px) {
          .navigation nav {
            width: 30%;
          }

          /* .pop-over-body {
            padding: 0 20px;
          } */
          .pop-over-body-rest p {
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  );
};
