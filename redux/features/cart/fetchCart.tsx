import { createSlice } from "@reduxjs/toolkit";
import { getCartItemsCartPage } from "@/graphql/customer";
import { Cart } from "@/Typescript/types";
import { graphQLClient } from "@/utils/client";

export interface IinitialState {
  cart: Cart[];
  cartLength: number;
  loading: boolean;
  error: string;
}

let initialState: IinitialState = {
  cart: [],
  cartLength: 0,
  loading: true,
  error: "",
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCart(state, action: { payload: Cart[]; type: string }) {
      let data = action.payload;
      state.cart = data;
      state.cartLength = data.length;
      state.loading = false;
    },
    errorResponse(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default cartSlice.reducer;
export const { getCart, errorResponse } = cartSlice.actions;

// get cart items thunk
export function cartItems(variables) {
  return async (dispatch) => {
    try {
      const res = await graphQLClient.request(getCartItemsCartPage, variables);
      const data: Cart[] = res.getCartItems;
      dispatch(getCart(data));
    } catch (err) {
      let error = err?.response?.errors[0].message || err.message;
      dispatch(errorResponse(error));
    }
  };
}
