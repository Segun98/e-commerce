import { Button, useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { PaystackConsumer } from "react-paystack";
import { useToken } from "../../Context/TokenProvider";
import { createOrder, deleteFromCart } from "../../graphql/customer";
import { Cart, MutationCreateOrderArgs } from "../../Typescript/types";
import { useMutation } from "../../utils/useMutation";

interface Iprops {
  cart: Cart;
  address: string;
  phone: string;
  request: string;
}
export const ConfirmOrder: React.FC<Iprops> = ({
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
      const { data } = await useMutation(deleteFromCart, {
        id: cart.id,
      });
      if (data.deleteFromCart) {
        router.push("/customer/cart#cart-top");
      }
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

  //PAYSTACK TEST PAYMENT
  //cart gets deleted, not a good reference.
  const config = {
    reference: `${new Date().getTime()}`,
    firstname: cart.cartCreator.first_name,
    lastname: cart.cartCreator.last_name,
    phone: cart.cartCreator.phone,
    email: cart.cartCreator.email,
    amount: cart.product.price * cart.quantity * 100,
    publicKey: process.env.PUBLIC_KEY,
  };
  const componentProps = {
    ...config,
    onSuccess: (res) => {
      handleOrder();
    },
    onClose: () => {
      toast({
        title: "Unsuccessful, Closed.",
        status: "info",
        isClosable: true,
      });
    },
  };

  return (
    <PaystackConsumer {...componentProps}>
      {({ initializePayment }) => (
        <Button variantColor="blue" onClick={() => initializePayment()}>
          Pay With PayStack
        </Button>
      )}
    </PaystackConsumer>
  );
};
