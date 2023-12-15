import { useGetDataQuery } from "./DataApiSlice";
import { PulseLoader } from "react-spinners";
import Data from "./Data";
// import { useEffect } from "react";
import DataChart from "./Chart";

const DataList = () => {
  const {
    data,
    //We have several state that we can monitor here
    isLoading,
    isSuccess,
    isError,
    error,
    // useGetDataQuery is the hook that RTK query automatically created for us
  } = useGetDataQuery("dataList", {
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

  // If isSuccess is true then we set the content to display data
  if (isSuccess) {
    // Destructure ids from the data(now called data)
    const { ids } = data;

    const tableContent =
      // Provide the ids to the Data component
      ids?.length && ids.map((dataId) => <Data key={dataId} dataId={dataId} />);

    // const chartContent =
    //   ids?.length &&
    //   ids.map((dataId) => <DataChart key={dataId} dataId={dataId} />);

    content = (
      <>
        <table
          className="table table--migrants"
          style={{ marginTop: "9rem", padding: "2rem" }}
        >
          <thead>
            <tr>
              <th>Migrant</th>
              <th>Questions</th>
              <th>Responses</th>
              <th>No. of Responses</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
        <div>
          <DataChart />
        </div>
      </>
    );
  }
  return content;
};

export default DataList;
