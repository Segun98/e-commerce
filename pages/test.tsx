import React from "react";
import { request } from "graphql-request";

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
export async function getServerSideProps() {
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

const Test = ({ products, err }: any) => {
  if (err) {
    console.log(err);
    return "an error occurred";
  }
  console.log(products);
  console.log(products[0].creator);

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
