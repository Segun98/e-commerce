import { GraphQLClient } from "graphql-request";

export let restLink = [
  "https://apipartystore.vercel.app/api/refreshtoken",
  "http://localhost:4000/api/refreshtoken",
];
export let uploadLink = [
  "https://apipartystore.vercel.app/api/upload",
  "http://localhost:4000/api/upload",
];
let links = [
  "https://apipartystore.vercel.app/graphql",
  "http://localhost:4000/graphql",
];
export const endpoint = links[0];

export const graphQLClient = new GraphQLClient(endpoint, {
  // headers: {
  //   authorization: `bearer ${Token}`,
  // },
  credentials: "include", //"omit"
});
