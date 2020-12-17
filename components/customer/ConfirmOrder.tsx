import { useUser } from "@/Context/UserProvider";
import { Button, useToast } from "@chakra-ui/core";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import React from "react";
import { PaystackConsumer } from "react-paystack";
import { useToken } from "@/Context/TokenProvider";
import { deleteFromCart } from "@/graphql/customer";
import { MutationUpdateOrderArgs, Orders } from "@/Typescript/types";
import { useMutation } from "@/utils/useMutation";

//basically set payment status to paid
const updateOrder = gql`
  mutation updateOrder($id: ID!) {
    updateOrder(id: $id) {
      message
    }
  }
`;

//update available quantity in stock for ordered product
const updateQuantity = gql`
  mutation updateQuantity($id: ID!, $qty_ordered: Int) {
    updateQuantity(id: $id, qty_ordered: $qty_ordered) {
      message
    }
  }
`;

interface Iprops {
  order: Orders;
}

export const ConfirmOrder: React.FC<Iprops> = ({ order }) => {
  const { Token } = useToken();
  const { User } = useUser();
  const toast = useToast();
  const router = useRouter();

  async function updateOrderFn() {
    const variables: MutationUpdateOrderArgs = {
      id: order.id,
    };

    const { data, error } = await useMutation(updateOrder, variables, Token);

    if (data) {
      let id = window.sessionStorage.getItem("cart_id");
      const { data } = await useMutation(deleteFromCart, {
        id,
      });
      if (data) {
        toast({
          title: "Payment Successful",
          description:
            "Your Order has been successfuly placed, track it in your Orders page",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        //update available quantity in stock for ordered product
        await useMutation(updateQuantity, {
          id: order.product_id,
          qty_ordered: order.quantity,
        });

        router.push(`/customer/cart`).then(() => window.scrollTo(0, 0));
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
  const config = {
    reference: order?.id,
    firstname: User.first_name,
    lastname: User.last_name,
    phone: order?.customer_phone,
    email: order?.customer_email,
    amount: order?.subtotal * 100,
    publicKey: process.env.PUBLIC_KEY,
  };
  const componentProps = {
    ...config,
    onSuccess: (res) => {
      updateOrderFn();
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
