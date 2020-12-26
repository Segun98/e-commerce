import { graphQLClient } from "./client";

//fetcher function for SWR for GraphQL queries

export default async function queryFunc(
  Query: string,
  Variables?: {},
  Token?: string
) {
  if (Token) {
    graphQLClient.setHeader("authorization", `bearer ${Token}`);
  }
  const res = await graphQLClient.request(Query, Variables);
  return res;
}
