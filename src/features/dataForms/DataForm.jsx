import {
  useDeleteDataFormMutation,
  useGetDataFormsQuery,
} from "./dataFormsApiSlice";
import { memo, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useAddNewDataMutation } from "../researchData/DataApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const DataForm = ({ dataformId }) => {
  // Destructure the dataform from result
  const { dataform } = useGetDataFormsQuery("dataFormsList", {
    selectFromResult: ({ data }) => ({
      dataform: data?.entities[dataformId],
    }),
  });

  const [addNewData, { isSuccess, isError, error }] = useAddNewDataMutation();

  const [deleteDataform, { isDelSuccess, isDelError, delerror }] =
    useDeleteDataFormMutation();

  const [data, setData] = useState(
    dataform.questions.map((question) => {
      return { question: question.questionText, response: "" };
    })
  );

  const { Username } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setData("");
      navigate("/dashboard/data");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onResponseChanged = (response, question, index) => {
    let newData = [...data];
    newData[index].question = question;
    newData[index].response = response;
    setData(newData);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    await addNewData({
      data,
    });
  };

  const onDeleteButtonClicked = async () => {
    await deleteDataform({
      id: dataformId,
    });
  };

  let deleteButton;
  if (dataform.user_id?.username === Username) {
    deleteButton = (
      <div>
        <Button
          variant="contained"
          color="error"
          style={{
            fontSize: "14px",
            maxWidth: "20rem",
            // backgroundColor: "tomato",
          }}
          onClick={onDeleteButtonClicked}
          // disabled={!canSave}
        >
          Delete
        </Button>
      </div>
    );
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen";

  if (dataform) {
    // const handleEdit = () => navigate(`/dashboard/dataforms/${dataformId}`);

    return (
      <>
        <form
          className="data-form"
          style={{
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            marginBottom: "35px",
            width: "clamp(15rem, 50vw, 60rem)",
          }}
        >
          <p className={errClass}>
            {(error?.data?.message || delerror?.data?.message) ?? ""}
          </p>
          <div
            className="form_header"
            style={{
              border: "3px solid #000",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <p>form by {dataform.user_id?.username}</p>
            <h1>Title: {dataform.form_title} </h1>
            <span>Description</span>
            <p>{dataform.form_desc} </p>
            <hr />
          </div>

          {dataform.questions.map((question, i) => {
            return (
              <div
                key={i}
                className={`question_container ${i}`}
                style={{
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                  padding: "1rem",
                }}
              >
                <p>{question.questionText}:</p>
                {question.options.map((option) => {
                  return (
                    <div key={option._id}>
                      {question.questionType !== "text" ? (
                        <label htmlFor={option.optionText}>
                          <input
                            type={question.questionType}
                            value={option.optionText}
                            name={question.questionText}
                            onChange={(e) => {
                              onResponseChanged(
                                e.target.value,
                                e.target.name,
                                i
                              );
                            }}
                          />

                          {option.optionText}
                        </label>
                      ) : (
                        <input
                          type="text"
                          value={data[i].response}
                          name={question.questionText}
                          onChange={(e) => {
                            onResponseChanged(e.target.value, e.target.name, i);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div style={{ display: "flex" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                fontSize: "14px",
                maxWidth: "20rem",
                marginRight: "35px",
              }}
              onClick={onSubmitForm}
              // disabled={!canSave}
            >
              Submit
            </Button>
            {deleteButton}
          </div>
        </form>
      </>
    );
  } else return null;
};

const memoizedDataForm = memo(DataForm);

export default memoizedDataForm;
