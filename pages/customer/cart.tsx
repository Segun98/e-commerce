import React, { useEffect } from "react";
import { deleteFromCart, updateCart } from "../../graphql/customer";
import { Icon, useToast } from "@chakra-ui/core";
import { Cart } from "../../Typescript/types";
import Link from "next/link";
import { Order } from "../../components/customer/Order";
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
    const { data, error } = await useMutation(updateCart, {
      id,
      quantity,
    });
    if (data) {
      dispatch(cartItems(Token));
      toast({
        title: "Quantity Updated",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
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
      dispatch(cartItems(Token));
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
      <>
        {error &&
          error === "Network request failed" &&
          toast({
            title: "An error occurred.",
            description: "check your internet connection and refresh.",
            status: "error",
            duration: 7000,
            isClosable: true,
            position: "top",
          })}
      </>
      <div className="cart-page">
        {!loading && !Token && !role && (
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

        {!loading && role && role !== "vendor" && cart && cart.length === 0 && (
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

        {Token && role === "customer" && cart && cart.length > 0 && (
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
              {cart &&
                cart.map((c: Cart, index) => (
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
                    {/* ORDER BUTTON IN ITS COMPONENT  .. remeber to restrict checkout for offline vendors*/}
                    <Order c={c} Token={Token} />
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
