import { STORE } from "../../graphql/vendor";
import Link from "next/link";
import { Icon, useToast } from "@chakra-ui/core";
import { MutationDeleteProductArgs, UsersRes } from "../../Typescript/types";
import Head from "next/head";
import { graphQLClient } from "../../utils/client";
import { Navigation } from "../../components/vendor/Navigation";
import { Commas } from "../../utils/helpers";
import { Footer } from "../../components/Footer";
import { useMutation } from "../../utils/useMutation";
import { useRouter } from "next/router";
import { useToken } from "../../Context/TokenProvider";

interface Iprops {
  data: UsersRes;
  error: any;
}
export async function getServerSideProps({ params, req }) {
  //the whole point of this is to pass a token to the header to get a value in jwt from the backend inorder to acsertain if the person visiting this page is the owner of the store

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
  //from context
  const { Token } = useToken();
  const images = [
    "slider/slide2.jpeg",
    "product3.png",
    "product4.png",
    "product2.png",
    "product1.png",
    "product2.png",
    "product3.png",
  ];

  // Delete Product

  const handleDelete = async (id, creator_id, name) => {
    const variables: MutationDeleteProductArgs = {
      id,
      creator_id,
    };

    const deleteProduct = `
    mutation deleteProduct
    ($id:ID!, $creator_id: String!){
  deleteProduct(id:$id, creator_id:$creator_id){
    message
  }
}`;

    if (
      window.confirm(`Are you sure you want to Delete This Product : ${name} ?`)
    ) {
      const { data, error } = await useMutation(
        deleteProduct,
        variables,
        Token
      );

      if (data) {
        toast({
          title: "Your Product Has Been Deleted",
          status: "success",
          duration: 5000,
        });
        router.reload();
      }
      if (error) {
        toast({
          title: "An Error Ocurred",
          description: error.response?.errors[0].message
            ? error.response?.errors[0].message
            : "An error occurred, check your internet connection",
          status: "error",
        });
      }
    }
  };

  return (
    <div className="store-page">
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
      {!error && data && (
        <div className="store-page-wrap">
          <Navigation />
          <section className="main-store">
            <header>
              <div>
                <div className="store-name">
                  <Icon name="info" /> {data.business_name}
                </div>
                <div className="store-bio">
                  <Icon name="settings" />{" "}
                  {data.business_bio ||
                    "We seek to provide quality product and service to our customers. At " +
                      data.business_name +
                      ", customers come first"}
                </div>
                <div className="store-location">
                  <Icon name="check" />{" "}
                  {data.business_address || "This Store's Address"}
                </div>
              </div>
              {/* ONLY SHOW EDIT BUTTON TO STORE OWNER */}
              <div>
                {data && data.id === data.jwt_user_id ? (
                  <div className="edit-btn">
                    <button
                      style={{
                        color: "var(--deepblue)",
                        fontWeight: "bold",
                      }}
                    >
                      <Link href="/vendor/account">
                        <a>
                          <Icon name="edit" />
                        </a>
                      </Link>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </header>
            <hr />
            <div className="store-products">
              <div className="store-products_head">
                {/* <Input
                  type="search"
                  width="300px"
                  placeholder={`Search ${data.business_name}' Products`}
                /> */}
                <h1>{data && data.usersProducts.length} Products In Store</h1>
              </div>
              <div className="store-products_wrap">
                {data &&
                  data.usersProducts.map((p, index) => (
                    <div className="store-item" key={p.id}>
                      <Link
                        href={`/product/${p.name_slug}`}
                        as={`/product/${p.name_slug}`}
                      >
                        <a>
                          <img src={`/${images[index]}`} alt={`${p.name}`} />
                          <hr />
                          <div className="store-desc">
                            <h2>{p.name}</h2>
                            <p>&#8358; {Commas(p.price)}</p>
                          </div>
                        </a>
                      </Link>

                      {/* ONLY SHOW EDIT BUTTON TO STORE OWNER */}

                      {data && data.id === data.jwt_user_id ? (
                        <div className="edit-btn">
                          <button
                            style={{
                              color: "var(--deepblue)",
                              fontWeight: "bold",
                            }}
                          >
                            <Link href={`/store/edit/${p.id}`}>
                              <a>
                                <Icon name="edit" />
                              </a>
                            </Link>
                          </button>
                          <br />
                          <button
                            onClick={() =>
                              handleDelete(p.id, p.creator_id, p.name)
                            }
                          >
                            <Icon name="delete" />
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </div>
      )}
      <section style={{ background: "white" }}>
        <Footer />
      </section>
    </div>
  );
};

export default Store;
