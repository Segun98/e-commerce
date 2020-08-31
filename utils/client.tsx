import { GraphQLClient } from "graphql-request";

export const endpoint = "http://localhost:4000/graphql";

export const graphQLClient = new GraphQLClient(endpoint, {
  // headers: {
  //   authorization: `bearer ${Token}`,
  // },
  credentials: "include", //"omit"
});
