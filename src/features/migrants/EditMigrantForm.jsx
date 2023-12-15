import { useState, useEffect } from "react";
import {
  useUpdateMigrantMutation,
  useDeleteMigrantMutation,
} from "./migrantApiSlice";
import { useNavigate } from "react-router-dom";

const MIGRANT_REGEX = /^[A-z]{3,20}$/;

const EditMigrantForm = ({ migrant }) => {
  const [updateMigrant, { isLoading, isSuccess, isError, error }] =
    useUpdateMigrantMutation();

  const [
    deleteMigrant,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteMigrantMutation();

  const navigate = useNavigate();

  const [firstname, setFirstname] = useState(migrant.first_name);
  const [validFirstname, setValidFirstname] = useState(false);
  const [lastname, setLastname] = useState(migrant.last_name);
  const [validLastname, setValidLastname] = useState(false);
  const [gender, setGender] = useState(migrant.gender);
  const [dateOfBirth, setDateOfBirth] = useState(migrant.date_of_birth);
  const [nationality, setNationality] = useState(migrant.nationality);
  const [email, setEmail] = useState(migrant.email);
  const [phone, setPhone] = useState(migrant.phone);
  const [address, setAddress] = useState(migrant.address);
  const [migrationStatus, setMigrationStatus] = useState(
    migrant.migration_status
  );

  useEffect(() => {
    setValidFirstname(MIGRANT_REGEX.test(firstname));
  }, [firstname]);

  useEffect(() => {
    setValidLastname(MIGRANT_REGEX.test(lastname));
  }, [lastname]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
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
  }, [isSuccess, isDelSuccess, navigate]);

  const onFirstnameChanged = (e) => setFirstname(e.target.value);
  const onLastnameChanged = (e) => setLastname(e.target.value);
  const onGenderChanged = (e) => setGender(e.target.value);
  const onDateOfBirthChanged = (e) => setDateOfBirth(e.target.value);
  const onNationalityChanged = (e) => setNationality(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onAddressChanged = (e) => setAddress(e.target.value);
  const onMigrationStatusChanged = (e) => setMigrationStatus(e.target.value);
  const onDeleteMigrantClicked = async () => {
    await deleteMigrant({ id: migrant.id });
  };

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

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await updateMigrant({
        id: migrant.id,
        first_name: firstname,
        last_name: lastname,
        gender,
        nationality,
        contact,
        migration_status: migrationStatus,
      });
    }
  };

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validFirstNameClass = !validFirstname ? "form__input--incomplete" : "";
  const validLastNameClass = !validLastname ? "form__input--incomplete" : "";
  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent} </p>
      <div
        id="new_user_form"
        className="form-container"
        style={{ marginTop: "9rem" }}
      >
        <p className={errClass}>{error?.data?.message}</p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>New User</h2>
        </div>

        <form className="form" onSubmit={onSaveUserClicked}>
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
            type="text"
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
            type="text"
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
      <div>
        <h2>Delete Migrant</h2>
        <div>
          <button type="button" title="Delete" onClick={onDeleteMigrantClicked}>
            Delete
          </button>
        </div>
      </div>
    </>
  );

  return content;
};

export default EditMigrantForm;
