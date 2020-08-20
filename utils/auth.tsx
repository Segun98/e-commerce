import { GraphQLClient } from "graphql-request";
import axios from "axios";

export const endpoint = "http://localhost:4000/graphql";

export let accessToken: string = "";

export const setToken = (s: string) => {
  accessToken = s;
};

export async function fetchRefreshToken() {
  const instance = axios.create({
    withCredentials: true,
  });

  try {
    const res = await instance.post(`http://localhost:4000/api/refreshtoken`);
    setToken(res.data.accessToken);
    console.clear();
  } catch (error) {
    // if (error.message === "Request failed with status code 401") {
    //   setisAuth(false);
    // }
    console.log(error.message);
  }
}

export const getToken = (): string => {
  return accessToken;
};
export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `bearer ${getToken()}`,
  },
  credentials: "include", //"omit"
});
