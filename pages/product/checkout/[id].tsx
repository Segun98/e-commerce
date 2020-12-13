import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useToken } from "@/Context/TokenProvider";
import { getCart } from "@/graphql/customer";
import { Cart } from "@/Typescript/types";
import { useQuery } from "@/components/useQuery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Input,
  Textarea,
  Spinner,
  useToast,
  Text,
} from "@chakra-ui/core";
import { Commas } from "@/utils/helpers";
import Link from "next/link";
import { NextStep } from "@/components/customer/NextStep";

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

  return (
    <Layout>
      <Head>
        <title>Checkout | PartyStore</title>
      </Head>
      <div className="checkout-page">
        {!cart && (
          <div style={{ textAlign: "center" }}>
            <Spinner speed="1s"></Spinner>
          </div>
        )}
        {!loading &&
          error &&
          toast({
            title: "An error occurred",
            description: "Please refresh the page",
            status: "error",
          })}
        {error || (!cart && <div className="space"></div>)}
        {cart && (
          <div className="bread-crumb">
            <Breadcrumb
              separator={<Icon color="gray.300" name="chevron-right" />}
            >
              <BreadcrumbItem>
                <Link href={`/product/${cart.product.name_slug}`}>
                  <a>Product</a>
                </Link>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <Link href={`/customer/cart`}>
                  <a>Cart</a>
                </Link>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Checkout</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        )}
        {cart && (
          <div className="checkout-wrap">
            <div className="delivery-info">
              <div className="grid-1">
                <div className="head">
                  <h1>Address Details</h1>
                  <Text
                    as="span"
                    cursor="pointer"
                    aria-label="edit address"
                    role="button"
                    aria-roledescription="edit address"
                    onClick={() => setEditMode(!editMode)}
                  >
                    Edit <Icon aria-label="edit address" name="edit" />
                  </Text>
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
                  aria-label="address"
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
                  aria-label="phone number"
                  display={editMode ? "block" : "none"}
                  type="tel"
                  name="phone number"
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
                      <th>Delivery</th>
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
              <NextStep
                cart={cart}
                request={request}
                phone={phone}
                address={address}
              />
            </div>
            <div className="product-info">
              <h1>Your Order</h1>
              <hr />
              <div className="wrap">
                <img src={cart.product.images[0]} alt="product image" />
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
                <p style={{ color: "var(--deepblue)", fontWeight: "bold" }}>
                  &#8358; {Commas(cart.quantity * cart.product.price + 1000)}
                </p>
              </div>
              <aside>
                <p>Vendor</p>
                <p style={{ color: "var(--deepblue)", fontWeight: "bold" }}>
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
          text-align: center;
        }
        td {
          font-size: 0.8rem;
          padding: 5px 0;
          text-align: center;
          font-weight: bold;
        }
        .bread-crumb {
          margin: auto;
          width: 90%;
          padding-top: 10px;
        }

        @media only screen and (min-width: 700px) {
          td {
            padding: 5px 10px;
            border-right: 1px solid var(--softgrey);
          }
          .bread-crumb {
            width: 80%;
            padding-top: 15px;
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
          .bread-crumb {
            width: 70%;
          }
        }

        @media only screen and (min-width: 1800px) {
          .bread-crumb {
            width: 50%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Checkout;
