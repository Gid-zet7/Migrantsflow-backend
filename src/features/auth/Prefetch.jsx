import { store } from "../../app/store";
import { dataApiSlice } from "../researchData/DataApiSlice";
import { dataFormsApiSlice } from "../dataForms/dataFormsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { migrantsApiSlice } from "../migrants/migrantApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    // We create a manual subscription to get access to the state and prevents it from expiring in the default 60 seconds
    store.dispatch(
      dataApiSlice.util.prefetch("getData", "dataList", {
        force: true,
      })
    );
    store.dispatch(
      dataFormsApiSlice.util.prefetch("getDataForms", "dataFormsList", {
        force: true,
      })
    );
    store.dispatch(
      migrantsApiSlice.util.prefetch("getMigrants", "migrantsList", {
        force: true,
      })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;
