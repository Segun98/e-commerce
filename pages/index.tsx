import React from "react";
import { Button, useToast } from "@chakra-ui/core";
import { PRODUCTS } from "./../graphql/vendor";
import { graphQLClient } from "../utils/client";
import { useAuth } from "../Context/AuthProvider";
import { addToCart } from "../graphql/customer";
import Cookies from "js-cookie";
import { ProductsRes } from "../Typescript/types";
import Link from "next/link";
import { useQuery } from "./../components/useQuery";

const Home = () => {
  let role = Cookies.get("role");
  const { Token } = useAuth();
  const toast = useToast();

  const [data, loading, error] = useQuery(PRODUCTS);
  let res = data ? data.products : undefined;

  async function addCart(product_id, prod_creator_id) {
    const variables = {
      product_id,
      prod_creator_id,
    };
    try {
      graphQLClient.setHeader("authorization", `Bearer ${Token}`);
      const res = await graphQLClient.request(addToCart, variables);
      // console.log(res);
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
      {loading && "loading..."}
      <main>
        {res &&
          res.map((p: ProductsRes) => (
            <div key={p.id}>
              <div>
                <strong>PRODUCT NAME:</strong>
                {p.name}
              </div>
              <div>
                <Link
                  href={`/product/${p.name_slug}`}
                  as={`/product/${p.name_slug}`}
                >
                  <a>Visit Product Page</a>
                </Link>
              </div>
              <div>
                <strong>Creator ID:</strong>
                {p.creator_id}
              </div>
              <div>
                <strong>Available Qty:</strong> {p.available_qty}
              </div>
              <div>
                <strong>in stock:</strong> {p.in_stock}
              </div>
              <Button
                variantColor="yellow"
                onClick={() => {
                  if (role !== "customer") {
                    alert("you need to login");
                    return;
                  }
                  addCart(p.id, p.creator_id);
                }}
              >
                Add to Cart
              </Button>
              <br />
              <br />
            </div>
          ))}
      </main>
    </div>
  );
};

export default Home;
