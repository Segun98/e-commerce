import React, { useState } from "react";
import { graphQLClient } from "../../utils/client";
import { PRODUCT } from "../../graphql/vendor";
import { Button, Icon, useToast } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { ProductsRes } from "../../Typescript/types";
import { Layout } from "../../components/Layout";
import { Commas } from "./../../utils/helpers";
import Link from "next/link";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";
import { useToken } from "../../Context/TokenProvider";
import Cookies from "js-cookie";
import { useMutation } from "../../utils/useMutation";
import { addToCart } from "../../graphql/customer";
import Head from "next/head";

interface err {
  message: string;
}

interface response {
  product: ProductsRes;
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
        error: err?.response?.errors[0].message || err.message,
      },
    };
  }
}
const Product = ({ product, error }: response) => {
  const toast = useToast();
  const { Token } = useToken();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const role = Cookies.get("role");

  // useEffect(() => {
  //   if (!error && !product) {
  //     router.push("/404");
  //   }
  // }, []);

  //filter out the main product
  const related = product
    ? product.related.filter((p) => p.id !== product.id)
    : [];

  const featured_images = [
    "slider/slide2.jpeg",
    "product3.png",
    "product2.png",
    "product1.png",
    "product2.png",
    "product3.png",
  ];

  async function addCart(product_id, prod_creator_id, quantity) {
    const variables = {
      product_id,
      prod_creator_id,
      quantity,
    };
    const { data, error } = await useMutation(addToCart, variables, Token);

    if (data) {
      toast({
        title: "Item Added to Cart!",
        description: `Your Item has been added to cart, proceed to checkout`,
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (error) {
      //handled this error cos chakra ui "status" should be "info"
      if (error.response?.errors[0].message === "Item is already in Cart") {
        toast({
          title: "Item is already in Cart",
          description: "Please Visit your Cart page to checkout",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      toast({
        title: "An Error occurred while adding to cart.",
        description:
          error.message === "Network request failed"
            ? "Check Your Internet Connection and Refresh"
            : role !== "customer"
            ? "You need to Login as a customer"
            : "",
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
    }
  }
  return (
    <Layout>
      <Head>
        <title>{product ? product.name : "Error"} | PartyStore</title>
      </Head>
      <div className="product-page">
        <>
          {error &&
            toast({
              title: "An error occurred.",
              description: "check your internet connection and refresh.",
              status: "error",
              duration: 7000,
              isClosable: true,
              position: "bottom",
            })}
        </>
        {!error && !product && (
          <div className="indicator">
            <strong>
              Oops!! This Product Could Not Be Found, Please Check That The URL
              is Correct
            </strong>
          </div>
        )}
        {product && (
          <main className="product">
            <div className="product-wrap">
              <div className="product-info1">
                <div className="product-img">
                  <img src="/product2.png" alt={`${product.name}`} />
                </div>
                <hr />
                <h1 className="product-name-mobile">{product.name}</h1>
                <p className="product-price-mobile">
                  &#8358; {Commas(product.price)}
                </p>
                <div className="share-section">
                  <hr />
                  <h1>Share</h1>
                  <div className="share-icons">
                    <ul>
                      <li>
                        <img src="/twitter.svg" alt="Twitter Icon" />
                      </li>
                      <li>Facebook</li>
                    </ul>
                    <hr />
                    <p>
                      <Link
                        href={`/store/${product.creator.business_name_slug}`}
                        as={`/store/${product.creator.business_name_slug}`}
                      >
                        <a>
                          Click here to visit Vendor Store{" "}
                          <Icon name="external-link" />
                        </a>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="product-info2">
                  <h1 className="product-name-desktop">{product.name}</h1>
                  <p className="product-price-desktop">
                    &#8358; {Commas(product.price)}
                  </p>
                  <div className="cart-btn">
                    <div className="qty-btn">
                      <button
                        aria-roledescription="decrement quantity"
                        onClick={() => {
                          if (quantity === 1) {
                            return;
                          }
                          setQuantity(quantity - 1);
                        }}
                      >
                        <Icon name="minus" color="black" />
                      </button>
                      <aside style={{ fontSize: "20px" }}>{quantity}</aside>
                      <button
                        aria-roledescription="increment quantity"
                        onClick={() => {
                          if (quantity === product.available_qty) {
                            return;
                          }
                          setQuantity(quantity + 1);
                        }}
                      >
                        <Icon name="small-add" color="black" size="22px" />
                      </button>
                    </div>
                    <Button
                      variantColor="blue"
                      border="none"
                      style={{ backgroundColor: "var(--deepblue" }}
                      onClick={() => {
                        if (!Token || !role) {
                          toast({
                            title: "You Need To Login To Add To Cart",
                            status: "info",
                            duration: 7000,
                            isClosable: true,
                            position: "bottom",
                          });
                          return;
                        }
                        addCart(product.id, product.creator_id, quantity);
                      }}
                    >
                      Add To Cart
                    </Button>
                  </div>
                </div>

                <div className="product-info3">
                  <h1>Product Description</h1>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </main>
        )}
        <hr />
        <section>
          <PurchaseSteps />
        </section>
        <hr />
        {product && related && (
          <section className="related-products">
            <h1>Related Products</h1>
            {/* when theres no product  */}
            {related.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <br />
                <p
                  style={{
                    fontSize: "1.2rem",
                  }}
                >
                  No Related Products...
                </p>
                <br />
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--deepblue)",
                  }}
                >
                  <Link href="/">
                    <a>
                      view products list <Icon name="external-link" />
                    </a>
                  </Link>
                </p>
              </div>
            ) : (
              <div className="related-wrap">
                {related.map((r, index) => (
                  <div className="related-item" key={r.id}>
                    <Link
                      href={`/product/${r.name_slug}`}
                      as={`/product/${r.name_slug}`}
                    >
                      <a>
                        <img
                          src={`/${featured_images[index]}`}
                          alt={`${r.name}`}
                        />
                        <hr />
                        <div className="related-desc">
                          <h2>{r.name}</h2>
                          <p>&#8358; {Commas(r.price)}</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Product;
