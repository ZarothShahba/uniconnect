import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser } from "../services/authService";
import setAuthToken from "utils/authUtils";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  isAuthenticated: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = payload.data;
        state.error = null;
        localStorage.setItem("token", JSON.stringify(payload.token));
        localStorage.setItem("user", JSON.stringify(payload.data));
        setAuthToken(localStorage.token);
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = payload.data;
        state.error = null;
        localStorage.setItem("token", JSON.stringify(payload.token));
        localStorage.setItem("user", JSON.stringify(payload.data));
        setAuthToken(localStorage.token);
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = null;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(localStorage.token);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

// Action creators
export const login = createAsyncThunk("auth/login", async (requestBody) => {
  const response = await loginUser(requestBody);
  return response.data;
});

export const register = createAsyncThunk(
  "auth/register",
  async (requestBody) => {
    const response = await registerUser(requestBody);
    return response.data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await logoutUser();
  return response.data;
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
