import { useToast } from "@chakra-ui/core";
import Link from "next/link";
import React from "react";
import { PurchaseSteps } from "../components/customer/PurchaseSteps";
import { Layout } from "../components/Layout";
import { SEARCH } from "../graphql/customer";
import { ProductsRes } from "../Typescript/types";
import { graphQLClient } from "../utils/client";
import { Commas } from "../utils/helpers";
import { useRouter } from "next/router";
import Head from "next/head";

interface Iprops {
  products: ProductsRes[];
  error: any;
}
export const partyCategory = `
    query partyCategory($party_category:String, $limit:Int){
        partyCategory(party_category:$party_category, limit:$limit){
            id
            name
            name_slug
            description
            party_category
            price
            image
            in_stock
            creator_id
            available_qty
        }
}`;
export async function getServerSideProps({ query }) {
  const variables = {
    party_category: query.category,
    limit: null,
  };

  try {
    const res = await graphQLClient.request(partyCategory, variables);
    const products = await res.partyCategory;
    return {
      props: {
        products,
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
export const Category = ({ products, error }: Iprops) => {
  const toast = useToast();
  const router = useRouter();

  const images = [
    "slider/slide2.jpeg",
    "product3.png",
    "product2.png",
    "product1.png",
    "product2.png",
    "product3.png",
  ];

  return (
    <Layout>
      <Head>
        <title>{router.query.category || "Category"} | PartyStore</title>
      </Head>
      <div>
        <>
          {error &&
            toast({
              title: "An error occurred.",
              description: "check your internet connection and refresh.",
              status: "error",
              duration: 7000,
              isClosable: true,
              position: "top",
            })}
        </>

        <section className="category-results">
          <h1>
            Party Category : {router.query.category} (
            {products && products.length} items)
          </h1>

          {products && products.length === 0 && (
            <h1>
              <br />
              no results found
            </h1>
          )}
          <div className="category-wrap">
            {products &&
              products.map((p, index) => (
                <div className="category-item" key={p.id}>
                  <Link
                    href={`/product/${p.name_slug}`}
                    as={`/product/${p.name_slug}`}
                  >
                    <a>
                      <img src={`/${images[index]}`} alt={`${p.name}`} />
                      <hr />
                      <div className="category-desc">
                        <h2>{p.name}</h2>
                        <p>&#8358; {Commas(p.price)}</p>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
          </div>
        </section>
        <PurchaseSteps />
      </div>
      <style jsx>{`
        .category-results {
          padding: 20px;
        }
        .category-results h1 {
          font-weight: bold;
          font-size: 1.2rem;
          text-align: center;
          margin: 10px 0;
        }
        .category-wrap {
          display: flex;
          flex-wrap: wrap;
        }

        .category-wrap .category-item {
          margin: 8px;
          box-shadow: var(--box) var(--softgrey);
          background: white;
          border-radius: 5px;
          width: 150px;
        }
        .category-wrap.serch-item a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .category-wrap .category-item img {
          min-width: 150px;
          height: 150px;
          object-fit: contain;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .category-wrap .category-desc {
          margin: 5px 0;
          text-align: center;
          font-weight: bold;
        }

        .category-wrap .category-desc h2 {
          color: var(--deepblue);
          padding: 5px 0;
          font-style: italic;
        }

        @media only screen and (min-width: 700px) {
          .category-results h1 {
            margin: 15px 0;
          }

          .category-wrap {
            margin: auto;
            width: 95%;
          }

          .category-wrap .category-item img {
            display: flex;
          }
        }

        @media only screen and (min-width: 1000px) {
          .category-wrap {
            margin: 15px auto;
            overflow: hidden;
          }
          .category-wrap .category-item {
            width: 200px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .category-results h1 {
            font-size: 1.4rem;
          }

          .category-wrap {
            margin: 35px auto;
          }

          .category-wrap .category-item {
            margin: 10px 14px;
            padding: 5px;
          }

          .category-wrap .category-item img {
            object-fit: contain;
            width: 200px;
            height: 200px;
          }

          .category-item .category-desc {
            margin: 8px 0;
          }
        }

        @media only screen and (min-width: 2000px) {
          .category-wrap {
            width: 60%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Category;
