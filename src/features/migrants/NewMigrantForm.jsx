import { useState, useEffect } from "react";
import { useAddNewMigrantMutation } from "./migrantApiSlice";
import { useNavigate } from "react-router-dom";

const MIGRANT_REGEX = /^[A-z]{3,20}$/;

const NewMigrantForm = () => {
  const [addNewMigrant, { isLoading, isSuccess, isError, error }] =
    useAddNewMigrantMutation();

  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [validFirstname, setValidFirstname] = useState(false);
  const [lastname, setLastname] = useState("");
  const [validLastname, setValidLastname] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [migrationStatus, setMigrationStatus] = useState("");

  useEffect(() => {
    setValidFirstname(MIGRANT_REGEX.test(firstname));
  }, [firstname]);

  useEffect(() => {
    setValidLastname(MIGRANT_REGEX.test(lastname));
  }, [lastname]);

  useEffect(() => {
    if (isSuccess) {
      setFirstname("");
      setLastname("");
      setGender("");
      setDateOfBirth("");
      setNationality("");
      setEmail("");
      setPhone("");
      setAddress("");
      setMigrationStatus("");
      navigate("/dashboard/migrants");
    }
  }, [isSuccess, navigate]);

  const onFirstnameChanged = (e) => setFirstname(e.target.value);
  const onLastnameChanged = (e) => setLastname(e.target.value);
  const onGenderChanged = (e) => setGender(e.target.value);
  const onDateOfBirthChanged = (e) => setDateOfBirth(e.target.value);
  const onNationalityChanged = (e) => setNationality(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onAddressChanged = (e) => setAddress(e.target.value);
  const onMigrationStatusChanged = (e) => setMigrationStatus(e.target.value);

  // const onConfirmPwdChanged = e => setConfirmPwd(e.target.value)

  const canSave =
    [
      validFirstname,
      validLastname,
      dateOfBirth,
      email,
      nationality,
      migrationStatus,
    ].every(Boolean) && !isLoading;

  const contact = {
    phone,
    email,
    address,
  };

  const onSaveMigrantClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewMigrant({
        first_name: firstname,
        last_name: lastname,
        gender,
        nationality,
        date_of_birth: dateOfBirth,
        contact,
        migration_status: migrationStatus,
      });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validFirstNameClass = !validFirstname ? "form__input--incomplete" : "";
  const validLastNameClass = !validLastname ? "form__input--incomplete" : "";

  const content = (
    <>
      <div id="new_migrant_form" className="form-container">
        <p className={errClass}>{error?.data?.message}</p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>New Migrant</h2>
        </div>

        <form className="form" onSubmit={onSaveMigrantClicked}>
          <label htmlFor="first_name">First name:</label>
          <input
            className={`form__input ${validFirstNameClass}`}
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="off"
            value={firstname}
            onChange={onFirstnameChanged}
          />

          <label htmlFor="last_name">Last name:</label>
          <input
            className={`form__input ${validLastNameClass}`}
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="off"
            value={lastname}
            onChange={onLastnameChanged}
          />

          <label htmlFor="gender">Gender:</label>
          <input
            className={"form__input"}
            id="gender"
            name="gender"
            type="text"
            autoComplete="off"
            value={gender}
            onChange={onGenderChanged}
          />

          <label htmlFor="date_of_birth">Date of Birth:</label>
          <input
            className={"form__input "}
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            autoComplete="off"
            value={dateOfBirth}
            onChange={onDateOfBirthChanged}
          />

          <label htmlFor="nationality">Nationality:</label>
          <input
            className={"form__input "}
            id="nationality"
            name="nationality"
            type="text"
            autoComplete="off"
            value={nationality}
            onChange={onNationalityChanged}
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
          <label htmlFor="phone">Phone:</label>
          <input
            className={"form__input"}
            id="phone"
            name="phone"
            type="number"
            value={phone}
            onChange={onPhoneChanged}
          />

          <label htmlFor="address">Address:</label>
          <input
            className={"form__input"}
            id="address"
            name="address"
            type="text"
            value={address}
            onChange={onAddressChanged}
          />

          <label htmlFor="migration_status">Migratin Status:</label>
          <input
            className={"form__input"}
            id="migration_status"
            name="migration_status"
            type="text"
            value={migrationStatus}
            onChange={onMigrationStatusChanged}
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

export default NewMigrantForm;
