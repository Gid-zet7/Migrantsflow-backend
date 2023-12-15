import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardFooter from "./DashboardFooter";

const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <main>
        <Outlet />
        <DashboardFooter />
      </main>
    </>
  );
};

export default DashboardLayout;
