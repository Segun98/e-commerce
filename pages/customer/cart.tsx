import React, { useEffect, useState } from "react";
import { Spinner, useToast } from "@chakra-ui/core";
import Link from "next/link";
import { useToken } from "@/Context/TokenProvider";
import { Layout } from "@/components/Layout";
import Head from "next/head";
import Cookies from "js-cookie";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { useSelector, useDispatch } from "react-redux";
import { cartItems, IinitialState } from "@/redux/features/cart/fetchCart";
import { MainCart } from "@/components/customer/MainCart";

interface DefaultRootState {
  cart: IinitialState;
}

export const CustomerCart = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { Token } = useToken();
  const role = Cookies.get("role");

  useEffect(() => {
    dispatch(
      cartItems({
        customer_id: Cookies.get("customer_id"),
      })
    );
  }, [Token]);

  //from redux feature - fetchCart
  const { loading, cart, error } = useSelector<DefaultRootState, IinitialState>(
    (state) => state.cart
  );

  //update cart quantity loading state
  const [loadingCart, setLoadingCart] = useState(false);

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

      {/* LOADING INDICATOR WHEN UPDATE QUANTITY  */}
      {loadingCart && (
        <div className="spinner">
          <Spinner speed="0.5s"></Spinner>
        </div>
      )}

      {/* NOT LOGGED IN  */}
      <div className="cart-page">
        {/* vendors trying to access Cart  */}
        {role && role === "vendor" && !loading && (
          <div className="indicator">
            <div className="status">
              <div>Only Customers can use Cart </div>
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

        {/* EMPTY CART  */}
        {!loading && role !== "vendor" && cart.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20vh 0",
              fontWeight: "bold",
              fontSize: "1.8rem",
            }}
            id="cart-top"
          >
            Your Cart Is Empty
          </div>
        )}

        {/* CART CONTENT  */}
        {cart && cart.length > 0 && (
          <MainCart cart={cart} setLoadingCart={setLoadingCart} />
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
