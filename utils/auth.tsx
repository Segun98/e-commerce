import { GraphQLClient } from "graphql-request";

export const endpoint = "http://localhost:4000/graphql";

let accessToken: string = "";

export const setToken = (s: string) => {
  accessToken = s;
};

// export const getToken = (): string => {
//   return accessToken;
// };
export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
  credentials: "include", //"omit"
});
