import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://migrantsflow-api.onrender.com",
  // ensures our cookie is sent
  credentials: "include",
  // We prepare our headers
  prepareHeaders: (headers, { getState }) => {
    // we destructure getState and use it to get the the current state of our app and retrieve the current token
    const token = getState().auth.token;

    // We set authorization header with the retrieved token
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  // This is applied to every request we send
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired";
      }
      return refreshResult;
    }
  }
  return result;
};

// Creating the api
export const apiSlice = createApi({
  // Set base url to fetch or perform operations on data to the backend
  baseQuery: baseQueryWithReauth,

  // Tag types will be used for cached data
  tagTypes: ["Data Form", "Migrant", "User"],

  //   We will attach extended slices for data form, migrant, and user to this api slice
  endpoints: (builder) => ({}),
});
