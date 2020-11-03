import React, { useRef } from "react";
import { Icon, Spinner } from "@chakra-ui/core";
import { featuredProducts } from "./../graphql/vendor";
import { ProductsRes } from "../Typescript/types";
import Link from "next/link";
import { Layout } from "../components/Layout";
import Carousel from "react-bootstrap/Carousel";
import { Commas } from "../utils/helpers";
import { PurchaseSteps } from "../components/customer/PurchaseSteps";
import { useQuery } from "./../components/useQuery";
import Image from "next/image";

const Home = () => {
  //Featured Products Section Scroll
  const scrollRef = useRef(null);

  //fetch products with custom hook
  const [data, loading] = useQuery(featuredProducts, { limit: 5 });
  const products = data ? data.featuredProducts : [];

  return (
    <Layout>
      <div className="home-page">
        <section className="main-carousel">
          <Carousel indicators={false} interval={7000}>
            <Carousel.Item>
              <Image unsized src="/slider/slide1.jpg" alt="slider" />

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
              <Image unsized src="/slider/slide2.jpeg" alt="slider" />

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
              <Image unsized src="/slider/slide3.jpeg" alt="slider" />

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
              <Image unsized src="/slider/slide4.jpeg" alt="slider" />

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
              <Image unsized src="/slider/slide5.jpeg" alt="slider" />

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
              <Image unsized src="/slider/slide5.jpeg" alt="slider" />

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
              <button
                title="scroll left"
                aria-label="scroll left"
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollLeft -= 30;
                  }
                }}
              >
                <Icon name="chevron-left" size="32px" />
              </button>

              <button
                title="scroll right"
                aria-label="scroll right"
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollLeft += 30;
                  }
                }}
              >
                <Icon name="chevron-right" size="32px" />
              </button>
            </div>
            {loading && (
              <div style={{ textAlign: "center" }}>
                <Spinner speed="1s"></Spinner>
              </div>
            )}
            <div className="featured-wrap" ref={scrollRef}>
              {products &&
                products.map((p: ProductsRes, index) => (
                  <div className="featured-item" key={p.id}>
                    <Link
                      href={`/product/${p.name_slug}`}
                      as={`/product/${p.name_slug}`}
                    >
                      <a>
                        <img src={p.images[0]} alt={`${p.name}`} />
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

        <section className="home-vendor-onboarding">
          <h1>Become a vendor today</h1>
          <div>
            <Link href="/vendor/become-a-vendor">
              <a>
                Learn More
                <Icon name="external-link" />
              </a>
            </Link>
          </div>
        </section>
      </div>
      <style jsx>{`
        .home-vendor-onboarding {
          height: 200px;
          background: var(--deepblue);
          color: white;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .home-vendor-onboarding h1 {
          font-weight: bolder;
          font-size: 2rem;
          font-style: normal;
        }
        .home-vendor-onboarding div {
          margin-top: 10px;
        }

        @media only screen and (min-width: 700px) {
          .home-vendor-onboarding {
            height: 250px;
          }
          .home-vendor-onboarding h1 {
            font-size: 3rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
