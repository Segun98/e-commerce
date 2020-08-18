import React from "react";
import { request } from "graphql-request";
import useSWR from "swr";

const PRODUCTS = `
  {
    products {
        id
      name
      name_slug
      creator {
        business_name
        first_name
        email
      }
    }
  }
`;
export async function getStaticProps() {
  try {
    const res = await request("http://localhost:4000/graphql", PRODUCTS);
    const products = await res.products;
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.log(error.message);
    let err = error.message;
    return {
      props: {
        err,
      },
    };
  }
}

const Test = ({ products, err }) => {
  // const { data, error } = useSWR(
  //   PRODUCTS,
  //   (query) => request("http://localhost:4000/graphql", query)
  // );

  if (err) {
    console.log(err.message);
    return "an error occured";
  }

  return (
    <div>
      {products.map((p) => (
        <ul key={p.id}>
          <li>{p.name}</li>
          <li>{p.name_slug}</li>
          <li>{p.creator.email}</li>
        </ul>
      ))}
    </div>
  );
};

export default Test;
