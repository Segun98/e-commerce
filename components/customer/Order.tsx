import { Button, useToast } from "@chakra-ui/core";
import { Token } from "graphql/language";
import React, { useState } from "react";
import { createOrder, deleteFromCart } from "../../graphql/customer";
import { Cart, MutationCreateOrderArgs } from "../../Typescript/types";
import { useMutation } from "../../utils/useMutation";
import { useRouter } from "next/router";

interface Iprops {
  d: Cart;
  Token: string;
}
export const Order: React.FC<Iprops> = ({ d, Token }) => {
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
        router.reload();
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
    <div>
      <Button
        variantColor="purple"
        isLoading={loading}
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
    </div>
  );
};
