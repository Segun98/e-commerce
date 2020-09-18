import React from "react";
import { Button, useToast } from "@chakra-ui/core";
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
// import { Carousel } from "react-responsive-carousel";
// const Carousel = require("react-responsive-carousel").Carousel;
import Carousel from "react-bootstrap/Carousel";

const Home = () => {
  const { data, error } = useSwr("PRODUCTS", () =>
    queryFunc(PRODUCTS, { limit: null })
  );

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
        <Carousel indicators={false} interval={7000}>
          <Carousel.Item>
            <img src="/slider/slide1.jpg" />

            <Carousel.Caption>
              <h3>Drinks Adds Life to Parties</h3>
              <p>
                We Sell Over 45 Different Types of Drinks From Different Brands
              </p>
              <Button>Buy A Drink</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/slider/slide2.jpeg" />

            <Carousel.Caption>
              <h3>COSTUME</h3>
              <p>Get Freaky At Your Parties, Add New Faces</p>
              <Button variantColor="blue">Get Costume</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/slider/slide3.jpeg" />

            <Carousel.Caption>
              <h3>BALLOONS</h3>
              <p>
                Balloons Add Colours and Bring That Classic Party Experience
              </p>
              <Button variantColor="blue">Shop Now</Button>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src="/slider/slide4.jpeg" />

            <Carousel.Caption>
              <h3>Games</h3>
              <p>
                Games Come Through When Things Get Dull, and You Want No Dull
                Moments
              </p>
              <Button variantColor="blue">Click To Buy</Button>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src="/slider/slide5.jpeg" />

            <Carousel.Caption>
              <h3>SPECIAL LIGTHS</h3>
              <p>Whats A Party Without Lights?</p>
              <Button variantColor="blue">Shop Now</Button>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src="/slider/slide6.jpeg" />

            <Carousel.Caption>
              <h3>Decoration</h3>
              <p>Add Special Decorations To Your Party</p>
              <Button variantColor="blue">Shop Now</Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        <main className="main-section">
          <div className="bar"></div>

          <section className="for-you">
            <h1>Products For You</h1>
            <div className="for-you-wrap">
              {data &&
                data.products.map((p: ProductsRes) => (
                  <div className="item" key={p.id}>
                    <img src="/product1.png" alt={`${p.name}`} />
                    <h1>{p.name}</h1>
                    <p>{p.price}</p>
                    <Link
                      href={`/product/${p.name_slug}`}
                      as={`/product/${p.name_slug}`}
                    >
                      <a>Buy</a>
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        </main>
        <main>
          {data &&
            data.products.map((p: ProductsRes) => (
              <div key={p.id}>
                <div>
                  <strong>PRODUCT NAME:</strong>
                  {p.name}
                </div>
                <div>
                  <Link
                    href={`/product/${p.name_slug}`}
                    as={`/product/${p.name_slug}`}
                  >
                    <a>Visit Product Page</a>
                  </Link>
                </div>
                <div>
                  <strong>Creator ID:</strong>
                  {p.creator_id}
                </div>
                <div>
                  <strong>Creator business name:</strong>
                  {p.creator.business_name}
                </div>
                <div>
                  <strong>Creator name:</strong>
                  {p.creator.first_name}
                </div>
                <div>
                  <strong>Available Qty:</strong> {p.available_qty}
                </div>
                <div>
                  <strong>in stock:</strong> {p.in_stock}
                </div>
                <Button
                  variantColor="yellow"
                  onClick={() => {
                    if (!Token) {
                      router.push("/customer/account");
                      return;
                    }
                    addCart(p.id, p.creator_id);
                  }}
                >
                  Add to Cart
                </Button>
                <br />
                <br />
              </div>
            ))}
        </main>
      </div>
      <style jsx>{``}</style>
    </Layout>
  );
};

export default Home;
