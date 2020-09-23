import React from "react";
import { getCartItems } from "../../graphql/customer";
import { Button, useToast } from "@chakra-ui/core";
import { Cart } from "../../Typescript/types";
import Link from "next/link";
import { useQuery } from "../../components/useQuery";
import { Order } from "../../components/customer/Order";
import { useToken } from "../../Context/TokenProvider";
import { Layout } from "../../components/Layout";
import Head from "next/head";

export const CustomerCart = () => {
  const toast = useToast();
  const { Token } = useToken();
  const [data, loading, error] = useQuery(getCartItems, {}, Token);

  return (
    <Layout>
      <Head>
        <title>Cart | PartyStore</title>
      </Head>
      <div>
        {/* "network error" */}
        {Token &&
          error &&
          error.message === "Network request failed" &&
          toast({
            title: "An error occurred.",
            description: "check your internet connection and refresh.",
            status: "error",
            duration: 7000,
            isClosable: true,
            position: "top",
          })}
        {loading && "loading..."}
        {!loading && !Token && (
          <div className="indicator">
            <div>
              <strong>
                Looks Like You're Not Logged in, Click Login to Use Cart
              </strong>
              <br />
              <div style={{ textAlign: "center" }}>
                <Button variantColor="blue">
                  <Link href="/customer/login">
                    <a>LogIn</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* vendors trying to access Cart  */}
        {error &&
          Token &&
          error.response?.errors[0].message === "Unauthorised" && (
            <div className="indicator">
              <div>
                <strong>Log In as a Customer To Add To Cart </strong>
                <br />
                <div style={{ textAlign: "center" }}>
                  <Button variantColor="blue">
                    <Link href="/customer/login">
                      <a>LogIn</a>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        {!loading && data && data.getCartItems.length === 0 && "Cart is Empty"}
        {data &&
          data.getCartItems.map((d: Cart) => (
            <div key={d.id}>
              <div>{d.product_id}</div>
              <div>Quantity: {d.quantity}</div>
              <div>{d.product.price}</div>
              <div>{d.product.name}</div>
              <div>{d.product.description}</div>
              <div>Subtotal - {d.product.price * d.quantity}</div>
              <div>Cart creator </div>
              <div>{d.cartCreator.first_name}</div>
              <div>{d.cartCreator.email}</div>
              <div>Product creator - {d.product.creator.business_name}</div>
              <Order d={d} Token={Token} />
              <br />
            </div>
          ))}
      </div>
    </Layout>
  );
};
export default CustomerCart;
