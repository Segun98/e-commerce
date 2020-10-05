import React, { useEffect, useState } from "react";
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
const getStores = `
query getStores{
    getStores{
      business_name_slug
      business_name
      business_image
      business_bio
    }
}
`;
const Stores = () => {
  useEffect(() => {
    fetchStores();
  }, []);

  const [stores, setStores] = useState<UsersRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const images = [
    "slider/slide2.jpeg",
    "slider/slide3.jpeg",
    "slider/slide4.jpeg",
    "slider/slide5.jpeg",
    "slider/slide6.jpeg",
    "slider/slide7.jpeg",
  ];

  async function fetchStores() {
    try {
      const res = await graphQLClient.request(getStores);
      const data = res.getStores;
      setStores(data);
    } catch (err) {
      setError(true);
    }
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
          <form>
            <InputGroup>
              <InputLeftAddon
                // onClick={handleSearch}
                cursor="pointer"
                children={<Icon name="search" color="blue.800" />}
                borderTop="none"
                color="blue.400"
              />
              <Input
                type="search"
                name="search stores"
                id="search stores"
                placeholder="Find a Store"
              />
            </InputGroup>
          </form>
          <div></div>
        </div>

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
          .store-items {
            grid-template-columns: repeat(5, 1fr);
            gap: 22px;
          }
          .stores-wrap {
            width: 74%;
          }
        }

        @media only screen and (min-width: 1800px) {
          .stores-image {
            height: 500px;
          }
          .store-items {
            grid-template-columns: repeat(6, 1fr);
          }
          .stores-wrap {
            width: 60%;
          }
        }
      `}</style>
    </Layout>
  );
};
export default Stores;
