import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { PulseLoader } from "react-spinners";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [persist, setPersist] = usePersist();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If login was successful
      // We retrieve the access token after we call the login function from the useLoginMutation hook
      const { accessToken } = await login({ username, password }).unwrap();
      // We set the token to the state
      dispatch(setCredentials({ accessToken }));
      // Empty out the input fields
      setUsername("");
      setPassword("");
      // Navigates user to the welcome page
      navigate("/dashboard/welcome");
    } catch (err) {
      // We set err msg if there's an error
      if (!err.status) {
        setErrMsg("No server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePasswordInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  // If error we apply the error class
  const errClass = errMsg ? "errMsg" : "offscreen";

  if (isLoading)
    return (
      <div className="loader-container">
        <PulseLoader color={"#000"} className="pulse-loader" />
      </div>
    );

  const content = (
    <div
      id="login"
      className="auth"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        <p className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form id="login_form" onSubmit={handleSubmit}>
          <div id="auth_header">
            <h2 style={{ color: "#fff" }}>Login</h2>
          </div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordInput}
            required
          />

          <button
            type="submit"
            id="auth__btn"
            className="btn"
            style={{ color: "#fff" }}
          >
            Log In
          </button>

          <label id="persist" htmlFor="persist">
            <input
              name="persist"
              type="checkbox"
              checked={persist}
              onChange={handleToggle}
            />
            Trust this Device
          </label>

          {/* <div className="auth__container">
            Don&apos;t have an account yet?
            <Link to="/signup"> sign up</Link>
          </div> */}

          <div className="home-link__container">
            <Link to="/">Back to Home</Link>
          </div>
        </form>
      </div>
      <footer className="login_footer">
        <div className="about-footer">
          <h4>About Migrant flow</h4>
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
    </div>
  );

  return content;
};

export default Login;
