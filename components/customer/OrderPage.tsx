import React from "react";
import { Orders } from "@/Typescript/types";
import {
  Commas,
  differenceBetweenDates,
  nairaSign,
  screenWidth,
} from "@/utils/helpers";
import { useMutation } from "@/utils/useMutation";
import { gql } from "graphql-request";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useToast,
  Text,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import { mutate } from "swr";

interface Props {
  lookup: any;
  Token: string;
}

export const OrderPage: React.FC<Props> = ({ lookup, Token }) => {
  const toast = useToast();
  const router = useRouter();

  //cancel order
  async function handleOrderCancel(order_id: string) {
    const cancelOrder = gql`
      mutation cancelOrder($order_id: ID!, $canceled_reason: String) {
        cancelOrder(order_id: $order_id, canceled_reason: $canceled_reason) {
          message
        }
      }
    `;

    let answer = window.prompt(
      `Please Tell Us Why You wish to cancel This Order`
    );
    if (answer) {
      const { data, error } = await useMutation(
        cancelOrder,
        { order_id, canceled_reason: answer },
        Token
      );

      if (data) {
        mutate(`getCustomerOrders`);
        toast({
          title: "Order Has Been Cancelled",
          status: "info",
          position: "top",
        });
      }
      if (error) {
        let msg = error.response.errors[0].message || error.message;
        toast({
          title: "Error Cancelling Order",
          description: msg,
          status: "error",
          position: "top",
        });
      }
    }
  }

  //Parse Date
  function toDate(d: string) {
    let date = new Date(parseInt(d));
    let format = new Intl.DateTimeFormat("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    return format || date.toLocaleString();
  }

  //disable order return button if after 3 days of order reciept
  function disableReturnOrder(date: string) {
    //if no delivery date (order is most likely still in transit or was canceled before delivery)
    if (!date) {
      return true;
    }

    let day = differenceBetweenDates(date);

    if (day > 2) {
      return true;
    }
    return false;
  }

  return (
    <div>
      <div className="order-head">
        <p>Products</p>
        <p>Status</p>
        <p>Date</p>
        <p>More</p>
      </div>

      {Object.keys(lookup).map((o, i) => (
        <section key={o} className="orders-wrap">
          <div className="order-details">
            <div className="order-product-info">
              {lookup[o].map((o: Orders, i) => (
                <div key={i}>
                  <h1>
                    &#8226; {o.name} x{o.quantity} -
                    <span style={{ color: "var(--deepblue)" }}>
                      {" "}
                      {nairaSign} {Commas(o.subtotal)}
                    </span>
                    {o.request && (
                      <div>
                        <br />
                        <h2 style={{ color: "var(--deepblue)" }}>
                          {" "}
                          &#8226; Request{" "}
                        </h2>
                        <p>{o.request}</p>
                      </div>
                    )}
                  </h1>
                </div>
              ))}
            </div>
            <p>
              {/* Canceled status  */}
              {lookup[o][0].orderStatus.canceled === "true" ? "Cancelled" : ""}

              {/* processing  */}
              {lookup[o][0].orderStatus.delivered === "false" &&
              lookup[o][0].orderStatus.in_transit === "false" &&
              lookup[o][0].orderStatus.canceled === "false"
                ? "Processing"
                : ""}

              {/* delivered shows "delivered", else in transit */}
              {lookup[o][0].orderStatus.delivered === "true"
                ? "delivered"
                : lookup[o][0].orderStatus.in_transit === "true"
                ? "In Transit"
                : ""}
            </p>
            <p>{toDate(lookup[o][0].created_at)}</p>
            <p>
              <Popover placement="left" usePortal={true}>
                <PopoverTrigger>
                  <Button
                    size="xs"
                    rightIcon="chevron-down"
                    style={{
                      background: "var(--deepblue)",
                      color: "white",
                    }}
                  >
                    More
                  </Button>
                </PopoverTrigger>
                <PopoverContent zIndex={4}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    <div
                      style={{
                        fontSize: screenWidth() > 700 ? "0.9rem" : "0.8rem",
                      }}
                    >
                      Order ID:{" "}
                      <Text as="span" color="var(--deepblue)">
                        {o}
                      </Text>
                    </div>
                  </PopoverHeader>
                  <PopoverBody>
                    <div
                      style={{
                        fontSize: screenWidth() > 700 ? "0.9rem" : "0.8rem",
                      }}
                    >
                      Total: {Commas(lookup[o][0].orderStatus.total_price)} |
                      Delivery Fee:{" "}
                      {Commas(lookup[o][0].orderStatus.delivery_fee)} |
                      Subtotal:{" "}
                      {Commas(
                        lookup[o][0].orderStatus.total_price +
                          lookup[o][0].orderStatus.delivery_fee
                      )}
                    </div>

                    {/* buttons  */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Button
                        background="red"
                        color="white"
                        isDisabled={
                          lookup[o][0].orderStatus.canceled === "true" ||
                          lookup[o][0].orderStatus.in_transit === "true" ||
                          lookup[o][0].orderStatus.delivered === "true"
                            ? true
                            : false
                        }
                        onClick={() => handleOrderCancel(o)}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="var(--deepblue)"
                        isDisabled={
                          disableReturnOrder(
                            lookup[o][0].orderStatus.created_at
                          ) || lookup[o][0].orderStatus.canceled === "true"
                        }
                        onClick={() =>
                          router.push(
                            `/customer?returnId=${lookup[o][0].orderStatus.order_id}`
                          )
                        }
                      >
                        Return
                      </Button>
                    </div>
                  </PopoverBody>
                  <PopoverFooter fontSize="0.8rem">
                    Orders are fulfilled within 2-4 days of placement{" "}
                    {lookup[o][0].orderStatus.delivered === "true"
                      ? `| Delivered: ${toDate(
                          lookup[o][0].orderStatus.delivery_date
                        )}`
                      : ""}
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </p>
          </div>
          <hr />
        </section>
      ))}

      <style jsx>{`
        .order-head {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          color: var(--deepblue);
          font-weight: bold;
          place-items: center;
        }

        .orders-wrap {
          font-size: 0.9rem;
        }
        .order-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin: 20px 0;
          gap: 10px;
          overflow: auto;
          place-items: center;
        }

        .order-product-info {
          display: grid;
          grid-template-columns: 1fr;
          gap: 5px;
        }

        @media only screen and (min-width: 1000px) {
          .orders-wrap {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};
