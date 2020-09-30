import { createSlice } from "@reduxjs/toolkit";
import { Orders } from "../../../Typescript/types";
import { graphQLClient } from "../../../utils/client";
import { getVendorOrders } from "./../../../graphql/vendor";

export interface IOrderInitialState {
  orders: Orders[];
  loading: boolean;
  error: string;
}

let initialState: IOrderInitialState = {
  orders: [],
  loading: true,
  error: "",
};
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    getOrders(state, action: { payload: Orders[]; type: string }) {
      let data = action.payload;
      state.orders = data;
      state.loading = false;
    },
    errorResponse(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default orderSlice.reducer;
export const { getOrders, errorResponse } = orderSlice.actions;

// get cart items thunk
export function ordersThunk(Token, variables) {
  return async (dispatch) => {
    try {
      if (Token) {
        graphQLClient.setHeader("authorization", `bearer ${Token}`);
      }
      const res = await graphQLClient.request(getVendorOrders, variables);
      const data: Orders[] = res.getVendorOrders;
      if (data) {
        dispatch(getOrders(data));
      }
    } catch (err) {
      let error = err?.response?.errors[0].message || err.message;
      if (Token && err) {
        dispatch(errorResponse(error));
      }
      if (err.message === "Network request failed") {
        dispatch(errorResponse(error));
      }
    }
  };
}
