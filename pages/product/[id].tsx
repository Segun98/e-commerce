import React, { useEffect, useState } from "react";
import { graphQLClient } from "../../utils/client";
import { PRODUCT } from "../../graphql/vendor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Icon,
  useToast,
} from "@chakra-ui/core";
import { MutationAddToCartArgs, ProductsRes } from "../../Typescript/types";
import { Layout } from "../../components/Layout";
import { Commas } from "./../../utils/helpers";
import Link from "next/link";
import { PurchaseSteps } from "../../components/customer/PurchaseSteps";
import { useToken } from "../../Context/TokenProvider";
import Cookies from "js-cookie";
import { useMutation } from "../../utils/useMutation";
import { addToCart } from "../../graphql/customer";
import Head from "next/head";
import { cartItems } from "../../redux/features/cart/fetchCart";
import { useDispatch } from "react-redux";
import Image from "next/image";

interface response {
  product: ProductsRes;
  error: any;
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
  const role = Cookies.get("role");
  const dispatch = useDispatch();

  //Cart Qunatity
  const [quantity, setQuantity] = useState(1);
  //main image to be displayed out of all product images
  const [currentImage, setCurrentImage] = useState(0);

  const [loading, setLoading] = useState(false);
  //filter out the main product
  const related = product
    ? product.related.filter((p) => p.id !== product.id)
    : [];

  async function addCart(product_id, prod_creator_id, quantity) {
    setLoading(true);
    const variables: MutationAddToCartArgs = {
      product_id,
      prod_creator_id,
      quantity,
    };
    const { data, error } = await useMutation(addToCart, variables, Token);
    if (data) {
      setLoading(false);
      dispatch(cartItems(Token));
      toast({
        title: "Item Added to Cart!",
        description: `Your Item has been added to cart, proceed to checkout`,
        status: "success",
        duration: 7000,
      });
    }
    if (error) {
      setLoading(false);
      //handled this error cos chakra ui "status" should be "info"
      if (error.response?.errors[0].message === "Item is already in Cart") {
        toast({
          title: "Item Is Already In Cart",
          description: "Please Visit your Cart page to checkout",
          isClosable: true,
          status: "info",
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
        status: "info",
        duration: 7000,
        isClosable: true,
      });
    }
  }

  //save item to local storage for unauthorised customers
  const [savedItem, setSavedItem] = useState(storeItem);
  useEffect(() => {
    if (typeof window === "object") {
      localStorage.setItem("savedItem", JSON.stringify(savedItem));
    }
  }, [savedItem]);

  function storeItem() {
    if (typeof window === "object") {
      const SavedItem = JSON.parse(localStorage.getItem("savedItem"));
      return SavedItem || [];
    }
  }

  function addToSavedItems() {
    const newItem = {
      images: product.images[0],
      name: product.name,
      price: product.price,
      product_id: product.id,
      prod_creator_id: product.creator_id,
      name_slug: product.name_slug,
    };
    // prevent duplicates
    let exists = savedItem.filter((s) => s.product_id === product.id);
    if (exists.length === 0) {
      setSavedItem([...savedItem, newItem]);
    }
  }

  return (
    <Layout>
      <Head>
        <title>{product ? product.name : "Error"} | PartyStore</title>
        <meta name="keywords" content={product.name} />
        <meta name="author" content={product.creator.business_name} />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:image" content={product.images[0]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://partystore.vercel.app/product/${product.name_slug}`}
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:site_name" content={product.name} />
        <link
          rel="canonical"
          href={`https://partystore.vercel.app/product/${product.name_slug}`}
        />
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        ></script>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v7.0"
        ></script>
      </Head>
      <div className="product-page">
        <>
          {error &&
            toast({
              title: "An error occurred.",
              description: "check your internet connection and refresh.",
              status: "error",
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
            <div className="bread-crumb">
              <Breadcrumb
                separator={<Icon color="gray.300" name="chevron-right" />}
              >
                <BreadcrumbItem>
                  <Link href="/">
                    <a>Home</a>
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Link href={`/party?category=${product.party_category}`}>
                    <a>{product.party_category}</a>
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <Link href={`/category?category=${product.category}`}>
                    <a>{product.category}</a>
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>{product.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
            <div className="product-wrap">
              <div className="product-info1">
                <div className="product-img">
                  <img
                    src={product.images[currentImage]}
                    alt={`${product.name}`}
                  />
                </div>
                <hr />
                <h1 className="product-name-mobile">{product.name}</h1>
                <p className="product-price-mobile">
                  &#8358; {Commas(product.price)}
                </p>
                <hr />
                <div className="more-images">
                  {product.images.map((i, index) => (
                    <img
                      key={index}
                      src={`${i}`}
                      alt={`Image ${index}`}
                      width="65"
                      height="60"
                      loading="lazy"
                      role="button"
                      onClick={() => {
                        setCurrentImage(index);
                      }}
                    />
                  ))}
                </div>
                <div className="share-section">
                  <hr />
                  <h1>Share</h1>
                  <div className="share-icons">
                    <ul>
                      <li role="button">
                        <a
                          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                          className="twitter-share-button"
                          data-size="small"
                          data-show-count="false"
                        >
                          <img src="/twitter.svg" alt="Twitter Icon" />
                        </a>
                      </li>
                      <li role="button">
                        <div
                          className="fb-share-button"
                          data-href="https://developers.facebook.com/docs/plugins/"
                          data-layout="button"
                          data-size="small"
                        >
                          <a
                            target="_blank"
                            href={`https://www.facebook.com/sharer/sharer.php?u=https://partystore.vercel.app/product/${product.name_slug}`}
                            className="fb-xfbml-parse-ignore"
                          >
                            <img src="/facebook.svg" alt="Facebook Icon" />
                          </a>
                        </div>
                      </li>
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
                        aria-label="decrement quantity"
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
                        aria-label="increment quantity"
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
                      isLoading={loading ? true : false}
                      style={{ backgroundColor: "var(--deepblue" }}
                      onClick={() => {
                        if (!Token || !role || role === "vendor") {
                          addToSavedItems();
                          toast({
                            title: "Your Item Has Been Saved!",
                            description:
                              "Find It In Your Account Page After You LogIn",
                            status: "info",
                            duration: 7000,
                            position: "bottom",
                            isClosable: true,
                          });
                          return;
                        }
                        if (product.in_stock === "false") {
                          addToSavedItems();
                          toast({
                            title: "This Product is Currently Out of Stock!",
                            description:
                              "It has been added to Saved Items in your Account page",
                            status: "info",
                            duration: 5000,
                            position: "bottom",
                            isClosable: true,
                          });
                          return;
                        }
                        if (product.creator.online === "false") {
                          addToSavedItems();
                          toast({
                            title: "The Vendor is Currently OFFLINE",
                            description:
                              "This Item Has Been Saved In Your Account Page. Please Try Again Later",
                            status: "info",
                            duration: 5000,
                            position: "bottom",
                            isClosable: true,
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
                  <Link href="/category?category=Props">
                    <a>
                      suggested category <Icon name="external-link" />
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
                        <img src={r.images[0]} alt={`${r.name}`} />
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
      <style jsx>{`
        button {
          border: none;
        }
        .bread-crumb {
          width: 90%;
          margin: 0 auto 5px auto;
        }
        @media only screen and (min-width: 1000px) {
          .bread-crumb {
            width: 70%;
            margin-bottom: 10px;
          }
        }

        @media only screen and (min-width: 1400px) {
          .bread-crumb {
            width: 60%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Product;
