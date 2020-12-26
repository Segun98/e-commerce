import { GraphQLClient } from "graphql-request";

// export let theLink = process.env.NODE_ENV === "production"?"https://apipartystore.herokuapp.com/api/refreshtoken":"http://localhost:4000/api/refreshtoken"

//REFRESHTOKEN LINK
export let restLink = [
  "http://localhost:4000/api/refreshtoken",
  "https://apipartystore.herokuapp.com/api/refreshtoken",
  "https://apipartystore.vercel.app/api/refreshtoken",
];

//IMAGE UPLOAD LINK
export let uploadLink = [
  "http://localhost:4000/api/upload",
  "https://apipartystore.herokuapp.com/api/upload",
  "https://apipartystore.vercel.app/api/upload",
];

//GOOGLE OUATH REST API ENDPOINTS
export let oAuthLoginLink = [
  "http://localhost:4000/api/oauth/login",
  "https://apipartystore.herokuapp.com/api/oauth/login",
  "https://apipartystore.vercel.app/api/oauth/login",
];

export let oAuthSignupLink = [
  "http://localhost:4000/api/oauth/signup",
  "https://apipartystore.herokuapp.com/api/oauth/signup",
  "https://apipartystore.vercel.app/api/oauth/signup",
];

export let logoutLink = [
  "http://localhost:4000/api/logout",
  "https://apipartystore.herokuapp.com/api/logout",
  "https://apipartystore.vercel.app/api/logout",
];

//GOOGLE CLIENT ID
export let CLIENT_ID = process.env.CLIENT_ID;

//GRAPHQL API ENDPOINTS
let links = [
  "http://localhost:4000/graphql",
  "https://apipartystore.herokuapp.com/graphql",
  "https://apipartystore.vercel.app/graphql",
];

export const endpoint = links[0];

export const graphQLClient = new GraphQLClient(endpoint, {
  // headers: {
  //   authorization: `bearer ${Token}`,
  // },
  credentials: "include",
});
