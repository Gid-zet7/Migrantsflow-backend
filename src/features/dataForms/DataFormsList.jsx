import { useGetDataFormsQuery } from "./dataFormsApiSlice";
import { PulseLoader } from "react-spinners";
import DataForm from "./DataForm";
// import { useEffect } from "react";

const DataFormsList = () => {
  const {
    data: dataforms, //we rename the data using destructuring
    //We have several state that we can monitor here
    isLoading,
    isSuccess,
    isError,
    error,
    // useGetDataFormsQuery is the hook that RTK query automatically created for us
  } = useGetDataFormsQuery("dataFormsList", {
    pollingInterval: 1000000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  // We check if isLoading is true then we set the content to a pulse loader
  if (isLoading)
    content = (
      <div className="loader-container">
        <PulseLoader color={"#000"} className="pulse-loader" />
      </div>
    );

  // If isError is true then we set the content to display the error message
  if (isError) {
    content = <p className="errmsg">{error?.data?.message} </p>;
  }

  // If isSuccess is true then we set the content to display dataforms
  if (isSuccess) {
    // Destructure ids from the data(now called dataforms)
    const { ids } = dataforms;

    const divContent =
      // Provide the ids to the DataForm component
      ids?.length &&
      ids.map((dataformId) => (
        <DataForm key={dataformId} dataformId={dataformId} />
      ));

    content = (
      <div
        className="div div--dataforms"
        style={{
          marginTop: "9rem",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {divContent}
      </div>
    );
  }
  return content;
};

export default DataFormsList;
