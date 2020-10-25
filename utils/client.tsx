import { GraphQLClient } from "graphql-request";

//REFRESHTOKEN LINK
export let restLink = [
  "https://apipartystore.herokuapp.com/api/refreshtoken",
  "https://apipartystore.vercel.app/api/refreshtoken",
  "http://localhost:4000/api/refreshtoken",
];

//IMAGE UPLOAD LINK
export let uploadLink = [
  "https://apipartystore.herokuapp.com/api/upload",
  "https://apipartystore.vercel.app/api/upload",
  "http://localhost:4000/api/upload",
];

//GOOGLE OUATH REST API ENDPOINTS
export let oAuthLoginLink = [
  "https://apipartystore.herokuapp.com/api/oauth/login",
  "https://apipartystore.vercel.app/api/oauth/login",
  "http://localhost:4000/api/oauth/login",
];

export let oAuthSignupLink = [
  "https://apipartystore.herokuapp.com/api/oauth/signup",
  "https://apipartystore.vercel.app/api/oauth/signup",
  "http://localhost:4000/api/oauth/signup",
];

//GOOGLE CLIENT ID
export let CLIENT_ID = "";

//GRAPHQL API ENDPOINTS
let links = [
  "https://apipartystore.herokuapp.com/graphql",
  "https://apipartystore.vercel.app/graphql",
  "http://localhost:4000/graphql",
];

export const endpoint = links[0];

export const graphQLClient = new GraphQLClient(endpoint, {
  // headers: {
  //   authorization: `bearer ${Token}`,
  // },
  credentials: "include",
});
