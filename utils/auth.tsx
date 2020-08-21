import { GraphQLClient } from "graphql-request";
import axios from "axios";
import Cookies from "js-cookie";

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
    if (error.message === "Request failed with status code 401") {
      return Cookies.remove("role");
    }
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
