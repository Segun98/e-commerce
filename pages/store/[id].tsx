import { STORE } from "../../graphql/vendor";
import Link from "next/link";
import { Icon, useToast } from "@chakra-ui/core";
import { UsersRes } from "../../Typescript/types";
import Head from "next/head";
import { graphQLClient } from "../../utils/client";
import { Navigation } from "../../components/vendor/Navigation";
import { Footer } from "../../components/Footer";
import { MainStore } from "../../components/vendor/MainStore";

interface Iprops {
  user: UsersRes;
  error: any;
}
export async function getServerSideProps({ params, req }) {
  //the whole point of this is to pass a token to the request header to get a value in jwt from the backend, that jwt value tells me who the store owner is.

  //Note: i couldn't fetch directly in the component because populating the "Head" tag would be impossible as fetching would not happen at build time

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
    const user = await res.user;
    return {
      props: {
        user,
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

const Store = ({ user, error }: Iprops) => {
  const toast = useToast();

  return (
    <div className="store-page">
      <Head>
        <title>{user ? user.business_name : "Error"} | PartyStore</title>
        <meta name="description" content={user ? user.business_name : ""} />
        <script
          async
          src="https://kit.fontawesome.com/c772bfb479.js"
          crossOrigin="anonymous"
        ></script>
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

      <div className="store-page-wrap">
        <Navigation />
        {/* store doesn't exist */}
        {error === "404" && (
          <div className="indicator">
            <div className="status">
              Oops!! This store could not be found, please ensure the URL is
              correct.{" "}
              <Link href="/stores">
                <a style={{ color: "lightgreen", textDecoration: "underline" }}>
                  Explore Stores <Icon name="external-link" />{" "}
                </a>
              </Link>
            </div>
          </div>
        )}
        {!user && <p className="space"></p>}

        {/* USER/STORE IS PENDING  */}
        {!error && user && user.pending === "true" ? (
          <div className="indicator">
            <div className="status">
              {/* Display different messages to the public and store owner  */}
              {user && user.jwt_user_id === user.id
                ? "Your Profile Is Currently Under Review. Please, Fill Out Your Profile Information In Your ACCOUNT PAGE for a Quick Review"
                : "This Store Is Currently Under Review"}
            </div>
          </div>
        ) : //ELSE IF USER IS NOT PENDING, CHECK IF THEY ARE ONLINE
        !error && user && user.online === "true" ? (
          <MainStore user={user} />
        ) : (
          //OFFLINE SCREEN
          <div className="indicator" style={{ display: error ? "none" : "" }}>
            <div className="status">
              {user && user.jwt_user_id === user.id ? (
                "You are currently OFFLINE, you will no longer recieve any orders. Visit your account page to return ONLINE"
              ) : (
                <div>
                  This Store is currently OFFLINE,{" "}
                  <Link href="/stores">
                    <a
                      style={{
                        color: "lightgreen",
                        textDecoration: "underline",
                      }}
                    >
                      Explore Stores <Icon name="external-link" />{" "}
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <section style={{ background: "white" }}>
        <Footer />
      </section>
      <style jsx>{`
        .indicator {
          margin: auto;
          width: 90%;
        }
        .status {
          background: var(--deepblue);
          padding: 10px;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
        }
        @media only screen and (min-width: 700px) {
          .indicator {
            width: 70%;
          }
        }
      `}</style>
    </div>
  );
};

export default Store;
