import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import Public from "./components/Public";
import Signup from "./features/auth/Signup";
import Welcome from "./features/auth/Welcome";
import MigrantsList from "./features/migrants/MigrantsList";
import UsersList from "./features/users/UsersList";
import DataFormsList from "./features/dataForms/DataFormsList";
import NewDataForm from "./features/dataForms/NewDataForm";
import NewMigrantForm from "./features/migrants/NewMigrantForm";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";
import EditMigrant from "./features/migrants/EditMigrant";
import Login from "./features/auth/Login";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import Prefetch from "./features/auth/Prefetch";
import DataList from "./features/researchData/DataList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="dataforms">
          <Route index element={<DataFormsList />} />
          <Route path="addform" element={<NewDataForm />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index path="welcome" element={<Welcome />} />
                <Route path="data">
                  <Route index element={<DataList />} />
                </Route>
                <Route path="dataforms">
                  <Route index element={<DataFormsList />} />
                  <Route path="addform" element={<NewDataForm />} />
                </Route>
                <Route path="migrants">
                  <Route index element={<MigrantsList />} />
                  <Route path="addmigrant" element={<NewMigrantForm />} />
                  <Route path="editmigrant/:id" element={<EditMigrant />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path="adduser" element={<NewUserForm />} />
                    <Route path="edituser/:id" element={<EditUser />} />
                  </Route>
                </Route>
              </Route>
              {/* End of dashboard route */}
            </Route>
          </Route>
        </Route>
        {/* End of protected Routes */}
      </Route>
    </Routes>
  );
}

export default App;
