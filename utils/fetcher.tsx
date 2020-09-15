import { graphQLClient } from "./client";

//fetcher function for SWR for GraphQL queries
/* I only use this when i'm fetching without a token because it takes a sec for Token to load from context leading to SWR not loading at first */

export default async function queryFunc(
  Query: any,
  Variables?: {},
  Token?: string
) {
  if (Token) {
    graphQLClient.setHeader("authorization", `bearer ${Token}`);
  }
  const res = await graphQLClient.request(Query, Variables);
  return res;
}
