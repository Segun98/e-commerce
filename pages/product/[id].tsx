import React, { useEffect } from "react";
import { graphQLClient } from "../../utils/client";
import { PRODUCT } from "../../graphql/vendor";
import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { Iproduct } from "../../Typescript/product";

interface err {
  message: string;
}

interface response {
  data: Iproduct;
  error: err;
}

export async function getServerSideProps({ params }) {
  const variables = {
    name_slug: params.id,
  };
  try {
    const res = await graphQLClient.request(PRODUCT, variables);
    const data = await res.product;
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
const Product = ({ data, error }: response) => {
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.push("/404");
    }
  }, []);
  console.log(data);

  return (
    <div>
      {error &&
        toast({
          title: "An error occurred.",
          description: "check your internet connection and refresh.",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        })}

      <section>
        {data && (
          <div key={data.id}>
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
  );
};

export default Product;
