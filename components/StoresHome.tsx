import { UsersRes } from "@/Typescript/types";
import Link from "next/link";
import { screenWidth, truncate } from "@/utils/helpers";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { useQuery } from "./useQuery";

const getStores = gql`
  query getStores($query: String, $limit: Int, $offset: Int) {
    getStores(query: $query, limit: $limit, offset: $offset) {
      business_name_slug
      business_name
      business_image
      business_bio
    }
  }
`;

export const StoresHome = () => {
  // check for error after fetching data then pass as a dependency to the custom useQuery hook
  const [checkError, setCheckError] = useState(false);

  const [data, loading, error] = useQuery(
    getStores,
    {
      query: null,
      limit: 10,
      offset: 0,
    },
    null,
    checkError
  );

  useEffect(() => {
    if (error) {
      setCheckError(!checkError);
    }
  }, []);

  const stores: UsersRes[] = data ? data.getStores : [];

  const images = [
    "slider/slide2.jpeg",
    "slider/slide3.jpeg",
    "slider/slide4.jpeg",
    "slider/slide5.jpeg",
    "slider/slide6.jpeg",
    "slider/slide7.jpeg",
  ];

  return (
    <div>
      <main className="stores-wrap">
        <h1>Find Your Favourite Stores</h1>
        <div className="store-items">
          {stores &&
            stores.map((s, i) => (
              <div className="store-item" key={s.business_name_slug}>
                <Link href={`/store/${s.business_name_slug}`}>
                  <a>
                    <div
                      className="store-img"
                      style={{
                        backgroundImage: `url(${
                          s.business_image || images[i]
                        })`,
                        backgroundPosition: "center",
                        objectFit: "cover",
                      }}
                    >
                      <h3>{s.business_name}</h3>
                    </div>

                    <div className="store-desc">
                      <h4 className="bio">
                        {truncate(s.business_bio, 60) ||
                          `We Are A Customer First Business`}
                      </h4>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div></div>
          <div style={{ padding: "10px", color: "var(--deepblue)" }}>
            <Link href="/stores">
              <a>
                {screenWidth() > 700
                  ? "Click here to find more Stores..."
                  : "Find More..."}
              </a>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .stores-wrap {
          margin: 25px auto;
          width: 100%;
        }
        h1 {
          text-align: center;
          font-weight: bold;
          font-size: 1.1rem;
          margin: 15px 0;
        }

        .store-items {
          display: flex;
          overflow-x: scroll;
          align-items: center;
        }

        .store-item {
          box-shadow: var(--box) var(--softgrey);
          background: white;
          border-radius: 3px;
          padding: 3px;
          margin: 3px;
          width: 130px;
          height: 180px;
        }
        .store-img {
          width: 100%;
          height: 130px;
          border-radius: 5px;
          text-align: center;
          object-fit: contain;
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
        .store-desc h4 {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
        }

        @media only screen and (min-width: 700px) {
          .stores-wrap {
            width: 85%;
          }

          .store-item {
            height: 188px;
          }
          .store-img {
            height: 120px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .stores-wrap {
            width: 80%;
          }
          .store-item {
            margin: 8px;
            width: 150px;
            height: 200px;
          }
          .store-img {
            height: 150px;
          }
        }

        @media only screen and (min-width: 1800px) {
          .stores-wrap {
            width: 70%;
          }
        }

        @media only screen and (min-width: 2000px) {
          .stores-wrap {
            width: 60%;
          }
        }
      `}</style>
    </div>
  );
};
