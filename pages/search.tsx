import { useToast } from "@chakra-ui/core";
import Link from "next/link";
import React from "react";
import { PurchaseSteps } from "../components/customer/PurchaseSteps";
import { Layout } from "../components/Layout";
import { SEARCH } from "../graphql/customer";
import { ProductsRes } from "../Typescript/types";
import { graphQLClient } from "../utils/client";
import { Commas } from "../utils/helpers";

interface Iprops {
  products: ProductsRes[];
  error: any;
}
export async function getServerSideProps({ query }) {
  const variables = {
    query: query.query,
    limit: null,
  };

  try {
    const res = await graphQLClient.request(SEARCH, variables);
    const products = await res.search;
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
export const Search = ({ products, error }: Iprops) => {
  const toast = useToast();

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

        <section className="search-results">
          <h1>Search Results...</h1>

          {products && products.length === 0 && (
            <h1>
              <br />
              no results found
            </h1>
          )}
          <div className="results-wrap">
            {products &&
              products.map((p, index) => (
                <div className="search-item" key={p.id}>
                  <Link
                    href={`/product/${p.name_slug}`}
                    as={`/product/${p.name_slug}`}
                  >
                    <a>
                      <img src={`/${images[index]}`} alt={`${p.name}`} />
                      <hr />
                      <div className="search-desc">
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
        .search-results {
          padding: 20px;
        }
        .search-results h1 {
          font-weight: bold;
          font-size: 1.2rem;
          text-align: center;
          margin: 10px 0;
        }
        .results-wrap {
          display: flex;
          flex-wrap: wrap;
        }

        .results-wrap .search-item {
          margin: 8px;
          box-shadow: var(--box) var(--softgrey);
          background: white;
          border-radius: 5px;
          width: 150px;
        }
        .results-wrap.serch-item a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .results-wrap .search-item img {
          min-width: 150px;
          height: 150px;
          object-fit: contain;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .results-wrap .search-desc {
          margin: 5px 0;
          text-align: center;
          font-weight: bold;
        }

        .results-wrap .search-desc h2 {
          color: var(--deepblue);
          padding: 5px 0;
          font-style: italic;
        }

        @media only screen and (min-width: 700px) {
          .search-results h1 {
            margin: 15px 0;
          }

          .results-wrap {
            margin: auto;
            width: 95%;
          }

          .results-wrap .search-item img {
            display: flex;
          }
        }

        @media only screen and (min-width: 1000px) {
          .results-wrap {
            margin: 15px auto;
            overflow: hidden;
          }
          .results-wrap .search-item {
            width: 200px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .search-results h1 {
            font-size: 1.4rem;
          }

          .results-wrap {
            margin: 35px auto;
          }

          .results-wrap .search-item {
            margin: 10px 14px;
            padding: 5px;
          }

          .results-wrap .search-item img {
            object-fit: contain;
            width: 200px;
            height: 200px;
          }

          .search-item .search-desc {
            margin: 8px 0;
          }
        }

        @media only screen and (min-width: 2000px) {
          .results-wrap {
            width: 60%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Search;
