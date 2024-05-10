import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";

export const Store = configureStore({
  reducer: {
    user: userSlice,
  },
});
