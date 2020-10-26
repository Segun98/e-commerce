import { GraphQLClient } from "graphql-request";

//REFRESHTOKEN LINK
export let restLink = [
  "https://apipartystore.herokuapp.com/api/refreshtoken",
  "http://localhost:4000/api/refreshtoken",
  "https://apipartystore.vercel.app/api/refreshtoken",
];

//IMAGE UPLOAD LINK
export let uploadLink = [
  "https://apipartystore.herokuapp.com/api/upload",
  "http://localhost:4000/api/upload",
  "https://apipartystore.vercel.app/api/upload",
];

//GOOGLE OUATH REST API ENDPOINTS
export let oAuthLoginLink = [
  "https://apipartystore.herokuapp.com/api/oauth/login",
  "http://localhost:4000/api/oauth/login",
  "https://apipartystore.vercel.app/api/oauth/login",
];

export let oAuthSignupLink = [
  "https://apipartystore.herokuapp.com/api/oauth/signup",
  "http://localhost:4000/api/oauth/signup",
  "https://apipartystore.vercel.app/api/oauth/signup",
];

export let logoutLink = [
  "https://apipartystore.herokuapp.com/api/logout",
  "http://localhost:4000/api/logout",
  "https://apipartystore.vercel.app/api/logout",
];

//GOOGLE CLIENT ID
export let CLIENT_ID = process.env.CLIENT_ID;

//GRAPHQL API ENDPOINTS
let links = [
  "https://apipartystore.herokuapp.com/graphql",
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
