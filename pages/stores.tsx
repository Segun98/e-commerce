import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { UsersRes } from "../Typescript/types";
import { graphQLClient } from "../utils/client";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/core";
import Link from "next/link";
import { truncate } from "../utils/helpers";
import Head from "next/head";
import { useRouter } from "next/router";
const getStores = `
query getStores($query:String, $limit:Int, $offset:Int){
    getStores(query:$query, limit:$limit, offset:$offset){
      business_name_slug
      business_name
      business_image
      business_bio
    }
}
`;
const Stores = () => {
  const [stores, setStores] = useState<UsersRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const router: any = useRouter();

  //frist page
  const [page, setpage] = useState(parseInt(router.query.p) || 1);

  //prevent useEffect from running on firts render
  const firstRender = useRef(0);
  useEffect(() => {
    if (firstRender.current === 0) {
      return;
    }
    router.push(`/stores?p=${page}`);
  }, [page]);

  useEffect(() => {
    fetchStores(null);
  }, [page, router]);

  const images = [
    "slider/slide2.jpeg",
    "slider/slide3.jpeg",
    "slider/slide4.jpeg",
    "slider/slide5.jpeg",
    "slider/slide6.jpeg",
    "slider/slide7.jpeg",
  ];

  async function fetchStores(query) {
    //page -1 * limit
    let pageCalc = (parseInt(router.query.p) - 1) * 30;
    const variables = {
      query: query || null,
      limit: 30,
      offset: pageCalc || 0,
    };
    try {
      const res = await graphQLClient.request(getStores, variables);
      const data = res.getStores;
      setStores(data);
    } catch (err) {
      setError(true);
    }
  }

  function handleSearch(query) {
    fetchStores(query);
  }
  return (
    <Layout>
      <Head>
        <title>Stores | PartyStore</title>
      </Head>
      <header>
        <div className="stores-image">
          <h1>Find Your Favourite Stores</h1>
          <Button marginTop="10px" background="var(--deepblue)" color="white">
            <Link href="/vendor/onboarding">
              <a>
                Open Your Store <Icon name="external-link" />
              </a>
            </Link>
          </Button>
        </div>
      </header>

      <main className="stores-wrap">
        <div className="stores-header">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(search);
            }}
          >
            <InputGroup>
              <InputLeftAddon
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch(search);
                }}
                cursor="pointer"
                children={<Icon name="search" color="blue.800" />}
                borderTop="none"
                color="blue.400"
              />
              <Input
                className="search-store"
                type="search"
                name="search stores"
                id="search stores"
                placeholder="Find a Store"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </form>
          <div></div>
        </div>
        {stores.length === 0 && <strong>No results...</strong>}
        <div className="store-items">
          {stores.map((s, i) => (
            <div className="store-item" key={s.business_name_slug}>
              <Link href={`/store/${s.business_name_slug}`}>
                <a>
                  <div
                    className="store-img"
                    style={{
                      backgroundImage: `url(${images[i]})`,
                      backgroundPosition: "center",
                    }}
                  >
                    <h3>{s.business_name}</h3>
                  </div>

                  <div className="store-desc">
                    <h4 className="bio">
                      {truncate(s.business_bio) ||
                        `We Are A Customer First Business`}
                    </h4>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
        <section className="paginate">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {!router.query.p || page === 1 ? (
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
            <Button
              style={{ background: "var(--deepblue)", color: "white" }}
              size="sm"
              onClick={() => {
                if (stores.length === 0) {
                  return;
                }
                setpage(page + 1);
                firstRender.current++;
              }}
            >
              Next Page
            </Button>
          </div>
        </section>
      </main>

      <style jsx>{`
        /* Header Image */
        .stores-image {
          background-image: url("/slider/slide5.jpeg");
          background-position: center;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .stores-image h1 {
          color: white;
          background: rgba(2, 36, 122, 0.6);
          font-weight: bold;
          font-size: 1.2rem;
          padding: 0 3px;
        }

        .stores-wrap {
          margin: auto;
          width: 90%;
        }
        .paginate {
          margin: 10px auto;
          width: 80%;
        }
        .stores-header {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        .store-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 50px;
        }

        .store-item {
          width: 180px;
        }
        /* Stores' images  */
        .store-img {
          height: 200px;
          width: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .store-img h3 {
          color: white;
          background: rgba(2, 36, 122, 0.6);
          font-weight: bold;
          font-size: 0.9rem;
          padding: 5px;
        }
        .store-desc {
          font-style: italic;
          color: var(--deepblue);
          margin: 3px 0;
          font-weight: bold;
          font-size: 0.9rem;
        }
        @media only screen and (min-width: 700px) {
          .stores-image {
            height: 120px;
          }
          .store-items {
            grid-template-columns: repeat(3, 1fr);
          }
          .paginate {
            margin-top: 20px;
            width: 70%;
          }
        }

        @media only screen and (min-width: 1000px) {
          .stores-image {
            height: 250px;
            object-fit: cover;
          }
          .stores-image h1 {
            font-size: 2rem;
          }
          .stores-wrap {
            width: 80%;
          }
          .stores-header {
            margin: 20px 0;
          }
          .store-items {
            gap: 20px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .stores-image {
            height: 400px;
          }
          .store-img {
            width: 280px;
          }
          .store-items {
            grid-template-columns: repeat(4, 1fr);
            gap: 22px;
          }
          .stores-wrap {
            width: 90%;
          }
          .paginate {
            width: 65%;
          }
        }

        @media only screen and (min-width: 1800px) {
          .stores-image {
            height: 500px;
          }
          .store-items {
            grid-template-columns: repeat(5, 1fr);
          }
          .stores-wrap {
            width: 60%;
          }
          .paginate {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};
export default Stores;
