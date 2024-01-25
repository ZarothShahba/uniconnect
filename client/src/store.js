import { configureStore } from "@reduxjs/toolkit";

// Import reducers
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: { auth: authReducer },
});

export default store;
