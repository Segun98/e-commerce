import { Button, useToast } from "@chakra-ui/core";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PurchaseSteps } from "../components/customer/PurchaseSteps";
import { Layout } from "../components/Layout";
import { ProductsRes } from "../Typescript/types";
import { graphQLClient } from "../utils/client";
import { Commas } from "../utils/helpers";
import { useRouter } from "next/router";
import Head from "next/head";

interface Iprops {
  products: ProductsRes[];
  error: any;
}
export const byCategory = `
    query byCategory($category:String!, $limit:Int, $offset:Int)
    {
        byCategory(category:$category, limit:$limit, offset:$offset){
            id
            name
            name_slug
            price
            image
        }
}`;
export async function getServerSideProps({ query }) {
  //page -1 * limit
  let pageCalc = (parseInt(query.p) - 1) * 30;
  const variables = {
    category: query.category,
    limit: 30,
    offset: pageCalc || 0,
  };

  try {
    const res = await graphQLClient.request(byCategory, variables);
    const products = await res.byCategory;
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
  const router: any = useRouter();

  const images = [
    "slider/slide2.jpeg",
    "product3.png",
    "product2.png",
    "product4.png",
    "product2.png",
    "product1.png",
  ];

  //pagination
  const [page, setpage] = useState(parseInt(router.query.p) || 1);

  //prevent useEffect from running on first render
  const firstRender = useRef(0);

  //pagination
  useEffect(() => {
    if (firstRender.current === 0) {
      return;
    }
    router.push(`/category?category=${router.query.category}&p=${page}`);
  }, [page]);

  return (
    <Layout>
      <Head>
        <title>
          {`${router.query.category} | Category` || "Category"} | PartyStore
        </title>
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
              Oops, no results found...
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
              {products.length === 0 ? (
                <div></div>
              ) : (
                <Button
                  style={{ background: "var(--deepblue)", color: "white" }}
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
        </section>
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
          margin: 10px 0;
        }
        .category-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: auto;
          width: 90%;
        }

        .category-wrap .category-item {
          box-shadow: var(--box) var(--softgrey);
          background: white;
          border-radius: 5px;
          width: 150px;
          padding: 3px;
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
          text-align: center;
          font-weight: bold;
        }

        .category-wrap .category-desc h2 {
          color: var(--deepblue);
          padding: 5px 0;
          font-style: italic;
          font-size: 0.9rem;
        }
        .paginate {
          margin: 10px auto;
          width: 80%;
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
            padding: 5px;
          }

          .category-wrap .category-item img {
            object-fit: contain;
            width: 200px;
          }

          .category-item .category-desc {
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

export default Category;
