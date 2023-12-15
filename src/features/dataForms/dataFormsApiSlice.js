import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Create a dataForm adapter with entity adapter to give us a normalized state (data which contains an ids array and entities)
const dataFormsAdapter = createEntityAdapter({});

// then we retrieve the initialState if it exists in the dataFormsAdapter
const initialState = dataFormsAdapter.getInitialState();

// We inject the endpoints into the apiSlice
export const dataFormsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getDataForm queries to the dataform endpoint to GET data
    getDataForms: builder.query({
      query: () => ({
        url: "/questions",
        // We validate the status to make sure there is no error and we receive a 200 status
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      //  Since mongoDb gives us and underscore id(_.id) We transform our user id property to make sure our normalised id array works out fine
      transformResponse: (responseData) => {
        const loadedDataForms = responseData.map((form) => {
          form.id = form._id;
          return form;
        });
        // We provide the transformed data to the dataFormAdapter to get our normalised data with ids and entities
        return dataFormsAdapter.setAll(initialState, loadedDataForms);
      },
      //   Provides the tags that can be invalidated
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "DataForm", id: "LIST" },
            ...result.ids.map((id) => ({ type: "DataForm", id })),
          ];
        } else return [{ type: "DataForm", id: "LIST" }];
      },
    }),
    addNewDataForm: builder.mutation({
      // We pass in initial data in the body as we query to the dataform endpoint
      query: (initialDataFormData) => ({
        url: "/questions",
        method: "POST",
        body: {
          ...initialDataFormData,
        },
      }),
      // This updates dataform list cached data
      invalidatesTags: [{ type: "DataForm", id: "LIST" }],
    }),
    updateDataForm: builder.mutation({
      query: (initialDataFormData) => ({
        url: "/questions",
        method: "PATCH",
        body: {
          ...initialDataFormData,
        },
      }),
      // We specify the id of the dataform to invalidate that specific form
      invalidatesTags: (result, error, arg) => [
        { type: "DataForm", id: arg.id },
      ],
    }),
    deleteDataForm: builder.mutation({
      query: ({ id }) => ({
        url: "/questions",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "DataForm", id: arg.id },
      ],
    }),
  }),
});

// RTK query creates hooks based on the endpoints for us automaticaly
export const {
  useGetDataFormsQuery,
  useAddNewDataFormMutation,
  useUpdateDataFormMutation,
  useDeleteDataFormMutation,
} = dataFormsApiSlice;

// This gets the query result
export const selectDataFormsResult =
  dataFormsApiSlice.endpoints.getDataForms.select();

// Creates memoized selector
const selectDataFormsData = createSelector(
  selectDataFormsResult,
  (dataFormsResult) => dataFormsResult.data //normalized state object with ids and entities
);

// These are memoized selectors
// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllDataForms,
  selectById: selectDataFormsById,
  selectIds: selectDataFormIds,
  // Pass in a selector that returns the dataform slice of state
} = dataFormsAdapter.getSelectors(
  (state) => selectDataFormsData(state) ?? initialState
);
