import React, { useEffect } from "react";
import { graphQLClient } from "../../utils/client";
import { PRODUCT } from "../../graphql/vendor";
import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { ProductsRes } from "../../Typescript/types";
import { Layout } from "../../components/Layout";
import queryFunc from "../../utils/fetcher";
import useSwr, { responseInterface } from "swr";

interface err {
  message: string;
}

interface response {
  data: ProductsRes;
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
const Product = ({ product, error }) => {
  const toast = useToast();
  const router = useRouter();

  const { data }: responseInterface<ProductsRes, any> = useSwr("PRODUCT", {
    initialData: product,
  });

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
          {data && (
            <div>
              <div>{data.name}</div>
              <div>{data.name_slug}</div>
              <div>{data.price}</div>
              <div>{data.in_stock}</div>
              <div>Qty: {data.available_qty}</div>
              <div>{data.image}</div>
              <div>{data.category}</div>
              <div>{data.description}</div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Product;
