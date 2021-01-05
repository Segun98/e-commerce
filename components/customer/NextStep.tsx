import { graphQLClient } from "@/utils/client";
import { Button, useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useToken } from "@/Context/TokenProvider";
import { createOrder } from "@/graphql/customer";
import { Cart, MutationCreateOrderArgs } from "@/Typescript/types";

interface Iprops {
  cart: Cart[];
  address: string;
  phone: string;
  request: string;
}

export const NextStep: React.FC<Iprops> = ({
  cart,
  address,
  phone,
  request,
}) => {
  const { Token } = useToken();
  const toast = useToast();
  const router = useRouter();

  async function handleOrder() {
    //very important!
    let orderId = Date.now();

    for await (const c of cart) {
      //price + delivery
      let sub = c.product.price * c.quantity;

      const variables: MutationCreateOrderArgs = {
        order_id: String(orderId),
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        //@ts-ignore
        subtotal: parseInt(sub),
        request,
        customer_email: c.cartCreator.email,
        vendor_email: c.product.creator.email,
        customer_phone: c.cartCreator.phone,
        vendor_phone: c.product.creator.phone,
        customer_address: address,
        business_address: c.product.creator.business_address,
        product_id: c.product_id,
        prod_creator_id: c.prod_creator_id,
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

      //restricted customer can't place an order
      if (c.cartCreator.pending === "true") {
        toast({
          title: "Sorry you cannot make this Order at this time",
          description:
            "Your account is currently restricted, please contact us",
          status: "info",
          duration: 7000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      //check if product is out of stock or creator is offline

      if (
        c.product.creator.online === "false" ||
        c.product.in_stock === "false" ||
        c.product.available_qty < 1
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

      try {
        graphQLClient.setHeader("authorization", `bearer ${Token}`);
        await graphQLClient.request(createOrder, variables);
      } catch (err) {
        toast({
          title: "An error occurred.",
          description: "Please check your internet connection and refresh.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
    }

    //Route to payment page after loop
    router.push(`/product/pay/${orderId}`).then(() => window.scrollTo(0, 0));
  }

  return (
    <Button
      onClick={handleOrder}
      variantColor="blue"
      rightIcon="arrow-forward"
      variant="outline"
    >
      Next Step
    </Button>
  );
};
