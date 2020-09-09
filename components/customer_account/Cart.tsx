import React, { useEffect, useState } from "react";
import {
  createOrder,
  deleteFromCart,
  getCartItems,
} from "../../graphql/customer";
import { graphQLClient } from "../../utils/client";
import { Button } from "@chakra-ui/core";
import { MutationCreateOrderArgs, Cart } from "../../Typescript/types";

export const CustomerCart: React.FC<{ Token: string }> = ({ Token }) => {
  const [data, setData] = useState<Array<Cart>>([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState();

  useEffect(() => {
    fetchCartItems();
  }, [Token]);

  async function fetchCartItems() {
    try {
      setLoading(true);
      graphQLClient.setHeader("authorization", `bearer ${Token}`);

      const res = await graphQLClient.request(getCartItems);
      const data = res.getCartItems;
      if (data) {
        setData(data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err.message);
      setLoading(false);
      console.log(err.response?.errors[0].message);
    }
  }

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
          fetchCartItems();
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
      {data &&
        data.map((d: Cart) => (
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
