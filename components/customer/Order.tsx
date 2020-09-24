import { Button, useToast } from "@chakra-ui/core";
import React, { useState } from "react";
import { createOrder, deleteFromCart } from "../../graphql/customer";
import { Cart, MutationCreateOrderArgs } from "../../Typescript/types";
import { useMutation } from "../../utils/useMutation";
import { useRouter } from "next/router";

interface Iprops {
  c: Cart;
  Token: string;
  getCartFn: () => Promise<void>;
}
export const Order: React.FC<Iprops> = ({ c, Token, getCartFn }) => {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
    const { data, error } = await useMutation(createOrder, variables, Token);
    if (data) {
      setLoading(false);
      const { data } = await useMutation(deleteFromCart, {
        id,
      });
      if (data.deleteFromCart) {
        getCartFn();
      }
    }
    if (error) {
      setLoading(false);
      toast({
        title: "An error occurred.",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
    }
  }
  return (
    <div className="order-comp">
      <Button
        className="order-btn"
        color="white"
        size="sm"
        style={{ background: "var(--deepblue)" }}
        isLoading={loading}
        onClick={() => {
          handleOrder(
            c.product.name,
            c.product.price,
            c.quantity,
            5000,
            c.product.price * c.quantity,
            c.product.description,
            c.cartCreator.email,
            c.product.creator.email,
            c.cartCreator.phone,
            c.product.creator.phone,
            c.cartCreator.customer_address,
            c.product.creator.business_address,
            c.product_id,
            c.prod_creator_id,
            //cart item id to delete from cart after order is successful
            c.id
          );
        }}
      >
        Checkout
      </Button>
      <style jsx>{``}</style>
    </div>
  );
};
