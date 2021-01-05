import { ProtectRouteC } from "@/utils/ProtectedRouteC";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useToken } from "@/Context/TokenProvider";
import { getCartItemsCheckoutPage } from "@/graphql/customer";
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
import { Commas, nairaSign } from "@/utils/helpers";
import Link from "next/link";
import { NextStep } from "@/components/customer/NextStep";

const Checkout = () => {
  const toast = useToast();
  const { Token } = useToken();

  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");

  //cart data
  const [data, loading, error] = useQuery(getCartItemsCheckoutPage, {}, Token);
  let cart: Cart[] = data && data.getCartItems;

  //cart items subtotal
  const subTotal =
    cart && cart.reduce((a, c) => a + c.product.price * c.quantity, 0);

  useEffect(() => {
    if (cart) {
      setAddress(cart[0].cartCreator.customer_address || "");
      setPhone(cart[0].cartCreator.phone || "");
    }
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
              {cart.length === 1 && (
                <BreadcrumbItem>
                  <Link href={`/product/${cart[0].product.name_slug}`}>
                    <a>Product</a>
                  </Link>
                </BreadcrumbItem>
              )}

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
                    {cart[0]?.cartCreator.first_name}{" "}
                    {cart[0]?.cartCreator.last_name}
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
                  autoFocus={true}
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
                  maxLength={30}
                  name="phone number"
                  placeholder="update Your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Only show personalised note for 1 order  */}
              {cart.length === 1 && (
                <div className="grid-2">
                  <div className="head">
                    <h1>
                      Order Notes
                      <small style={{ fontSize: "0.8rem" }}>
                        {" "}
                        *Not required
                      </small>
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
              )}

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
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((c: Cart) => (
                      <tr key={c.product_id}>
                        <td>
                          <span>{c.product.name}</span>
                        </td>
                        <td>
                          <span>
                            {nairaSign} {Commas(c.product.price)}
                          </span>
                        </td>
                        <td>
                          <span>{c.quantity}</span>
                        </td>
                        <td>
                          <span>
                            {nairaSign} {Commas(c.quantity * c.product.price)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  Delivery:{" "}
                  <span>
                    {nairaSign} {Commas(1000 * cart.length)}
                  </span>
                </p>
                <p>
                  SubTotal:{" "}
                  <span>
                    {nairaSign} {Commas(subTotal + 1000 * cart.length)}
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
              {cart.map((c) => (
                <div key={c.product_id}>
                  <div className="wrap">
                    <img src={c.product.images[0]} alt="product image" />
                    <div>
                      <p>{c.product.name}</p>
                      <p style={{ color: "var(--deepblue)" }}>
                        {nairaSign} {Commas(c.product.price)}
                      </p>
                      <p>Qty: {c.quantity}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="wrap-2">
                    <p>Subtotal</p>
                    <p>
                      {nairaSign} {Commas(c.quantity * c.product.price)}
                    </p>
                  </div>
                  <aside>
                    <p>Vendor</p>
                    <p style={{ color: "var(--deepblue)", fontWeight: "bold" }}>
                      {c.product.creator.business_name}
                    </p>
                  </aside>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .bread-crumb {
          margin: auto;
          width: 90%;
          padding-top: 10px;
        }

        table {
          border-spacing: 5px;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        td:nth-child(4) {
          color: var(--deepblue);
          font-weight: bold;
        }
        th {
          font-size: 0.8rem;
          background-color: #f2f2f2;
          text-align: center;
        }
        td {
          font-size: 0.8rem;
          padding: 5px 0;
          text-align: center;
        }
        .name {
          display: flex;
        }

        @media only screen and (min-width: 700px) {
          td {
            padding: 5px 10px;
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

export default ProtectRouteC(Checkout);
