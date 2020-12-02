import { Button, useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { useToken } from "../../Context/TokenProvider";
import { createOrder } from "../../graphql/customer";
import { Cart, MutationCreateOrderArgs } from "../../Typescript/types";
import { useMutation } from "../../utils/useMutation";

interface Iprops {
  cart: Cart;
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
    let sub = cart.product.price * cart.quantity + 1000;
    const variables: MutationCreateOrderArgs | any = {
      name: cart.product.name,
      price: cart.product.price,
      quantity: cart.quantity,
      delivery_fee: 1000,
      //@ts-ignore
      subtotal: parseInt(sub),
      request,
      customer_email: cart.cartCreator.email,
      vendor_email: cart.product.creator.email,
      customer_phone: cart.cartCreator.phone,
      vendor_phone: cart.product.creator.phone,
      customer_address: address,
      business_address: cart.product.creator.business_address,
      product_id: cart.product_id,
      prod_creator_id: cart.prod_creator_id,
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

    //check if product is out of stock or creator is offline

    if (
      cart.product.creator.online === "false" ||
      cart.product.in_stock === "false"
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
    const { data, error } = await useMutation(createOrder, variables, Token);

    if (data) {
      //order id
      const { id } = data.createOrder;
      //set session to store cart id
      window.sessionStorage.setItem("cart_id", cart.id);
      //payment page
      router.push(`/product/pay/${id}`).then(() => window.scrollTo(0, 0));
    }
    if (error) {
      toast({
        title: "An error occurred.",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
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
