import { configureStore } from "@reduxjs/toolkit";
import reducers from "./combine-reducers";

const store = configureStore({
  reducer: reducers,
});

export default store;
