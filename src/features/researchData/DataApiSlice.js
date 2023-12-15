import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create a data adapter with entity adapter to give us a normalized state (data which contains an ids array and entities)
const dataAdapter = createEntityAdapter({});

// then we retrieve the initialState if it exists in the dataAdapter
const initialState = dataAdapter.getInitialState();

// We inject the endpoints into the apiSlice
export const dataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getData queries to the data endpoint to GET data
    getData: builder.query({
      query: () => ({
        url: "/data",
        // We validate the status to make sure there is no error and we receive a 200 status
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      //  Since mongoDb gives us and underscore id(_.id) We transform our user id property to make sure our normalised id array works out fine
      transformResponse: (responseData) => {
        const loadedData = responseData.map((data) => {
          data.id = data._id;
          return data;
        });
        // We provide the transformed data to the dataFormAdapter to get our normalised data with ids and entities
        return dataAdapter.setAll(initialState, loadedData);
      },
      //   Provides the tags that can be invalidated
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Data", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Data", id })),
          ];
        } else return [{ type: "Data", id: "LIST" }];
      },
    }),
    addNewData: builder.mutation({
      // We pass in initial data in the body as we query to the data endpoint
      query: (initialData) => ({
        url: "/data",
        method: "POST",
        body: {
          ...initialData,
        },
      }),
      // This updates data list cached data
      invalidatesTags: [{ type: "Data", id: "LIST" }],
    }),
    deleteData: builder.mutation({
      query: ({ id }) => ({
        url: "/data",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Data", id: arg.id }],
    }),
  }),
});

// RTK query creates hooks based on the endpoints for us automaticaly
export const { useGetDataQuery, useAddNewDataMutation, useDeleteDataMutation } =
  dataApiSlice;

// This gets the query result
export const selectDataResult = dataApiSlice.endpoints.getData.select();

// Creates memoized selector
const selectDataData = createSelector(
  selectDataResult,
  (dataResult) => dataResult.data //normalized state object with ids and entities
);

// These are memoized selectors
// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllData,
  selectById: selectDataById,
  selectIds: selectDataIds,
  // Pass in a selector that returns the data slice of state
} = dataAdapter.getSelectors((state) => selectDataData(state) ?? initialState);
