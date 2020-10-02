import React, { useRef } from "react";
import { Icon } from "@chakra-ui/core";
import { PRODUCTS } from "./../graphql/vendor";
import { ProductsRes } from "../Typescript/types";
import Link from "next/link";
import { Layout } from "../components/Layout";
import Carousel from "react-bootstrap/Carousel";
import { Commas } from "../utils/helpers";
import { PurchaseSteps } from "../components/customer/PurchaseSteps";
import { graphQLClient } from "../utils/client";

export async function getServerSideProps() {
  try {
    const res = await graphQLClient.request(PRODUCTS, { limit: 5 });
    const products = await res.products;
    return {
      props: {
        products,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err.message,
      },
    };
  }
}

const Home = ({ products, error }) => {
  //Featured Products Section Scroll
  const scrollRef = useRef(null);

  const featured_images = [
    "product3.png",
    "product2.png",
    "product4.png",
    "product2.png",
    "product3.png",
  ];

  return (
    <Layout>
      <div className="home-page">
        <section className="main-carousel">
          <Carousel indicators={false} interval={7000}>
            <Carousel.Item>
              <img src="/slider/slide1.jpg" />

              <Carousel.Caption>
                <h3>We Have All You Need To Enoy Your Time At The Beach</h3>
                <Link href="/party?category=Beach Party">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Beach Parties</h5>
                <Link href="party?category=Beach Party">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img src="/slider/slide2.jpeg" />

              <Carousel.Caption>
                <h3>Your House Parties Are About to get Real Lit</h3>
                <Link href="party?category=House Party">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>House Parties</h5>
                <Link href="party?category=House Party">
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
                <Link href="party?category=Birthday Party">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Birthdays</h5>
                <Link href="party?category=Birthday Party">
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
                <Link href="party?category=Social Clubs">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Social Clubs</h5>
                <Link href="party?category=Social Clubs">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img src="/slider/slide5.jpeg" />

              <Carousel.Caption>
                <h3>Whats A Party Without Lights?</h3>
                <Link href="party?category=Outdoors">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Outdoor Parties</h5>
                <Link href="party?category=Outdoors">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>

            <Carousel.Item>
              <img src="/slider/slide5.jpeg" />

              <Carousel.Caption>
                <h3>Whats An Indoor Party Without Lights?</h3>
                <Link href="party?category=Indoors">
                  <a>Shop Now</a>
                </Link>
              </Carousel.Caption>
              <div className="mobile-caption">
                <h5>Indoor Parties</h5>
                <Link href="party?category=Indoors">
                  <a>Shop Now</a>
                </Link>
              </div>
            </Carousel.Item>
          </Carousel>
        </section>

        {/* FEATURED PRODUCTS SECTION */}

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
              {products &&
                products.map((p: ProductsRes, index) => (
                  <div className="featured-item" key={p.id}>
                    <Link
                      href={`/product/${p.name_slug}`}
                      as={`/product/${p.name_slug}`}
                    >
                      <a>
                        <img
                          src={`/${featured_images[index]}`}
                          alt={`${p.name}`}
                        />
                        <hr />
                        <div className="featured-desc">
                          <h2>{p.name}</h2>
                          <p>&#8358; {Commas(p.price)}</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        </main>

        {/* BANNER SECTION */}

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
            <Link href="/category?category=Cakes">
              <a>
                <div className="category-item category-item-1">
                  <p>CAKES</p>
                </div>
              </a>
            </Link>
            <Link href="/category?category=Gifts">
              <a>
                <div className="category-item category-item-2">
                  <p>GIFTS</p>
                </div>
              </a>
            </Link>
            <Link href="/category?category=Games">
              <a>
                <div className="category-item category-item-3">
                  <p>GAMES</p>
                </div>
              </a>
            </Link>
            <Link href="/category?category=Drinks">
              <a>
                <div className="category-item category-item-4">
                  <p>DRINKS</p>
                </div>
              </a>
            </Link>
            <Link href="/category?category=Decorations">
              <a>
                <div className="category-item category-item-5">
                  <p>DECORATIONS</p>
                </div>
              </a>
            </Link>
            <Link href="/category?category=Props">
              <a>
                <div className="category-item category-item-6">
                  <p>PARTY PROPS</p>
                </div>
              </a>
            </Link>
          </div>
        </section>

        {/* IMPORTED . PURCHASE STEPS SECTION */}

        <PurchaseSteps />

        {/* <section  style={{ padding: "40px 0" }}>
          <h1>IDK WHAT SECTION THIS IS ABEG</h1>
        </section> */}
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default Home;
