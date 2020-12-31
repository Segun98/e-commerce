import { GraphQLClient } from "graphql-request";

export let refreshTokenLink =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/api/refreshtoken"
    : "http://localhost:4000/api/refreshtoken";
// "https://apipartystore.herokuapp.com/api/refreshtoken",

//IMAGE UPLOAD LINK
export let uploadLink =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/api/upload"
    : "http://localhost:4000/api/upload";
// "https://apipartystore.herokuapp.com/api/upload",

//GOOGLE OUATH REST API ENDPOINTS
export let oAuthLoginLink =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/api/oauth/login"
    : "http://localhost:4000/api/oauth/login";
// "https://apipartystore.herokuapp.com/api/oauth/login",

export let oAuthSignupLink =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/api/oauth/signup"
    : "http://localhost:4000/api/oauth/signup";
// "https://apipartystore.herokuapp.com/api/oauth/signup",

export let logoutLink =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/api/logout"
    : "http://localhost:4000/api/logout";
// "https://apipartystore.herokuapp.com/api/logout",

//GOOGLE CLIENT ID
export let CLIENT_ID = process.env.CLIENT_ID;

//GRAPHQL API ENDPOINTS
export let graphqlEndpoint =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/graphql"
    : "http://localhost:4000/graphql";
// "https://apipartystore.herokuapp.com/graphql",

export let restEndpoint =
  process.env.NODE_ENV === "production"
    ? "https://apipartystore.vercel.app/api"
    : "http://localhost:4000/api";

export const graphQLClient = new GraphQLClient(graphqlEndpoint, {
  // headers: {
  //   authorization: `bearer ${Token}`,
  // },
  credentials: "include",
});
