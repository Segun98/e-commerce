import React, { useEffect, useState } from "react";
import {
  deleteFromCart,
  getCartItems,
  updateCart,
} from "../../graphql/customer";
import { Icon, useToast } from "@chakra-ui/core";
import { Cart } from "../../Typescript/types";
import Link from "next/link";
import { Order } from "../../components/customer/Order";
import { useToken } from "../../Context/TokenProvider";
import { Layout } from "../../components/Layout";
import Head from "next/head";
import { useMutation } from "../../utils/useMutation";
import { graphQLClient } from "../../utils/client";
import { Commas } from "../../utils/helpers";
import Cookies from "js-cookie";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";

export const CustomerCart = () => {
  const toast = useToast();
  const { Token } = useToken();
  const role = Cookies.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [data, setData] = useState<Cart[]>([]);

  const cart_images = [
    "product3.png",
    "product2.png",
    "product1.png",
    "product2.png",
    "product3.png",
    "product1.png",
  ];

  useEffect(() => {
    getCartFn();
  }, [Token]);

  //fetch cart items, didn't use a custom hook cos I need to refetch on every quantity update
  const getCartFn = async () => {
    try {
      if (Token) {
        graphQLClient.setHeader("authorization", `bearer ${Token}`);
      }
      setLoading(true);
      const res = await graphQLClient.request(getCartItems);
      const data = res.getCartItems;
      if (data) {
        setLoading(false);
        setData(data);
      }
    } catch (err) {
      setLoading(false);
      //prevents unecessary error when Token is provision is loading
      if (Token && err) {
        setError(err);
      }
      // handle network errors
      if (err.message === "Network request failed") {
        setError(err);
        toast({
          title: "An error occurred.",
          description: "check your internet connection and refresh.",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  //update quantity of an item
  const updateCartFn = async (id, quantity) => {
    const { data, error } = await useMutation(updateCart, {
      id,
      quantity,
    });
    if (data) {
      getCartFn();
      toast({
        title: "Quantity Updated",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
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
    const { data, error } = await useMutation(deleteFromCart, {
      id,
    });
    if (data.deleteFromCart) {
      getCartFn();
      toast({
        title: "Item Removed From Cart",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
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
      <div className="cart-page">
        {!loading && !Token && (
          <div className="indicator">
            <div>
              <strong>
                Looks Like You're Not Logged in, Click Login to Use Cart
              </strong>
              <br />
              <div
                className="cart-unauthorised"
                style={{ textAlign: "center" }}
              >
                <Link href="/customer/login">
                  <a>LogIn</a>
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* vendors trying to access Cart  */}
        {error &&
          Token &&
          error?.response?.errors[0].message === "Unauthorised" && (
            <div className="indicator">
              <div>
                <strong>Log In as a Customer To Add To Cart </strong>
                <br />
                <div
                  className="cart-unauthorised"
                  style={{ textAlign: "center" }}
                >
                  <Link href="/customer/login">
                    <a>LogIn</a>
                  </Link>
                </div>
              </div>
            </div>
          )}

        {!loading && role && role !== "vendor" && data && data.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20vh 0",
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: "2rem",
            }}
          >
            Your Cart Is Empty
          </div>
        )}

        {Token && role === "customer" && data && data.length > 0 && (
          <section className="cart-section">
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
              {data &&
                data.map((c: Cart, index) => (
                  <div key={c.id} className="cart-item">
                    <div className="cart-img">
                      <img
                        src={`/${cart_images[index]}`}
                        alt={`${c.product.name}`}
                      />
                    </div>
                    <div className="item-details">
                      <p className="name">{c.product.name}</p>
                      <p className="price">&#8358; {Commas(c.product.price)}</p>
                      <div className="qty-btn">
                        <button
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
                    {/* ORDER BUTTON IN ITS COMPONENT  */}
                    <Order c={c} Token={Token} getCartFn={getCartFn} />
                    <button
                      name="delete cart item"
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
      `}</style>
    </Layout>
  );
};
export default CustomerCart;
