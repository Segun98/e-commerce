import { Button, useToast } from "@chakra-ui/core";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { Layout } from "@/components/Layout";
import { ProductsRes } from "@/Typescript/types";
import { graphQLClient } from "@/utils/client";
import { Commas } from "@/utils/helpers";
import { useRouter } from "next/router";
import Head from "next/head";
import { gql } from "graphql-request";

interface Iprops {
  products: ProductsRes[];
  error: any;
}
export const partyCategory = gql`
  query partyCategory($party_category: String, $limit: Int, $offset: Int) {
    partyCategory(
      party_category: $party_category
      limit: $limit
      offset: $offset
    ) {
      id
      name
      name_slug
      price
      images
    }
  }
`;
export async function getServerSideProps({ query }) {
  //page -1 * limit
  let pageCalc = (parseInt(query.p) - 1) * 30;
  const variables = {
    party_category: query.category,
    limit: 30,
    offset: pageCalc || 0,
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

const Category = ({ products, error }: Iprops) => {
  const toast = useToast();
  const router: any = useRouter();

  //pagination
  const [page, setpage] = useState(parseInt(router.query.p) || 1);
  //prevent useEffect from running on firts render
  const firstRender = useRef(0);
  useEffect(() => {
    if (firstRender.current === 0) {
      return;
    }
    router.push(`/party?category=${router.query.category}&p=${page}`);
  }, [page]);

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
            {router.query.category} ({products && products.length} items)
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
                      <img src={p.images[0]} alt={`${p.name}`} loading="lazy" />
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

          {/* show pagination only when products are up to 30 */}
          {products && products.length < 30 ? null : (
            <section className="paginate">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* dont show previous page button on page 1  */}
                {!router.query.p || parseInt(router.query.p) === 1 ? (
                  <div></div>
                ) : (
                  <Button
                    style={{
                      display: error ? "none" : "",
                      background: "var(--deepblue)",
                      color: "white",
                    }}
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
                    style={{
                      display: error ? "none" : "",
                      background: "var(--deepblue)",
                      color: "white",
                    }}
                    size="sm"
                    onClick={() => {
                      setpage(page + 1);
                      firstRender.current++;
                    }}
                  >
                    Next Page
                  </Button>
                )}
              </div>
            </section>
          )}
        </section>
        {error && <div className="space"></div>}
        <PurchaseSteps />
      </div>
      <style jsx>{`
        .category-results {
          padding: 20px 10px;
        }
        .category-results h1 {
          font-weight: bold;
          font-size: 1rem;
          text-align: center;
          margin: 10px 0 20px 0;
        }
        .category-wrap {
          margin: auto;
          width: 90%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .paginate {
          margin: 10px auto;
          width: 80%;
        }
        .category-wrap .category-item {
          box-shadow: var(--box) var(--softgrey);
          border-radius: 5px;
          margin: 0 5px;
        }
        .category-wrap .category-item a {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .category-wrap .category-item img {
          min-width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .category-wrap .category-desc {
          margin: 5px 0;
          padding: 3px;
          text-align: center;
          font-weight: bold;
          font-size: 0.9rem;
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
            grid-template-columns: repeat(4, 1fr);
            column-gap: 10px;
          }
          .paginate {
            margin-top: 20px;
            width: 70%;
          }
          .category-wrap .category-item img {
            display: flex;
          }
        }

        @media only screen and (min-width: 1000px) {
          .category-wrap {
            margin: 15px auto;
            width: 70%;
          }
          .category-wrap .category-item {
            width: 200px;
          }
          .category-wrap .category-item img {
            min-width: 150px;
            height: 150px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .category-results h1 {
            font-size: 1.2rem;
          }

          .category-wrap {
            margin: 35px auto;
          }
          .paginate {
            width: 65%;
          }
          .category-wrap .category-item {
            margin: 10px 14px;
          }

          .category-wrap .category-item img {
            object-fit: contain;
            width: 200px;
          }

          .category-item .category-desc {
            margin: 8px 0;
            padding: 5px;
          }
        }

        @media only screen and (min-width: 1800px) {
          .category-wrap {
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

export default Category;
