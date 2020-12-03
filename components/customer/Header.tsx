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
import React, { useEffect, useState } from "react";
import { useToken } from "../../Context/TokenProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useUser } from "../../Context/UserProvider";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { cartItems } from "../../redux/features/cart/fetchCart";
import { logoutLink } from "./../../utils/client";

interface DefaultRootState {
  cart: any;
}
export const Header = () => {
  const { cartLength } = useSelector<DefaultRootState, any>(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  const { Token } = useToken();
  const router = useRouter();
  const role = Cookies && Cookies.get("role");
  const { User } = useUser();
  const [IsOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(cartItems(Token));
  }, [Token, cartLength]);

  //close menu when you click outside of the menu
  useEffect(() => {
    if (typeof window === "object") {
      const body = document.body;
      body.addEventListener("click", (e) => {
        //@ts-ignore
        if (e.target.parentNode.nodeName === "NAV") {
          return;
        } else {
          if (IsOpen) {
            setIsOpen(false);
            return;
          }
        }
      });
    }
  }, [IsOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/search?query=${search}`);
    }
  }

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
      //     return;
      //   }
      // } catch (error) {
      //   console.log(error.message);
      // }
    }
  };

  return (
    <div>
      <div className="header-component">
        <header>
          <div className="header-wrap">
            <div className="header-wrap_left">
              <button
                aria-label="menu"
                title="menu"
                className="hamburger"
                onClick={() => {
                  setIsOpen(!IsOpen);
                }}
              >
                <img src="/menu.svg" alt="menu" />
              </button>
              <div className="logo">
                <Link href="/">
                  <a title="logo">PartyStore</a>
                </Link>
              </div>
            </div>

            {/* SEARCH BAR FOR DESKTOP */}

            <div className="large-bar">
              <form onSubmit={handleSearch}>
                <InputGroup size="md">
                  <InputLeftAddon
                    onClick={handleSearch}
                    cursor="pointer"
                    children={<Icon name="search" color="blue.800" />}
                    borderTop="none"
                    color="blue.400"
                  />
                  <Input
                    aria-label="menu"
                    title="search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search"
                    placeholder="Search our 1000+ products"
                  />
                </InputGroup>
              </form>
            </div>

            <div className="header-wrap_right">
              <div>
                <Popover usePortal>
                  <PopoverTrigger>
                    <Button
                      size="sm"
                      style={{ color: "white", background: "var(--deepblue)" }}
                      rightIcon="chevron-down"
                    >
                      {Token && role ? (
                        <div
                          className="profile-icon"
                          style={{ cursor: "pointer" }}
                        >
                          <div>Hi, {Token && User && User.first_name}</div>
                        </div>
                      ) : (
                        <div>Login</div>
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
                        {Token && role === "vendor" && (
                          <p>
                            <Link href="/vendor/dashboard">
                              <a>Dashboard</a>
                            </Link>
                          </p>
                        )}
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
                        <p>
                          <Link href="/customer/orders">
                            <a>Orders</a>
                          </Link>
                        </p>
                        <p>Help</p>
                        {Token && role && (
                          <Button
                            variantColor="blue"
                            width="100%"
                            display="block"
                            marginTop="5px"
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
                  <a title="visit cart">
                    <aside>{cartLength === 0 ? null : cartLength}</aside>
                    <img src="/shopping-cart.svg" alt="cart icon" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE SEARCH BAR dont show in these routes  */}

        {router.pathname !== "/customer/login" &&
          router.pathname !== "/customer/register" && (
            <div className="search-bar">
              <form onSubmit={handleSearch}>
                <InputGroup size="md">
                  <InputLeftAddon
                    onClick={handleSearch}
                    cursor="pointer"
                    children={<Icon name="search" color="blue.800" />}
                    borderTop="none"
                    color="blue.400"
                  />
                  <Input
                    aria-label="search"
                    title="search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search mobile"
                    placeholder="Search our 1000+ products"
                  />
                </InputGroup>
              </form>
            </div>
          )}
      </div>

      {/* MENU SECTION */}

      <section className={IsOpen ? "navigation open-nav" : "navigation"}>
        <nav>
          <div
            className="nav-profile"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {role ? (
              <div style={{ cursor: "pointer" }}>
                <div>Hi, {Token && User && User.first_name}</div>
              </div>
            ) : (
              <Link href="/customer/login">
                <a>Hello, Login</a>
              </Link>
            )}

            <button
              aria-roledescription="close menu"
              aria-label="close menu"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Icon name="close" color="white" />
            </button>
          </div>
          <h1>PROFILE</h1>
          <ul>
            <Link href="/">
              <a>
                <li>Home</li>
              </a>
            </Link>
            <Link href="/customer/account">
              <a>
                <li>Account</li>
              </a>
            </Link>
            <Link href="/customer/cart">
              <a>
                <li>Cart</li>
              </a>
            </Link>
            <Link href="/customer/orders">
              <a>
                <li>Orders</li>
              </a>
            </Link>
            <Link href="/">
              <a>
                <li>Help</li>
              </a>
            </Link>
            <Link href="/stores">
              <a>
                <li>Stores</li>
              </a>
            </Link>
          </ul>
          <h1>SHOP BY CATEGORY</h1>
          <ul
            onClick={() => {
              setIsOpen(!IsOpen);
            }}
          >
            <Link href="/category?category=Gifts">
              <a>
                <li>Gifts</li>
              </a>
            </Link>

            <Link href="/category?category=Decorations">
              <a>
                <li>Decorations</li>
              </a>
            </Link>
            <Link href="/category?category=Games">
              <a>
                <li>Games</li>
              </a>
            </Link>
            <Link href="/category?category=Drinks">
              <a>
                <li>Drinks</li>
              </a>
            </Link>
            <Link href="/category?category=Props">
              <a>
                <li>Party Props</li>
              </a>
            </Link>
            <Link href="/category?category=Cakes">
              <a>
                <li>Cakes</li>
              </a>
            </Link>
          </ul>

          <h1>SHOP BY PARTY</h1>
          <ul
            onClick={() => {
              setIsOpen(!IsOpen);
            }}
          >
            <Link href="/party?category=House Party">
              <a>
                <li>House Party</li>
              </a>
            </Link>
            <Link href="/party?category=Beach Party">
              <a>
                <li>Beach Party</li>
              </a>
            </Link>
            <Link href="/party?category=Birthday Party">
              <a>
                <li>Birthdays</li>
              </a>
            </Link>
            <Link href="/party?category=Outdoors">
              <a>
                <li>Outdoors</li>
              </a>
            </Link>
            <Link href="/party?category=Indoors">
              <a>
                <li>Indoors</li>
              </a>
            </Link>
          </ul>
        </nav>
      </section>

      <style jsx>{`
        header {
          box-shadow: var(--box) var(--softgrey);
          padding: 5px 0;
        }
        .header-component {
          background: white;
          width: 100%;
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
          font-size: 1.1rem;
          /* font-style: italic; */
        }
        .profile-icon {
          font-size: 0.9rem;
        }
        .cart-icon {
          color: var(--deepblue);
          margin-left: 10px;
          font-size: 0.8rem;
          text-align: center;
          font-weight: bold;
          position: relative;
        }
        .cart-icon img {
          width: 30px;
          height: 25px;
        }
        .cart-icon a aside {
          position: absolute;
          top: 0;
          margin-left: 20px;
          margin-top: -12px;
          color: var(--deepblue);
          font-weight: bolder;
        }

        .large-bar {
          display: none;
        }

        /* Navigation and Hamburger  */

        .navigation {
          background: var(--softblue);
          width: 80%;
          height: 100%;
          margin-left: -85%;
          position: relative;
          position: fixed;
          top: 0;
          bottom: 0;
          z-index: 9999;
          transition: 0.5s ease;
          overflow-y: scroll;
          border-radius: 0 17px 17px 0;
        }

        .navigation.open-nav {
          margin-left: 0%;
          transition: ease 0.4s;
        }
        .navigation nav ul li {
          padding: 10px;
          border-bottom: 1px solid var(--lightblue);
        }

        .navigation nav ul li {
          z-index: 9999;
        }
        .navigation h1 {
          color: $text;
          font-weight: bold;
          padding: 8px;
          text-align: center;
        }

        .nav-profile {
          background: var(--deepblue);
          color: white;
          padding: 10px;
          font-weight: bold;
          font-style: italic;
        }

        .pop-over-body {
          padding: 0 2px;
        }
        .pop-over-body-rest {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .pop-over-body-rest p {
          font-weight: bold;
          padding: 8px 0;
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
          .logo {
            font-size: 1.2rem;
          }
          .profile-icon {
            font-size: 1rem;
          }
          .navigation {
            width: 50%;
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
          .navigation {
            width: 30%;
          }

          .pop-over-body-rest p {
            padding: 0 20px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .navigation ul li {
            font-size: 1.1rem;
          }
        }
        @media only screen and (min-width: 1400px) {
          .navigation ul li {
            font-size: 1.2rem;
          }
        }
        @media only screen and (min-width: 1800px) {
          .navigation ul li {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};
