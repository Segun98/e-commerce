import React from "react";
import { getCartItems } from "../../graphql/customer";
import { Button, useToast } from "@chakra-ui/core";
import { Cart } from "../../Typescript/types";
import { useQuery } from "./../useQuery";
import { Order } from "./Order";
import Link from "next/link";

export const CustomerCart: React.FC<{ Token: string }> = ({ Token }) => {
  const toast = useToast();
  const [data, loading, error] = useQuery(getCartItems, {}, Token);

  return (
    <div>
      {/* "network error" */}
      {error &&
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
      {error && Token && error.response?.errors[0].message === "Unauthorised" && (
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
            <div>{d.quantity}</div>
            <div>{d.product.price}</div>
            <div>{d.product.name}</div>
            <div>{d.product.description}</div>
            <div>Qty: {d.product.available_qty}</div>
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
  );
};
