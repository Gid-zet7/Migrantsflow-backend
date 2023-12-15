import { useGetUsersQuery } from "./usersApiSlice";
import { PulseLoader } from "react-spinners";
import User from "./User";

const UsersList = () => {
  const {
    data: users, //we rename the data using destructuring
    //We have several state that we can monitor here
    isLoading,
    isSuccess,
    isError,
    error,
    // useGetUsersQuery is the hook that RTK query automatically created for us
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000, //Refreshes the data every 60 seconds
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

  // If isSuccess is true then we set the content to display users
  if (isSuccess) {
    // Destructure ids from the data(now called users)
    const { ids } = users;

    const tableContent =
      // Provide the ids to the User component
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <div className="migrants__table-container">
        <table
          className="table table--users"
          style={{ marginTop: "9rem", padding: "2rem" }}
        >
          <thead>
            <tr>
              <th>Username</th>
              <th>Roles</th>
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

export default UsersList;
