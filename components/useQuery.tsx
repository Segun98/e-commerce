import { useEffect, useState } from "react";
import { graphQLClient } from "../utils/client";

//custom react hook

export const useQuery = (Query: any, Variables?: {}, Token?: string) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function query() {
      try {
        setError("");
        setLoading(true);
        if (Token) {
          graphQLClient.setHeader("authorization", `bearer ${Token}`);
        }

        const res = await graphQLClient.request(Query, Variables);
        if (res) {
          setError("");
          setLoading(false);
          setData(res);
        }
      } catch (err) {
        setLoading(false);
        if (Token && err) {
          setError(err);
        }
        // handle network errors if request doesn't require a token
        if (err.message === "Network request failed") {
          setError(err);
        }
        // console.log(err.response?.errors[0].message);
        // console.log(err.message);
      }
    }
    query();
  }, [Token ? Token : null]);
  return [data, loading, error];
};
