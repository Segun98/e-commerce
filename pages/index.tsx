import React, { useEffect, useRef } from "react";
import { Button, Icon, useToast } from "@chakra-ui/core";
import { PRODUCTS } from "./../graphql/vendor";
import { useToken } from "../Context/TokenProvider";
import { addToCart } from "../graphql/customer";
import { ProductsRes } from "../Typescript/types";
import Link from "next/link";
import { useMutation } from "../utils/useMutation";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import useSwr from "swr";
import queryFunc from "../utils/fetcher";
import { Layout } from "../components/Layout";
import Carousel from "react-bootstrap/Carousel";
import { Commas } from "../utils/helpers";

const Home = () => {
  const { data, error } = useSwr("PRODUCTS", () =>
    queryFunc(PRODUCTS, { limit: 5 })
  );
  const scrollRef = useRef(null);

  const { Token } = useToken();
  const router = useRouter();
  const toast = useToast();

  const role = Cookies.get("role");

  async function addCart(product_id, prod_creator_id) {
    const variables = {
      product_id,
      prod_creator_id,
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
            ? "Check Your Internet Connection and Refressh"
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
      <div className="home-page">
        <section className="main-carousel">
          <Carousel indicators={false} interval={7000}>
            <Carousel.Item>
              <img src="/slider/slide1.jpg" />

              <Carousel.Caption>
                <h3>We Have All You Need To Enoy Your Time At The Beach</h3>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Beach Parties</h5>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/slider/slide2.jpeg" />

              <Carousel.Caption>
                <h3>Your House Parties Are About to get Real Lit</h3>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>House Parties</h5>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/slider/slide3.jpeg" />

              <Carousel.Caption>
                <h3>
                  We Have Just The Perfect Items For Birthday Celebrations
                </h3>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Birthdays</h5>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img src="/slider/slide4.jpeg" />

              <Carousel.Caption>
                <h3>
                  Games Come Through When Things Get Dull, and You Want No Dull
                  Moments
                </h3>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Social Clubs</h5>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img src="/slider/slide5.jpeg" />

              <Carousel.Caption>
                <h3>Whats A Party Without Lights?</h3>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Beach Parties</h5>
                <Link href="/">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>
          </Carousel>
        </section>

        <main className="main-section">
          <section className="featured">
            <h1>Top Picks For You</h1>
            <div className="scroll-direction">
              <button>
                <Icon
                  name="chevron-left"
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollLeft -= 30;
                    }
                  }}
                  size="32px"
                />
              </button>

              <button>
                <Icon
                  name="chevron-right"
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollLeft += 30;
                    }
                  }}
                  size="32px"
                />
              </button>
            </div>
            <div className="featured-wrap" ref={scrollRef}>
              {data &&
                data.products.map((p: ProductsRes) => (
                  <div className="item" key={p.id}>
                    <Link
                      href={`/product/${p.name_slug}`}
                      as={`/product/${p.name_slug}`}
                    >
                      <a>
                        <img src="/slider/slide3.jpeg" alt={`${p.name}`} />
                        <div className="featured-desc">
                          <h2>{p.name}</h2>
                          <p>&#8358; {Commas(p.price)}</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}

              {/* <div className="featured-wrap" ref={scrollRef}>
                <div className="item">
                  <a>
                    <img src="/slider/slide2.jpeg" />
                    <div className="featured-desc">
                      <h2>Red Cups</h2>
                      <p>&#8358; {Commas("45000")}</p>
                    </div>
                  </a>
                </div>
                <div className="item">
                  <a>
                    <img src="/slider/slide3.jpeg" />
                    <div className="featured-desc">
                      <h2>Champagne</h2>
                      <p>&#8358; {Commas("95300")}</p>
                    </div>
                  </a>
                </div>
                <div className="item">
                  <a>
                    <img src="/slider/slide4.jpeg" />
                    <div className="featured-desc">
                      <h2>Balloons</h2>
                      <p>&#8358; {Commas("3500")}</p>
                    </div>
                  </a>
                </div>
                <div className="item">
                  <a>
                    <img src="/slider/slide2.jpeg" />
                    <div className="featured-desc">
                      <h2>Masks</h2>
                      <p>&#8358; {Commas("45900")}</p>
                    </div>
                  </a>
                </div>
              </div> */}
            </div>
          </section>
        </main>

        <section className="sale-banner">
          <Link href="/">
            <a>
              <img src="/sale.png" alt="sales-banner" />
            </a>
          </Link>
        </section>

        <section className="categories">
          <h1>Shop By Categories</h1>
          <div className="categories-wrap">
            <Link href="/">
              <a>
                <div className="category-item category-item-1">
                  <p>BIRTHDAYS</p>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a>
                <div className="category-item category-item-2">
                  <p>GIFTS</p>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a>
                <div className="category-item category-item-3">
                  <p>GAMES</p>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a>
                <div className="category-item category-item-4">
                  <p>DRINKS</p>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a>
                <div className="category-item category-item-5">
                  <p>DECORATIONS</p>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a>
                <div className="category-item category-item-6">
                  <p>PARTY PROPS</p>
                </div>
              </a>
            </Link>
          </div>
        </section>
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default Home;
