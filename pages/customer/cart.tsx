import React, { useEffect, useState } from "react";
import { deleteFromCart, updateCart } from "../../graphql/customer";
import { Button, Icon, Spinner, useToast } from "@chakra-ui/core";
import { Cart } from "../../Typescript/types";
import Link from "next/link";
import { useToken } from "../../Context/TokenProvider";
import { Layout } from "../../components/Layout";
import Head from "next/head";
import { useMutation } from "../../utils/useMutation";
import { Commas } from "../../utils/helpers";
import Cookies from "js-cookie";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";
import { useSelector, useDispatch } from "react-redux";
import { cartItems, IinitialState } from "../../redux/features/cart/fetchCart";

interface DefaultRootState {
  cart: IinitialState;
}

export const CustomerCart = () => {
  //from redux feature - fetchCart
  const { loading, cart, error } = useSelector<DefaultRootState, IinitialState>(
    (state) => state.cart
  );

  const dispatch = useDispatch();
  const toast = useToast();
  const { Token } = useToken();
  const role = Cookies.get("role");

  //update cart quantity loading state
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    dispatch(cartItems(Token));
  }, [Token]);

  const cart_images = [
    "product3.png",
    "product2.png",
    "product1.png",
    "product2.png",
    "product3.png",
    "product1.png",
  ];

  //update quantity of an item
  const updateCartFn = async (id, quantity) => {
    setLoadingCart(true);
    const { data, error } = await useMutation(updateCart, {
      id,
      quantity,
    });
    if (data) {
      dispatch(cartItems(Token));
      setLoadingCart(false);
      toast({
        title: "Quantity Updated",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
      setLoadingCart(false);
      toast({
        title: "Updating Cart Item Quantity Failed",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  //delete from cart
  const deleteCartFn = async (id) => {
    setLoadingCart(true);
    const { data, error } = await useMutation(deleteFromCart, {
      id,
    });
    if (data.deleteFromCart) {
      dispatch(cartItems(Token));
      setLoadingCart(false);
      toast({
        title: "Item Removed From Cart",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
      setLoadingCart(false);
      toast({
        title: "Failed To Remove From Cart",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Cart | PartyStore</title>
      </Head>
      <>
        {error &&
          error === "Network request failed" &&
          toast({
            title: "Network Error",
            description: "Check your internet connection and refresh.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          })}
      </>

      {loadingCart && (
        <div className="spinner">
          <Spinner speed="0.5s"></Spinner>
        </div>
      )}
      <div className="cart-page">
        {!loading && !Token && !role && (
          <div className="indicator">
            <div className="status">
              <div>
                Looks Like You're Not Logged in, Click Login to Use Cart
              </div>
              <br />
              <div
                className="cart-unauthorised"
                style={{ textAlign: "center" }}
              >
                <Link href="/customer/login">
                  <a>LogIn</a>
                </Link>
              </div>
              <div style={{ textAlign: "center" }}>
                <p className="cart-unauthorised">Or</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="cart-unauthorised">
                  <Link href="/customer/register">
                    <a>SignUp</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* vendors trying to access Cart  */}
        {role && role === "vendor" && !loading && (
          <div className="indicator">
            <div className="status">
              <div>Log In as a Customer To Add To Cart </div>
              <br />
              <div
                className="cart-unauthorised"
                style={{ textAlign: "center" }}
              >
                <Link href="/customer/login">
                  <a>LogIn</a>
                </Link>
              </div>
              <div style={{ textAlign: "center" }}>
                <p className="cart-unauthorised">Or</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="cart-unauthorised">
                  <Link href="/vendor/dashboard">
                    <a>Visit Dashboard</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && role !== "vendor" && Token && cart.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20vh 0",
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: "2rem",
            }}
            id="cart-top"
          >
            Your Cart Is Empty
          </div>
        )}

        {Token && role === "customer" && cart && cart.length > 0 && (
          <section className="cart-section" id="cart-top">
            <div className="cart-wrap">
              <h1>In your Cart</h1>
              <div className="cart-item-title">
                <div>Product</div>
                <div></div>
                <div>Subtotal</div>
                <div></div>
                <div>Delete</div>
              </div>
              <hr />
              {cart &&
                cart.map((c: Cart, index) => (
                  <div key={c.id} className="cart-item">
                    <div className="cart-img">
                      <img
                        src={`${c.product.image || "/" + cart_images[index]}`}
                        alt={`${c.product.name}`}
                      />
                    </div>
                    <div className="item-details">
                      <p className="name">{c.product.name}</p>
                      <p className="price">&#8358; {Commas(c.product.price)}</p>
                      <div className="qty-btn">
                        <button
                          title="decrement quantity"
                          aria-label="decrement quantity"
                          aria-roledescription="decrement quantity"
                          onClick={() => {
                            if (c.quantity === 1) {
                              return;
                            }
                            updateCartFn(c.id, c.quantity - 1);
                          }}
                        >
                          <Icon name="minus" color="black" />
                        </button>
                        <aside className="cart-item-qty">{c.quantity}</aside>
                        <button
                          title="increment quantity"
                          aria-label="increment quantity"
                          aria-roledescription="increment quantity"
                          onClick={() => {
                            if (c.quantity === c.product.available_qty) {
                              return;
                            }
                            updateCartFn(c.id, c.quantity + 1);
                          }}
                        >
                          <Icon name="small-add" color="black" size="22px" />
                        </button>
                      </div>
                    </div>
                    <div className="subtotal">
                      &#8358; {Commas(c.product.price * c.quantity)}
                    </div>
                    <Button
                      className="order-btn"
                      color="white"
                      size="xs"
                      background="var(--deepblue)"
                    >
                      <Link href={`/product/checkout/${c.id}`}>
                        <a>Checkout</a>
                      </Link>
                    </Button>
                    <button
                      title="delete cart item"
                      name="delete cart item"
                      aria-label="delete cart item"
                      aria-roledescription="delete cart item"
                      onClick={() => {
                        deleteCartFn(c.id);
                      }}
                    >
                      <Icon name="close" size="14px" />
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}
        {/* NETWORK ERROR  */}
        {error && error === "Network request failed" && (
          <div className="space"></div>
        )}
        <PurchaseSteps />
      </div>
      <style jsx>{`
        .cart-unauthorised {
          margin-top: 20px;
        }
        .cart-unauthorised a {
          background: var(--deepblue);
          color: white;
          padding: 10px 30px;
          margin-top: 20px;
        }

        .spinner {
          position: fixed;
          top: 50%;
          left: 50%;
        }

        /* notification */
        .indicator {
          margin: auto;
          width: 90%;
        }
        .status {
          padding: 10px;
          border-radius: 10px;
          font-size: 1.1rem;
        }
        @media only screen and (min-width: 700px) {
          .indicator {
            width: 70%;
          }
        }
      `}</style>
    </Layout>
  );
};
export default CustomerCart;
