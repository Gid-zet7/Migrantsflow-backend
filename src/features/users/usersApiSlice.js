import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create a users adapter with entity adapter to give us a normalized state (data which contains an ids array and entities)
const usersAdapter = createEntityAdapter({});

// then we retrieve the initialState if it exists in the userAdapter
const initialState = usersAdapter.getInitialState();

// We inject the endpoints into the apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getUsers queries to the users endpoint to GET data
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        // We validate the status to make sure there is no error and we receive a 200 status
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      //  Since mongoDb gives us and underscore id(_.id) We transform our user id property to make sure our normalised id array works out fine
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        // We provide the transformed data to the usersAdapter to get our normalised data with ids and entities
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      // Provides the tags that can be invalidated
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),

    addNewUser: builder.mutation({
      // We pass in initial data in the body as we query to the users endpoint
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      // This updates user list cached data
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      // We specify the id of the user to invalidate that specific user
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

// RTK query creates hooks based on the endpoints for us automaticaly
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// This gets the query result
export const seletUsersResult = usersApiSlice.endpoints.getUsers.select();

// Creates memoized selector
const selectUsersData = createSelector(
  seletUsersResult,
  (usersResult) => usersResult.data //normalized state object with ids and entities
);

// These are memoized selectors
// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUsersById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
