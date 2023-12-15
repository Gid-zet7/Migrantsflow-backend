import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create a migrants adapter with entity adapter to give us a normalized state (data which contains an ids array and entities)
const migrantsAdapter = createEntityAdapter({});

// then we retrieve the initialState if it exists in the migrantAdapter
const initialState = migrantsAdapter.getInitialState();

// We inject the endpoints into the apiSlice
export const migrantsApiSlice = apiSlice.injectEndpoints({
  // getMigrants queries to the migrants endpoint to GET data
  endpoints: (builder) => ({
    getMigrants: builder.query({
      query: () => ({
        url: "/migrants",
        // We validate the status to make sure there is no error and we receive a 200 status
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      //  Since mongoDb gives us and underscore id(_.id) We transform our user id property to make sure our normalised id array works out fine
      transformResponse: (responseData) => {
        const loadedMigrants = responseData.map((migrant) => {
          migrant.id = migrant._id;
          return migrant;
        });
        // We provide the transformed data to the migrantsAdapter to get our normalised data with ids and entities
        return migrantsAdapter.setAll(initialState, loadedMigrants);
      },
      // Provides the tags that can be invalidated
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Migrant", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Migrant", id })),
          ];
        } else return [{ type: "Migrant", id: "LIST" }];
      },
    }),
    addNewMigrant: builder.mutation({
      // We pass in initial data in the body as we query to the migrant endpoint
      query: (initialMigrantData) => ({
        url: "/migrants",
        method: "POST",
        body: {
          ...initialMigrantData,
        },
      }),
      // This updates migrant list cached data
      invalidatesTags: [{ type: "Migrant", id: "LIST" }],
    }),
    updateMigrant: builder.mutation({
      query: (initialMigrantData) => ({
        url: "/migrants",
        method: "PATCH",
        body: {
          ...initialMigrantData,
        },
      }),
      // We specify the id of the migrant to invalidate that specific migrant
      invalidatesTags: (result, error, arg) => [
        { type: "Migrant", id: arg.id },
      ],
    }),
    deleteMigrant: builder.mutation({
      query: ({ id }) => ({
        url: "/migrants",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Migrant", id: arg.id },
      ],
    }),
  }),
});

// RTK query creates hooks based on the endpoints for us automaticaly
export const {
  useGetMigrantsQuery,
  useAddNewMigrantMutation,
  useUpdateMigrantMutation,
  useDeleteMigrantMutation,
} = migrantsApiSlice;

// This gets the query result
export const selectMigrantsResult =
  migrantsApiSlice.endpoints.getMigrants.select();

// Creates memoized selector
const selectMigrantsData = createSelector(
  selectMigrantsResult,
  (migrantsResult) => migrantsResult.data //normalized state object with ids and entities
);

// These are memoized selectors
// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllMigrants,
  selectById: selectMigrantsById,
  selectIds: selectMigrantIds,
  // Pass in a selector that returns the migrants slice of state
} = migrantsAdapter.getSelectors(
  (state) => selectMigrantsData(state) ?? initialState
);
