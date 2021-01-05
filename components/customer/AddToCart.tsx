import React, { useEffect, useState } from "react";
import { MutationAddToCartArgs, ProductsRes } from "@/Typescript/types";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useToken } from "@/Context/TokenProvider";
import { Button, useToast } from "@chakra-ui/core";
import { useMutation } from "@/utils/useMutation";
import { addToCart } from "@/graphql/customer";
import { cartItems } from "@/redux/features/cart/fetchCart";
import { useRouter } from "next/router";

interface Iprops {
  product: ProductsRes;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  quantity: number;
}
export const AddToCart: React.FC<Iprops> = ({
  product,
  loading,
  setLoading,
  quantity,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { Token } = useToken();
  const role = Cookies.get("role");
  const dispatch = useDispatch();

  //add to cart
  async function addCart(product_id, prod_creator_id, quantity) {
    setLoading(true);
    const variables: MutationAddToCartArgs = {
      product_id,
      prod_creator_id,
      quantity,
    };
    const { data, error } = await useMutation(addToCart, variables, Token);
    if (data) {
      setLoading(false);
      dispatch(cartItems(Token));
      toast({
        title: "Item Added to Cart!",
        description: `Your Item has been added to cart, proceed to checkout`,
        status: "success",
        duration: 7000,
      });
      router.push("/customer/cart").then(() => window.scrollTo(0, 0));
    }
    if (error) {
      setLoading(false);
      //handled this error cos chakra ui "status" should be "info"
      if (error.response?.errors[0].message === "Item is already in Cart") {
        toast({
          title: "Item Is Already In Cart",
          description: "Redirecting to cart...",
          isClosable: true,
          status: "info",
        });
        router.push("/customer/cart").then(() => window.scrollTo(0, 0));

        return;
      }
      toast({
        title: "An Error occurred while adding to cart.",
        description:
          error.message === "Network request failed"
            ? "Check Your Internet Connection and Refresh"
            : role !== "customer"
            ? "You need to Login as a customer"
            : "",
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
    <Button
      variantColor="blue"
      border="none"
      isLoading={loading ? true : false}
      style={{ backgroundColor: "var(--deepblue" }}
      onClick={() => {
        if (!Token || !role || role === "vendor") {
          addToSavedItems();
          toast({
            title: "Your Item Has Been Saved!",
            description: "Find It In Your Account Page After You LogIn",
            status: "info",
            duration: 9000,
            position: "top",
            isClosable: true,
          });
          setTimeout(() => {
            router.push(`/customer/login`).then(() => window.scrollTo(0, 0));
          }, 1500);
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
        if (product.creator.online === "false") {
          addToSavedItems();
          toast({
            title: "The Vendor is Currently OFFLINE",
            description:
              "This Item Has Been Saved In Your Account Page. Please Try Again Later",
            status: "info",
            duration: 5000,
            position: "bottom",
            isClosable: true,
          });
          return;
        }
        addCart(product.id, product.creator_id, quantity);
      }}
    >
      Add To Cart
    </Button>
  );
};
