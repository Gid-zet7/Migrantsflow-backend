import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Home } from "@mui/icons-material";

const DashFooter = () => {
  const { Username, status } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const redirectToHome = () => navigate("/dashboard/welcome");

  let redirectBtn = null;
  if (pathname !== "/dashboard") {
    redirectBtn = (
      <Home className="dash-footer" title="Home" onClick={redirectToHome} />
    );
  }

  const content = (
    <footer>
      <div>
        <h6>{Username} </h6>
        <h6>{status} </h6>
        {redirectBtn}
      </div>
      <div className="about-footer">
        <h4>About Migrant Flow</h4>
        <h6>About us</h6>
        <h6>Our mission</h6>
      </div>
      <div className="contact-footer">
        <h4>Contact us</h4>
        <h6>Advertise</h6>
        <h6>Whatsapp</h6>
        <h6>Email</h6>
      </div>
    </footer>
  );
  return content;
};

export default DashFooter;
