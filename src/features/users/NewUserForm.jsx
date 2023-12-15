import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState(["User"]);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setEmail("");
      setRoles([]);
      setPassword("");
      navigate("/dashboard/users");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onEmailChanged = (e) => setEmail(e.target.value);

  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({
        username,
        email,
        roles,
        password,
      });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";

  const content = (
    <>
      <div id="new_user_form" className="form-container">
        <p className={errClass}>{error?.data?.message}</p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>New User</h2>
        </div>

        <form className="form" onSubmit={onSaveUserClicked}>
          <label htmlFor="username">Username:</label>
          <input
            className={`form__input ${validUserClass}`}
            id="username"
            name="username"
            type="text"
            autoComplete="off"
            value={username}
            onChange={onUsernameChanged}
          />

          <label htmlFor="email">Email:</label>
          <input
            className={`form__input`}
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            value={email}
            onChange={onEmailChanged}
          />

          {/* <span>[4-12 chars incl. !@#$%] </span> */}
          <label htmlFor="roles">Assigned Roles:</label>
          <select
            className={"form__select"}
            id="roles"
            name="roles"
            type="text"
            value={roles}
            multiple={true}
            size="3"
            onChange={onRolesChanged}
          >
            {options}
          </select>

          <label htmlFor="password">Password:</label>
          <input
            className={`form__input ${validPwdClass}`}
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChanged}
          />

          <div className="button_div">
            <button
              id="form__action-buttons"
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return content;
};

export default NewUserForm;
