import { useGetMigrantsQuery } from "./migrantApiSlice";
import { PulseLoader } from "react-spinners";
import Migrant from "./Migrant";

const MigrantsList = () => {
  const {
    data: migrants, //we rename the data using destructuring
    //We have several state that we can monitor here
    isLoading,
    isSuccess,
    isError,
    error,
    // useGetMigrantsQuery is the hook that RTK query automatically created for us
  } = useGetMigrantsQuery("migrantsList", {
    pollingInterval: 60000,
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

  // If isSuccess is true then we set the content to display migrants information
  if (isSuccess) {
    // Destructure ids from the data(now called migrants)
    const { ids } = migrants;

    const tableContent =
      // Provide the ids to the Migrant component
      ids?.length &&
      ids.map((migrantId) => <Migrant key={migrantId} migrantId={migrantId} />);

    content = (
      <div className="migrants__table-container">
        <table
          className="table table--migrants"
          style={{ marginTop: "9rem", padding: "2rem" }}
        >
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Nationality</th>
              <th>Migration Status</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </div>
    );
  }
  return content;
};

export default MigrantsList;
