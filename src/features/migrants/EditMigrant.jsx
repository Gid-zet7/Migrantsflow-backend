import { useParams } from "react-router-dom";
import EditMigrantForm from "./EditMigrantForm";
import { useGetMigrantsQuery } from "./migrantApiSlice";
import { PulseLoader } from "react-spinners";
// import { useEffect } from "react";

const EditMigrant = () => {
  const { id } = useParams();

  const { migrants } = useGetMigrantsQuery("migrantsList", {
    selectFromResult: ({ data }) => ({
      migrants: data?.entities[id],
    }),
  });

  if (!migrants)
    return (
      <div className="loader-container">
        <PulseLoader color={"#000"} className="pulse-loader" />
      </div>
    );

  const content = <EditMigrantForm migrant={migrants} />;

  return content;
};

export default EditMigrant;
