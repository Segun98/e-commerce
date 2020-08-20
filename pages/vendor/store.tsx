import React from "react";
import { request } from "graphql-request";

// export async function getStaticProps() {
//   try {
//     const res = await request("http://localhost:4000/graphql", PRODUCTS);
//     const products = await res.products;
//     return {
//       props: {
//         products,
//       },
//     };
//   } catch (error) {
//     console.log(error.message);
//     let err = error.message;
//     return {
//       props: {
//         err,
//       },
//     };
//   }
// }

const Store = () => {
  // const { data, error } = useSWR(
  //   PRODUCTS,
  //   (query) => request("http://localhost:4000/graphql", query)
  // );

  //   if (err) {
  //     console.log(err.message);
  //     return "an error occured";
  //   }

  return <div>hello</div>;
};

export default Store;
