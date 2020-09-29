import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/fetchCart";
export default configureStore({
  reducer: {
    cart: cartSlice,
  },
});
