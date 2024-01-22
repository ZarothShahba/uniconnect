import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  events: [],
  allUsers: [],
  groups: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    // setPost: (state, action) => {
    //   const updatedPosts = state.posts.map((post) => {
    //     if (post._id === action.payload.post._id) return action.payload.post;
    //     return post;
    //   });
    //   state.posts = updatedPosts;
    // },
    setPost: (state, action) => {
      if (action.payload.post) {
        // Update the existing post
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload.post._id) return action.payload.post;
          return post;
        });
        state.posts = updatedPosts;
      } else {
        // Remove the deleted post
        const updatedPosts = state.posts.filter(
          (post) => post._id !== action.payload.deletedPostId
        );
        state.posts = updatedPosts;
      }
    },
    setEvent: (state, action) => {
      state.events = action.payload.events;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload.allUsers;
    },
    setGroups: (state, action) => {
      state.groups = action.payload.groups;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setEvent,
  setAllUsers,
  setGroups,
} = authSlice.actions;
export default authSlice.reducer;
