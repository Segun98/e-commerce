import React, { useEffect } from "react";
import { Button, useToast } from "@chakra-ui/core";
import { PRODUCT } from "./../graphql/vendor";
import { graphQLClient } from "../utils/client";
import { useAuth } from "../Context/AuthProvider";
import { addToCart } from "../graphql/customer";

interface response {
  data: Array<product>;
  error: err;
}
interface err {
  message: string;
}
interface product {
  id: string;
  name: string;
  name_slug: string;
  description: string;
  price: string;
  category: string;
  image: string;
  in_stock: string;
  creator_id: string;
}
export async function getServerSideProps() {
  try {
    const res = await graphQLClient.request(PRODUCT);
    const data = await res.products;
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err?.message,
      },
    };
  }
}
const Home = ({ data, error }: response) => {
  const { Token } = useAuth();
  const toast = useToast();
  // console.log(data);

  async function addCart(product_id, prod_creator_id) {
    const variables = {
      product_id,
      prod_creator_id,
    };
    try {
      graphQLClient.setHeader("authorization", `Bearer ${Token}`);
      const res = await graphQLClient.request(addToCart, variables);
      console.log(res);
    } catch (err) {
      // console.log(err?.message);
      if (err.response?.errors[0].message === "jwt must be provided") {
        alert("you need to login first");
      }
      console.log(err.response?.errors[0].message);
    }
  }
  return (
    <div>
      <>
        {error &&
          toast({
            title: "An error occurred.",
            description: "check your internet connection and refresh.",
            status: "error",
            duration: 7000,
            isClosable: true,
            position: "top",
          })}
      </>
      <div>
        {error && (
          <div className="indicator">
            <p>An Error Occurred, Don't Fret,</p>
            <Button variantColor="green">Refresh Page</Button>
          </div>
        )}
      </div>
      <main>
        {data &&
          data.map((p) => (
            <div key={p.id}>
              <div>{p.name}</div>
              <div>{p.name_slug}</div>
              <div>{p.creator_id}</div>
              <Button
                variantColor="yellow"
                onClick={() => {
                  addCart(p.id, p.creator_id);
                }}
              >
                Add to Cart
              </Button>
              <br />
            </div>
          ))}
      </main>
    </div>
  );
};

export default Home;
