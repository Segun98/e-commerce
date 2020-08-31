import React, { useEffect } from "react";
import { graphQLClient } from "../../utils/client";
import { STORE } from "../../graphql/vendor";
import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";

interface response {
  data: user;
  error: err;
}
interface err {
  message: string;
}
interface user {
  id: string;
  email: string;
  role: string;
  phone: string;
  pending: string;
  business_name: string;
  business_address: string;
  business_area: string;
  business_image: string;
  business_bio: string;
  jwt_user_id: string;
  usersProducts: [product];
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
}
export async function getServerSideProps({ params, req }) {
  //the whole point of this is to always get a value in jwt signed from the backend to acsertain if the person visiting this page is the owner of the store
  //custom method i wrote to get the token from cookies
  let c = [];
  //only run if theres a cookie in header
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split("; ");

    //loop to get the exact cookie "ecom"
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].split("=")[0] === "ecom") {
        c.push(cookies[i]);
        break;
      }
    }
    //get the cookie value which is accesstoken
    if (c[0]) {
      var cookie = c[0].split("=")[1];
    }
  }

  const variables = {
    business_name_slug: params.id,
  };
  graphQLClient.setHeader("authorization", `bearer ${cookie}`);
  try {
    const res = await graphQLClient.request(STORE, variables);
    const data = await res.user;
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
const Store = ({ data, error }: response) => {
  const toast = useToast();
  const router = useRouter();

  // console.log(data);

  useEffect(() => {
    if (data && !data.id) {
      router.push("/404");
    }
  }, []);

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
          <ul>
            <li>{data.id}</li>
            <li>{data.email}</li>
            <li>{data.role}</li>
            <li>{data.phone}</li>
            <li>{data.pending}</li>
            <li>{data.business_name}</li>
            <li>{data.business_address}</li>
            <li>{data.business_area}</li>
            <li>{data.business_image}</li>
            <li>{data.business_bio}</li>
            <li>{data.jwt_user_id}</li>
          </ul>
        )}
      </section>

      <section>
        {data &&
          data.usersProducts.map((d) => (
            <div key={d.id}>
              <div>{d.name}</div>
              <div>{d.name_slug}</div>
              <div>{d.price}</div>
              <div>{d.in_stock}</div>
              <div>{d.image}</div>
              <div>{d.category}</div>
              <div>{d.description}</div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Store;
