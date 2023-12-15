import { useNavigate } from "react-router-dom";
import { useGetMigrantsQuery } from "./migrantApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";

const Migrant = ({ migrantId }) => {
  // Destructure the migrant from result
  const { migrant } = useGetMigrantsQuery("migrantsList", {
    selectFromResult: ({ data }) => ({
      migrant: data?.entities[migrantId],
    }),
  });

  const navigate = useNavigate();

  if (migrant) {
    const handleEdit = () =>
      navigate(`/dashboard/migrants/editmigrant/${migrantId}`);

    return (
      <tr>
        <td className={"table__cell"}>
          <Link to={`/dash/migrants/${migrant.id}`}>{migrant.first_name}</Link>
        </td>
        <td className={"table__cell"}>{migrant.last_name}</td>
        <td className={"table__cell"}>{migrant.gender}</td>
        <td className={"table__cell"}>{migrant.nationality}</td>
        <td className={"table__cell"}>{migrant.migration_status}</td>
        <td className={"table__cell"}>{migrant.contact_info.phone}</td>
        <td className={"table__cell"}>{migrant.contact_info.email}</td>
        <td className={"table__cell"}>
          <button className="btn" onClick={handleEdit}>
            Edit
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedMigrant = memo(Migrant);

export default memoizedMigrant;
