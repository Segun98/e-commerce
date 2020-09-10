import React from "react";
import {
  createOrder,
  deleteFromCart,
  getCartItems,
} from "../../graphql/customer";
import { graphQLClient } from "../../utils/client";
import { Button } from "@chakra-ui/core";
import { MutationCreateOrderArgs, Cart } from "../../Typescript/types";
import { useQuery } from "./../useQuery";
import { useRouter } from "next/router";

export const CustomerCart: React.FC<{ Token: string }> = ({ Token }) => {
  const router = useRouter();
  const [data, loading, error] = useQuery(getCartItems, {}, Token);
  const res = data ? data.getCartItems : undefined;

  async function handleOrder(
    name,
    price,
    quantity,
    delivery_fee,
    subtotal,
    description,
    customer_email,
    vendor_email,
    customer_phone,
    vendor_phone,
    customer_address,
    business_address,
    product_id,
    prod_creator_id,
    //cart item id
    id
  ) {
    const variables: MutationCreateOrderArgs = {
      name,
      price,
      quantity,
      delivery_fee,
      subtotal,
      description,
      customer_email,
      vendor_email,
      customer_phone,
      vendor_phone,
      customer_address,
      business_address,
      product_id,
      prod_creator_id,
    };

    try {
      graphQLClient.setHeader("authorization", `bearer ${Token}`);

      const res = await graphQLClient.request(createOrder, variables);
      const data = await res.createOrder;
      if (data) {
        const res = await graphQLClient.request(deleteFromCart, { id });
        if (res.deleteFromCart) {
          alert("order completed");
          // router.reload();
        }
      }
    } catch (err) {
      console.log(err.message);
      console.log(err.response?.errors[0].message);
    }
  }
  return (
    <div>
      {loading && "loading..."}
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
            <Button
              variantColor="purple"
              onClick={() => {
                handleOrder(
                  d.product.name,
                  d.product.price,
                  d.quantity,
                  5000,
                  d.product.price * d.quantity,
                  d.product.description,
                  d.cartCreator.email,
                  d.product.creator.email,
                  d.cartCreator.phone,
                  d.product.creator.phone,
                  d.cartCreator.customer_address,
                  d.product.creator.business_address,
                  d.product_id,
                  d.prod_creator_id,
                  //cart item id to delete from cart after order is successful
                  d.id
                );
              }}
            >
              Order
            </Button>
            <br />
          </div>
        ))}
    </div>
  );
};
