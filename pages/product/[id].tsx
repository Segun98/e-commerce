import React, { useEffect } from "react";
import { graphQLClient } from "../../utils/client";
import { PRODUCT } from "../../graphql/vendor";
import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { ProductsRes } from "../../Typescript/types";
import { Layout } from "../../components/Layout";

interface err {
  message: string;
}

interface response {
  product: ProductsRes;
  error: err;
}

export async function getServerSideProps({ params }) {
  const variables = {
    name_slug: params.id,
  };
  try {
    const res = await graphQLClient.request(PRODUCT, variables);
    const product = await res.product;
    return {
      props: {
        product,
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
const Product = ({ product, error }: response) => {
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!product) {
      router.push("/404");
    }
  }, []);

  return (
    <Layout>
      <div>
        {error &&
          toast({
            title: "An error occurred.",
            description: "check your internet connection and refresh.",
            status: "error",
            duration: 7000,
            isClosable: true,
            position: "bottom",
          })}

        <section>
          {product && (
            <div>
              <div>{product.name}</div>
              <div>{product.name_slug}</div>
              <div>{product.price}</div>
              <div>{product.in_stock}</div>
              <div>Qty: {product.available_qty}</div>
              <div>{product.image}</div>
              <div>{product.category}</div>
              <div>{product.description}</div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Product;
