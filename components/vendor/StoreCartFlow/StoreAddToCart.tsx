import React, { useEffect, useState } from "react";
import { MutationAddToCartArgs, ProductsRes } from "@/Typescript/types";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useToken } from "@/Context/TokenProvider";
import { Icon, useToast } from "@chakra-ui/core";
import { useMutation } from "@/utils/useMutation";
import { addToCart } from "@/graphql/customer";
import { cartItems } from "@/redux/features/cart/fetchCart";
import { v4 as uuidv4 } from "uuid";

interface Iprops {
  onOpen: any;
  product: ProductsRes;
}
export const StoreAddToCart: React.FC<Iprops> = ({ product, onOpen }) => {
  const toast = useToast();
  const { Token } = useToken();
  const role = Cookies.get("role");
  const dispatch = useDispatch();

  //add to cart
  async function addCart(
    product_id: string,
    prod_creator_id: string,
    quantity: number
  ) {
    //generate customer id
    let customer_id = "";
    const check = Cookies.get("customer_id");
    if (check) {
      customer_id = check;
    } else {
      customer_id = uuidv4();

      Cookies.set("customer_id", customer_id, {
        expires: 365,
      });
    }

    const variables: MutationAddToCartArgs = {
      customer_id,
      product_id,
      prod_creator_id,
      quantity,
    };

    const { data, error } = await useMutation(addToCart, variables, Token);
    if (data) {
      dispatch(cartItems({ customer_id: Cookies.get("customer_id") }));
      toast({
        title: "Item Added to Cart!",
        description: `Your Item has been added to cart, proceed to checkout`,
        status: "success",
        duration: 5000,
        position: "top",
      });
      onOpen();
    }
    if (error) {
      //handled this error cos chakra ui "status" should be "info"
      if (error.response?.errors[0].message === "Item is already in Cart") {
        toast({
          title: "Item Is Already In Cart",
          isClosable: true,
          status: "info",
        });
        onOpen();
        return;
      }
      toast({
        title: "An Error occurred while adding to cart.",
        description: "Check Your Internet Connection and Refresh",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
    }
  }

  //save item to local storage for unauthorised customers
  const [savedItem, setSavedItem] = useState(storeItem);
  useEffect(() => {
    if (typeof window === "object") {
      localStorage.setItem("savedItem", JSON.stringify(savedItem));
    }
  }, [savedItem]);

  function storeItem() {
    if (typeof window === "object") {
      const SavedItem = JSON.parse(localStorage.getItem("savedItem"));
      return SavedItem || [];
    }
  }

  function addToSavedItems() {
    const newItem = {
      images: product.images[0],
      name: product.name,
      price: product.price,
      product_id: product.id,
      prod_creator_id: product.creator_id,
      name_slug: product.name_slug,
    };
    // prevent duplicates
    let exists = savedItem.filter((s) => s.product_id === product.id);
    if (exists.length === 0) {
      setSavedItem([...savedItem, newItem]);
    }
  }

  return (
    <button
      aria-label="add to cart"
      onClick={() => {
        if (role === "vendor") {
          addToSavedItems();
          toast({
            title: "Please login as a customer to use cart",
            status: "info",
          });
          return;
        }

        if (product.in_stock === "false") {
          addToSavedItems();
          toast({
            title: "This Product is Currently Out of Stock!",
            description:
              "It has been added to Saved Items in your Account page",
            status: "info",
            duration: 5000,
            position: "bottom",
            isClosable: true,
          });
          return;
        }

        addCart(product.id, product.creator_id, 1);

        onOpen();
      }}
    >
      <Icon name="small-add" color="black" size="22px" />
    </button>
  );
};
