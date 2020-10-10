import { Button, useToast } from "@chakra-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
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
  //page -1 * limit
  let pageCalc = (parseInt(query.p) - 1) * 30;
  const variables = {
    query: query.query,
    limit: 30,
    offset: pageCalc || 0,
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
  //pagination
  const router: any = useRouter();

  const [page, setpage] = useState(parseInt(router.query.p) || 1);
  //prevent useEffect from running on firts render
  const firstRender = useRef(0);

  useEffect(() => {
    if (firstRender.current === 0) {
      return;
    }
    router.push(`/search?query=${router.query.query}&p=${page}`);
  }, [page]);
  const images = [
    "slider/slide2.jpeg",
    "product3.png",
    "product2.png",
    "product4.png",
    "product2.png",
    "product1.png",
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
          <h1>Search Results... ({products && products.length} items)</h1>

          {products && products.length === 0 && (
            <h1>
              <br />
              Oops! no results found
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
          <section className="paginate">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {!router.query.p || parseInt(router.query.p) === 1 ? (
                <div></div>
              ) : (
                <Button
                  style={{ background: "var(--deepblue)", color: "white" }}
                  size="sm"
                  onClick={() => {
                    setpage(page - 1);
                  }}
                >
                  Prev Page
                </Button>
              )}
              {products && products.length === 0 ? (
                <div></div>
              ) : (
                <Button
                  style={{ background: "var(--deepblue)", color: "white" }}
                  size="sm"
                  onClick={() => {
                    if (products.length === 0) {
                      return;
                    }
                    setpage(page + 1);
                    firstRender.current++;
                  }}
                >
                  Next Page
                </Button>
              )}
            </div>
          </section>
        </section>
        <PurchaseSteps />
      </div>
      <style jsx>{`
        .search-results {
          padding: 20px 10px;
        }
        .search-results h1 {
          font-weight: bold;
          font-size: 1rem;
          text-align: center;
          margin: 10px 0;
        }
        .results-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: auto;
          width: 90%;
        }
        .paginate {
          margin: 10px auto;
          width: 80%;
        }
        .results-wrap .search-item {
          box-shadow: var(--box) var(--softgrey);
          background: white;
          border-radius: 5px;
          width: 150px;
          padding: 3px;
        }
        .results-wrap .search-item a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .results-wrap .search-item img {
          min-width: 100px;
          height: 100px;
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
          font-size: 0.9rem;
        }

        @media only screen and (min-width: 700px) {
          .search-results h1 {
            margin: 15px 0;
          }

          .results-wrap {
            grid-template-columns: repeat(4, 1fr);
            column-gap: 10px;
          }
          .paginate {
            margin-top: 20px;
            width: 70%;
          }
          .results-wrap .search-item img {
            display: flex;
          }
        }

        @media only screen and (min-width: 1000px) {
          .results-wrap {
            margin: 15px auto;
            width: 70%;
          }
          .results-wrap .search-item {
            width: 200px;
          }
          .results-wrap .search-item img {
            min-width: 150px;
            height: 150px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .search-results h1 {
            font-size: 1.2rem;
          }

          .results-wrap {
            margin: 35px auto;
          }
          .paginate {
            width: 65%;
          }
          .results-wrap .search-item {
            margin: 10px 14px;
            padding: 5px;
          }

          .results-wrap .search-item img {
            object-fit: contain;
            width: 200px;
          }

          .search-item .search-desc {
            margin: 8px 0;
          }
        }

        @media only screen and (min-width: 1800px) {
          .results-wrap {
            width: 50%;
          }
          .paginate {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Search;
