import { graphQLClient } from "./client";

//custom function
export async function useMutation(Mutation: string, Variables, Token?) {
  try {
    if (Token) {
      graphQLClient.setHeader("authorization", `bearer ${Token}`);
    }
    const res = await graphQLClient.request(Mutation, Variables);

    if (res) {
      return {
        data: res,
        error: false,
      };
    }
  } catch (err) {
    // console.log(err);
    // console.log(err.response?.errors[0].message);
    return {
      data: undefined,
      error: err,
    };
  }
}
