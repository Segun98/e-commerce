import { combineReducers } from "@reduxjs/toolkit";
import cart from "./features/cart/fetchCart";
import orders from "./features/orders/fetchOrders";

const reducers = combineReducers({
  cart,
  orders,
});

export default reducers;
