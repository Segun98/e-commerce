import React, { useEffect } from "react";
import { getCartItems } from "../../graphql/customer";
import { useToast } from "@chakra-ui/core";
import { Cart } from "../../Typescript/types";
import { useQuery } from "./../useQuery";
import { useRouter } from "next/router";
import { Order } from "./Order";

export const CustomerCart: React.FC<{ Token: string }> = ({ Token }) => {
  const router = useRouter();
  const toast = useToast();
  const [data, loading, error] = useQuery(getCartItems, {}, Token);
  const res = data ? data.getCartItems : undefined;

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
      {!loading && !Token && "log in to add to cart"}
      {/* vendors trying to access Cart  */}
      {error && Token && error.response?.errors[0].message === "Unauthorised"
        ? "log in as a customer to add to cart"
        : null}
      {!loading && res && res.length === 0 && "Cart is Empty"}
      {res &&
        res.map((d: Cart) => (
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
            <Order d={d} Token={Token} />
            <br />
          </div>
        ))}
    </div>
  );
};
