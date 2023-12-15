import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  // Name prevents us from setting 'state.auth.something' we can go ahead and set 'state.something'
  name: "auth",
  // Set token to null because we should expect to receive a token from our api
  initialState: { token: null },
  // Add reducers
  reducers: {
    // Retrieves the token from the payload and set it to the state
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    // Sets the state token to null
    logOut: (state, action) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
