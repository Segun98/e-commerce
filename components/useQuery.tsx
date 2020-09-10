import { useEffect, useState } from "react";
import { graphQLClient } from "../utils/client";

export const useQuery = (Query: any, Variables?: {}, Token?: string) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function query() {
      try {
        setError(false);
        setLoading(true);
        if (Token) {
          graphQLClient.setHeader("authorization", `bearer ${Token}`);
        }

        const res = await graphQLClient.request(Query, Variables);
        if (res) {
          setError(false);
          setLoading(false);
          setData(res);
        }
      } catch (err) {
        setLoading(false);
        if (err.response?.errors[0].message !== "jwt must be provided") {
          setError(true);
        }
        // console.log(err.response?.errors[0].message);
        // console.log(err.message);
      }
    }
    query();
  }, [Token ? Token : null]);
  return [data, loading, error];
};
