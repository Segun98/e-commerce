import React, { useEffect } from "react";
import { STORE } from "../../graphql/vendor";
import { useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { UsersRes } from "../../Typescript/types";
import Head from "next/head";
import { graphQLClient } from "../../utils/client";

interface Iprops {
  data: UsersRes;
  error: any;
}
export async function getServerSideProps({ params, req }) {
  //the whole point of this is to always get a value in jwt signed from the backend to acsertain if the person visiting this page is the owner of the store

  //Note: i couldn't fetch in the component because populating the "Head" tag would be impossible

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
        error: err?.response?.errors[0].message || err.message,
      },
    };
  }
}
const Store = ({ data, error }: Iprops) => {
  const toast = useToast();
  const router = useRouter();

  // useEffect(() => {
  //   if ((data && !data.id) || error === "404") {
  //     router.push("/404");
  //   }
  // }, [data, error]);

  return (
    <div>
      <Head>
        <title>{data ? data.business_name : "Error"} | PartyStore</title>
        <meta name="description" content={data ? data.business_name : ""} />
      </Head>
      {error &&
        error !== "404" &&
        toast({
          title: "An error occurred.",
          description: "check your internet connection and refresh.",
          status: "error",
          duration: 7000,
          isClosable: true,
          position: "top",
        })}

      {error === "404" && (
        <div className="indicator">
          <strong>
            Oops!! This Page Could Not Be Found, Please Check The URL
          </strong>
        </div>
      )}
      <section>
        {data && (
          <ul>
            <li>{data.id}</li>
            <li>JWT ID: {data.jwt_user_id}</li>
            <li>{data.email}</li>
            <li>{data.role}</li>
            <li>{data.phone}</li>
            <li>{data.pending}</li>
            <li>{data.business_name}</li>
            <li>{data.business_address}</li>
            <li>{data.business_area}</li>
            <li>{data.business_image}</li>
            <li>{data.business_bio}</li>
          </ul>
        )}
      </section>
      <br />
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
              <br />
            </div>
          ))}
      </section>
    </div>
  );
};

export default Store;
