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

      <style jsx>{``}</style>
    </div>
  );
};
