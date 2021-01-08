import { graphQLClient } from "@/utils/client";
import { Button, useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useToken } from "@/Context/TokenProvider";
import { createOrder } from "@/graphql/customer";
import { Cart, MutationCreateOrderArgs } from "@/Typescript/types";
import { useUser } from "@/Context/UserProvider";
import Cookies from "js-cookie";

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
  const { User } = useUser();
  const role = Cookies.get("role");

  async function handleOrder() {
    // 1st check
    if (!address || !phone) {
      toast({
        title: "Address Details Cannot Be Empty",
        description: "Click edit to add phone number and shipping address",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    //restricted customer can't place an order
    if (User.pending === "true") {
      toast({
        title: "Sorry you cannot make this Order at this time",
        description: "Your account is currently restricted, please contact us",
        status: "info",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    //2nd check
    for await (const c of cart) {
      //check if a product is out of stock or creator is offline

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
    }

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
        customer_email: User.email,
        vendor_email: c.product.creator.email,
        customer_phone: User.phone,
        vendor_phone: c.product.creator.phone,
        customer_address: address,
        business_address: c.product.creator.business_address,
        product_id: c.product_id,
        prod_creator_id: c.prod_creator_id,
      };

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
      onClick={() => {
        if (!Token || !role) {
          toast({
            title: "Almost There! You need to Login before making payment",
            description: "Redirecting",
            status: "info",
            position: "top",
            duration: 7000,
          });

          setTimeout(() => {
            router.push(`/customer/login?redirect=checkout`);
          }, 1000);

          return;
        }

        handleOrder();
      }}
      variantColor="blue"
      rightIcon="arrow-forward"
      variant="outline"
    >
      Pay
    </Button>
  );
};
