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
export const byCategory = gql`
  query byCategory($category: String!, $limit: Int, $offset: Int) {
    byCategory(category: $category, limit: $limit, offset: $offset) {
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
              products.map((p) => (
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
      <style jsx>{``}</style>
    </Layout>
  );
};

export default Category;
