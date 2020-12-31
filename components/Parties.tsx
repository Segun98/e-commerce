import { partyCategory } from "pages/party";
import { ProductsRes } from "@/Typescript/types";
import { useQuery } from "./useQuery";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Commas, truncate } from "@/utils/helpers";

interface PartiesProps {
  title: string;
  party: string;
}

export const Parties: React.FC<PartiesProps> = ({ title, party }) => {
  // check for error after fetching data then pass as a dependency to the custom useQuery hook
  const [checkError, setCheckError] = useState(false);

  const [data, loading, error] = useQuery(
    partyCategory,
    { limit: 10, offset: 0, party_category: party },
    null,
    checkError
  );

  useEffect(() => {
    if (error) {
      setCheckError(!checkError);
    }
  }, []);

  const products: ProductsRes[] = data ? data.partyCategory : [];

  return (
    <div className="home-party-wrap">
      <h1>{title}</h1>
      <div className="home-party-items">
        {data &&
          products &&
          products.map((p) => (
            <div className="home-party-product" key={p.id}>
              <Link href={`/product/${p.name_slug}`}>
                <a>
                  <img src={p.images[0]} alt="" />
                  <div className="product-info">
                    <h2>{truncate(p.name, 20)}</h2>
                    <p>{Commas(p.price)}</p>
                  </div>
                </a>
              </Link>
            </div>
          ))}
      </div>

      <style jsx>{`
        .home-party-wrap {
          margin: 25px auto;
          width: 95%;
        }
        h1 {
          text-align: center;
          font-weight: bold;
          font-size: 1.1rem;
          margin: 15px 0;
        }

        .home-party-items {
          display: flex;
          overflow-x: scroll;
          align-items: center;
        }

        .home-party-product {
          box-shadow: var(--box) var(--softgrey);
          background: white;
          border-radius: 5px;
          padding: 3px;
          margin: 8px;
          width: 100px;
          height: 150px;
        }
        .home-party-product img {
          width: 100%;
          height: 60px;
          border-radius: 5px;
          text-align: center;
        }

        .product-info {
          margin: 5px 0;
          text-align: center;
          font-size: 0.8rem;
        }
        h2 {
          color: var(--deepblue);
          font-weight: bold;
          padding: 5px 0;
        }

        p {
          font-weight: bold;
        }

        @media only screen and (min-width: 700px) {
          .home-party-wrap {
            width: 85%;
          }

          .home-party-product img {
            height: 70px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .home-party-wrap {
            width: 80%;
          }
          .home-party-product {
            margin: 8px;
            width: 150px;
            height: 180px;
          }
          .home-party-product img {
            height: 100px;
          }
          .product-info {
            font-size: 0.9rem;
          }
        }

        @media only screen and (min-width: 1800px) {
          .product-info {
            font-size: 1rem;
          }
          .home-party-wrap {
            width: 70%;
          }
        }

        @media only screen and (min-width: 2000px) {
          .home-party-wrap {
            width: 60%;
          }
        }
      `}</style>
    </div>
  );
};
