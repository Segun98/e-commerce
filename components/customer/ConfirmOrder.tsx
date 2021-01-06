import { useUser } from "@/Context/UserProvider";
import { Button, useToast } from "@chakra-ui/core";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import React from "react";
import { PaystackConsumer } from "react-paystack";
import { useToken } from "@/Context/TokenProvider";
import { deleteAllFromCart, updateOrder } from "@/graphql/customer";
import { MutationUpdateOrderArgs, Orders } from "@/Typescript/types";
import { useMutation } from "@/utils/useMutation";
import { graphQLClient } from "@/utils/client";

//update available quantity in stock for ordered product
const updateQuantity = gql`
  mutation updateQuantity($id: ID!, $qty_ordered: Int) {
    updateQuantity(id: $id, qty_ordered: $qty_ordered) {
      message
    }
  }
`;

interface Iprops {
  order: Orders[];
  subtotal: number;
  delivery: number;
}

export const ConfirmOrder: React.FC<Iprops> = ({
  order,
  subtotal,
  delivery,
}) => {
  const { Token } = useToken();
  const { User } = useUser();
  const toast = useToast();
  const router = useRouter();

  async function updateOrderFn(transaction_id: string) {
    const variables: MutationUpdateOrderArgs = {
      order_id: order[0].order_id,
      transaction_id,
      delivery_fee: delivery,
      total_price: subtotal,
    };

    const { data, error } = await useMutation(updateOrder, variables, Token);

    toast({
      title: "Payment Successful",
      description:
        "Your Order has been successfuly placed, track it in your Orders page",
      status: "success",
      duration: 5000,
      position: "top",
    });

    if (data) {
      //clear cart
      await useMutation(deleteAllFromCart, {}, Token);
      toast({
        title: "You are being redirected...",
        status: "info",
        duration: 3000,
        position: "top",
      });

      //update the quantity of products in stock for the ordered product(s)
      for await (const o of order) {
        try {
          await graphQLClient.request(updateQuantity, {
            id: o.product_id,
            qty_ordered: o.quantity,
          });
        } catch (err) {
          //
        }
      }

      router.push(`/customer/cart`).then(() => window.scrollTo(0, 0));
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

  let paystackAmount = delivery + subtotal;

  //PAYSTACK TEST PAYMENT
  const config = {
    reference: order && order[0]?.order_id,
    firstname: User?.first_name,
    lastname: User?.last_name,
    phone: order && order[0]?.customer_phone,
    email: order && order[0]?.customer_email,
    amount: paystackAmount * 100,
    publicKey: process.env.PUBLIC_KEY,
  };

  const componentProps = {
    ...config,
    onSuccess: (res) => {
      updateOrderFn(res.transaction);
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
