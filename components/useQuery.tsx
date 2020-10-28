import { useEffect, useState } from "react";
import { graphQLClient } from "../utils/client";

//custom react hook
export const useQuery = (
  Query: string,
  Variables?: {},
  Token?: string,
  dependency?: any
) => {
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
        //queries that require a token might run before Token gets passed from context, this is to prevent unauthoarization errors for a user who is signed in
        if (Token && err) {
          setError(err);
        }
        // handle network errors
        if (err.message === "Network request failed") {
          setError(err);
        }
        // console.log(err.response?.errors[0].message);
        // console.log(err.message);
      }
    }
    query();
  }, [Token, dependency]);
  return [data, loading, error];
};
