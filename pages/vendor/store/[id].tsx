import React, { useEffect } from "react";
import { accessToken, graphQLClient } from "../../../utils/auth";
import { STORE } from "../../../graphql/vendor";

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
    let error = {
      one: err?.message,
      two: err.response?.errors[0].message,
    };
    return {
      props: {
        error,
      },
    };
  }
}
const Store = ({ data, error }) => {
  useEffect(() => {
    console.log(accessToken);
  }, []);
  if (!data) {
    return "loadinnngg..";
  }
  if (error) {
    return "custom error layout and an option to refresh...";
  }
  if (!data.id) {
    return "user does not exist";
  }
  console.log(data);
  // console.log(error);

  return <div>hello</div>;
};

export default Store;
