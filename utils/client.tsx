import { GraphQLClient } from "graphql-request";

//REFRESHTOKEN LINK
export let restLink = [
  "http://localhost:4000/api/refreshtoken",
  "https://apipartystore.vercel.app/api/refreshtoken",
];

//IMAGE UPLOAD LINK
export let uploadLink = [
  "http://localhost:4000/api/upload",
  "https://apipartystore.vercel.app/api/upload",
];

//GOOGLE OUATH REST API ENDPOINTS
export let oAuthLoginLink = [
  "http://localhost:4000/api/oauth/login",
  "https://apipartystore.vercel.app/api/oauth/login",
];

export let oAuthSignupLink = [
  "http://localhost:4000/api/oauth/signup",
  "https://apipartystore.vercel.app/api/oauth/signup",
];

//GOOGLE CLIENT ID
export let CLIENT_ID = "";

//GRAPHQL API ENDPOINTS
let links = [
  "http://localhost:4000/graphql",
  "https://apipartystore.vercel.app/graphql",
];

export const endpoint = links[0];

export const graphQLClient = new GraphQLClient(endpoint, {
  // headers: {
  //   authorization: `bearer ${Token}`,
  // },
  credentials: "include",
});
