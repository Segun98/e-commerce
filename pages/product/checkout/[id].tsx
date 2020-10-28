import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Layout } from "../../../components/Layout";
import { useToken } from "../../../Context/TokenProvider";
import {
  createOrder,
  deleteFromCart,
  getCart,
} from "../../../graphql/customer";
import { Cart, MutationCreateOrderArgs } from "../../../Typescript/types";
import { useQuery } from "./../../../components/useQuery";
import { Button, Icon, Input, Textarea, useToast } from "@chakra-ui/core";
import { Commas } from "../../../utils/helpers";
import { useMutation } from "../../../utils/useMutation";
import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  const variables = {
    id: params.id,
  };

  return {
    props: {
      variables,
    },
  };
}
const Checkout = ({ variables }) => {
  const toast = useToast();
  const { Token } = useToken();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");

  //cart data
  const [data, loading, error] = useQuery(getCart, variables, Token);
  let cart: Cart = data && data.getCart;

  useEffect(() => {
    setAddress(cart?.cartCreator.customer_address || "");
    setPhone(cart?.cartCreator.phone || "");
  }, [cart]);

  async function handleOrder() {
    let sub = cart.product.price * cart.quantity + 1000;
    const variables: MutationCreateOrderArgs | any = {
      name: cart.product.name,
      price: cart.product.price,
      quantity: cart.quantity,
      delivery_fee: 1000,
      //@ts-ignore
      subtotal: parseInt(sub),
      request,
      customer_email: cart.cartCreator.email,
      vendor_email: cart.product.creator.email,
      customer_phone: cart.cartCreator.phone,
      vendor_phone: cart.product.creator.phone,
      customer_address: address,
      business_address: cart.product.creator.business_address,
      product_id: cart.product_id,
      prod_creator_id: cart.prod_creator_id,
    };
    if (!address || !phone) {
      toast({
        title: "Address Details Cannot Be Empty",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    //check if product is out of stock or creator is offline

    if (
      cart.product.creator.online === "false" ||
      cart.product.in_stock === "false"
    ) {
      toast({
        title: "Sorry you cannot make this Order at this time",
        description:
          "The product is either out of stock or Vendor is unavailable. Sorry for the incovinience, do check back later",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const { data, error } = await useMutation(createOrder, variables, Token);

    if (data) {
      const { data } = await useMutation(deleteFromCart, {
        id: cart.id,
      });
      if (data.deleteFromCart) {
        router.push("/customer/cart");
      }
    }
    if (error) {
      toast({
        title: "An error occurred.",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <Layout>
      <Head>
        <title>Checkout | PartyStore</title>
      </Head>
      <div className="checkout-page">
        {error || (!cart && <div className="space"></div>)}
        {cart && (
          <div className="checkout-wrap">
            <div className="delivery-info">
              <div className="grid-1">
                <div className="head">
                  <h1>Address Details</h1>
                  <Icon
                    name="edit"
                    cursor="pointer"
                    onClick={() => setEditMode(!editMode)}
                  />
                </div>
                <hr />
                <p>
                  Full Name:{" "}
                  <span>
                    {cart?.cartCreator.first_name} {cart?.cartCreator.last_name}
                  </span>
                </p>
                <p>
                  Shipping Address: <span>{address}</span>{" "}
                </p>
                <Input
                  display={editMode ? "block" : "none"}
                  type="text"
                  name="address"
                  placeholder="update Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <p>
                  Phone Number: <span>{phone}</span>{" "}
                </p>
                <Input
                  display={editMode ? "block" : "none"}
                  type="tel"
                  name="address"
                  placeholder="update Your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="head">
                  <h1>
                    Order Notes
                    <small style={{ fontSize: "0.8rem" }}> *Not required</small>
                  </h1>
                  <div></div>
                </div>
                <hr />
                <Textarea
                  placeholder="Send a personalised request along with your order"
                  value={request}
                  maxLength={200}
                  onChange={(e) => setRequest(e.target.value)}
                ></Textarea>
              </div>

              <div className="grid-3">
                <div className="head">
                  <h1>Delivery</h1>
                  <div></div>
                </div>
                <hr />
                <p>&#42;Deliveries are within Lagos Only</p>
                <p>
                  &#42;Products Are Delivered within 2-4 days form Order date
                </p>
                <p>&#42;Track Your Orders in your Orders Page</p>
              </div>

              <div className="grid-4">
                <div className="head">
                  <h1>Shipment Details</h1>
                  <div></div>
                </div>
                <hr />
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                      <th>Delivery Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span>{cart.product.name}</span>
                      </td>
                      <td>
                        <span>&#8358; {cart.product.price}</span>
                      </td>
                      <td>
                        <span>{cart.quantity}</span>
                      </td>
                      <td>
                        <span>
                          &#8358; {Commas(cart.quantity * cart.product.price)}
                        </span>
                      </td>
                      <td>
                        <span>{Commas(1000)}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  Total:{" "}
                  <span>
                    &#8358; {Commas(cart.quantity * cart.product.price + 1000)}
                  </span>
                </p>
              </div>

              <Button
                color="white"
                background="var(--deepblue)"
                display="block"
                onClick={handleOrder}
              >
                Confirm Order
              </Button>
            </div>
            <div className="product-info">
              <h1>Your Order</h1>
              <hr />
              <div className="wrap">
                <img src={`${cart.product.image}`} alt="product image" />
                <div>
                  <p>{cart.product.name}</p>
                  <p style={{ color: "var(--deepblue)" }}>
                    &#8358; {cart.product.price}
                  </p>
                  <p>Qty: {cart.quantity}</p>
                </div>
              </div>
              <hr />
              <div className="wrap-2">
                <p>Subtotal</p>
                <p>&#8358; {Commas(cart.quantity * cart.product.price)}</p>
                <p>Delivery Fee</p>
                <p>&#8358; {Commas(1000)}</p>
                <p>Total</p>
                <p style={{ color: "var(--deepblue)" }}>
                  &#8358; {Commas(cart.quantity * cart.product.price + 1000)}
                </p>
              </div>
              <aside>
                <p>Vendor</p>
                <p style={{ color: "var(--deepblue)" }}>
                  {cart.product.creator.business_name}
                </p>
              </aside>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        table {
          border-spacing: 5px;
        }
        th {
          font-size: 0.8rem;
        }
        td {
          font-size: 0.8rem;
          padding: 5px 0;
        }

        @media only screen and (min-width: 700px) {
          td {
            padding: 5px 10px;
          }
        }
        @media only screen and (min-width: 1000px) {
          td {
            padding: 10px 10px;
          }
        }
        @media only screen and (min-width: 1200px) {
          td {
            padding: 10px 10px;
            font-size: 1rem;
          }
          th {
            font-size: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Checkout;
