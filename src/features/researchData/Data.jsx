import { useGetDataQuery } from "./DataApiSlice";
import { memo } from "react";
// import { Link } from "react-router-dom";

const Data = ({ dataId }) => {
  const { data } = useGetDataQuery("dataList", {
    selectFromResult: ({ data }) => ({
      data: data?.entities[dataId],
    }),
  });

  if (data) {
    return (
      <tr>
        <td>{data.data.migrant ? data.data.migrant : "Unknown"}</td>
        <td>{data.data.question}</td>
        <td>{data.data.response}</td>
        <td>{data.data.value}</td>
      </tr>
    );
  } else return null;
};

const memoizedData = memo(Data);

export default memoizedData;
