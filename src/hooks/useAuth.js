import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isResearcher = false;
  let status = "User";

  if (token) {
    const decoded = jwtDecode(token);
    const { Username, roles, active } = decoded.UserInfo;

    isAdmin = roles.includes("Admin");
    isResearcher = roles.includes("Researcher");

    if (isAdmin) status = "Admin";
    if (isResearcher) status = "Researcher";

    return { Username, status, roles, active, isAdmin, isResearcher };
  }

  return { Username: "", roles: [], status };
};

export default useAuth;
