import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewDataFormMutation } from "./dataFormsApiSlice";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import MenuItem from "@mui/material/MenuItem";
import {
  ShortText,
  Subject,
  FilterNone,
  Close,
  CheckBox,
  Delete,
} from "@mui/icons-material";
// import "../../index.css";
import useAuth from "../../hooks/useAuth";

const NewDataForm = () => {
  const [addNewDataForm, { isLoading, isSuccess, isError, error }] =
    useAddNewDataFormMutation();

  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("Untitled");
  const [formDesc, setFormDesc] = useState("form description");

  const { Username } = useAuth();

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      questionType: "radio",
      options: [{ optionText: "" }, { optionText: "" }, { optionText: "" }],
      open: true,
      required: false,
    },
  ]);

  function changeQuestion(text, i) {
    let newQuestion = [...questions];
    newQuestion[i].questionText = text;
    setQuestions(newQuestion);
  }

  function changeOptionValue(text, i, j) {
    let optionsQuestion = [...questions];
    optionsQuestion[i].options[j].optionText = text;
    setQuestions(optionsQuestion);
  }

  function addQuestionType(i, type) {
    let ques = [...questions];
    ques[i].questionType = type;
    ques[i].options.optionId = type;
    if (type === "text" && ques[i].options.length > 1) {
      ques[i].options.splice(1);
    }
    setQuestions(ques);
  }

  function removeOption(i, j) {
    let RemoveOptionQuestion = [...questions];
    if (RemoveOptionQuestion[i].options.length > 1) {
      RemoveOptionQuestion[i].options.splice(j, 1);
      setQuestions(RemoveOptionQuestion);
    }
  }

  function addOption(i) {
    let questionOptions = [...questions];
    if (questionOptions[i].options.length < 5) {
      questionOptions[i].options.push({
        optionText: "Option" + (questionOptions[i].options.length + 1),
      });
    } else {
      console.log("max reached");
    }

    setQuestions(questionOptions);
  }

  function copyQuestion(i) {
    expandCloseAll();
    let qs = [...questions];
    let newQuestion = { ...qs[i] };

    setQuestions([...questions, newQuestion]);
  }

  function deleteQuestion(i) {
    let qs = [...questions];
    if (questions.length > 1) {
      qs.splice(i, 1);
    }
    setQuestions(qs);
  }

  function requiredQuestion(i) {
    let reqQuestion = [...questions];
    reqQuestion[i].required = !reqQuestion[i].required;
    setQuestions(reqQuestion);
  }

  function addQuestionField() {
    expandCloseAll();
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "radio",
        options: [{ optionText: "" }],
        open: true,
        required: false,
      },
    ]);
  }

  function expandCloseAll() {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      qs[j].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i) {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;
      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  useEffect(() => {
    if (isSuccess) {
      setFormTitle("");
      setFormDesc("");
      setQuestions("");
      navigate("/dashboard/dataforms");
    }
  }, [isSuccess, navigate]);

  const onSaveFormClicked = async (e) => {
    e.preventDefault();

    await addNewDataForm({
      username: Username,
      formTitle,
      formDesc,
      questions,
    });
  };

  const canSave = [formTitle, formDesc, questions].every(Boolean) && !isLoading;

  const errClass = isError ? "errmsg" : "offscreen";

  const errContent = error?.data?.message ?? "";

  function questionsUI() {
    return questions.map((question, i) => (
      <>
        <Accordion
          expanded={questions[i].open}
          className={questions[i].open ? "add_border" : ""}
          onChange={() => {
            handleExpand(i);
          }}
        >
          <AccordionSummary
            aria-controls="panelia-content"
            id="panelia-header"
            elevation={1}
            style={{ width: "100%" }}
          >
            {!questions[i].open ? (
              <div className="saved_questions">
                <Typography
                  className="saved_questions_para"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    letterSpacing: ".1px",
                    lineHeight: "24px",
                    paddingBottom: "25px",
                  }}
                >
                  {i + 1}. {questions[i].questionText}
                </Typography>

                {question.options.map((op, j) => (
                  <div key={j}>
                    <div style={{ display: "flex" }}>
                      <FormControlLabel
                        style={{ marginLeft: "5px", marginBottom: "5px" }}
                        control={
                          <input
                            type={question.questionType}
                            color="primary"
                            style={{
                              marginRight: "8px",
                            }}
                            required={question.type}
                            disabled
                          />
                        }
                        label={
                          <Typography
                            style={{
                              fontSize: ".9rem",
                              fontWeight: "400",
                              letterSpacing: ".2px",
                              lineHeight: "20px",
                              color: "#202124",
                            }}
                          >
                            {question.options[j].optionText}
                          </Typography>
                        }
                      ></FormControlLabel>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </AccordionSummary>
          {questions[i].open ? (
            <div className="question_boxes">
              <AccordionDetails className="add_question">
                <div className="add_question_top">
                  <input
                    type="text"
                    className="question"
                    placeholder="eg. Have you ever experienced trafficking?"
                    name="question"
                    value={question.questionText}
                    onChange={(e) => {
                      changeQuestion(e.target.value, i);
                    }}
                  />
                  <Select
                    className="select"
                    style={{
                      color: "#5f6368",
                      fontSize: ".8rem",
                      width: "clamp(3rem, 10vw, 8rem)",
                    }}
                    value="select"
                  >
                    <MenuItem
                      className="menu_item"
                      id="text"
                      value="Text"
                      onClick={() => addQuestionType(i, "text")}
                    >
                      <Subject style={{ marginRight: "10px" }} />
                      Paragraph
                    </MenuItem>
                    <MenuItem
                      className="menu_item"
                      id="checkbox"
                      value="Checkbox"
                      onClick={() => addQuestionType(i, "checkbox")}
                    >
                      <CheckBox
                        style={{ marginRight: "10px", color: "#70757a" }}
                        checked
                      />
                      Checkbox
                    </MenuItem>
                    <MenuItem
                      className="menu_item"
                      id="radio"
                      value="Radio"
                      onClick={() => addQuestionType(i, "radio")}
                    >
                      <Radio
                        style={{ marginRight: "10px", color: "#70757a" }}
                        checked
                      />
                      Multiple Choice
                    </MenuItem>
                  </Select>
                </div>
                {question.options.map((op, j) => (
                  <div className="add_question_body" key={j}>
                    {question.questionType !== "text" ? (
                      <input
                        type={question.questionType}
                        style={{ marginRight: "10px" }}
                      />
                    ) : (
                      <ShortText style={{ marginRight: "10px" }} />
                    )}
                    <div>
                      <input
                        type="text"
                        className="text_input"
                        placeholder="option"
                        value={question.options[j].optionText}
                        onChange={(e) => {
                          changeOptionValue(e.target.value, i, j);
                        }}
                      />
                    </div>
                    <IconButton aria-label="delete">
                      <Close
                        onClick={() => {
                          removeOption(i, j);
                        }}
                      />
                    </IconButton>
                  </div>
                ))}

                {question.options.optionId !== "text" &&
                question.options.length < 5 ? (
                  <div className="add_question_body">
                    <FormControlLabel
                      disabled
                      control={
                        question.questionType !== "text" ? (
                          <input
                            type={question.questionType}
                            color="primary"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                            disabled
                          />
                        ) : (
                          <ShortText style={{ marginRight: "10px" }} />
                        )
                      }
                      label={
                        <div>
                          <Button
                            size="small"
                            style={{
                              textTransform: "none",
                              color: "#4285f4",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                            onClick={() => addOption(i)}
                          >
                            Add
                          </Button>
                        </div>
                      }
                    ></FormControlLabel>
                  </div>
                ) : (
                  ""
                )}
                <div className="add_footer">
                  <div className="add_question_bottom">
                    <IconButton
                      aria-label="Copy"
                      onClick={() => {
                        copyQuestion(i);
                      }}
                    >
                      <FilterNone />
                    </IconButton>

                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        deleteQuestion(i);
                      }}
                    >
                      <Delete />
                    </IconButton>

                    <span style={{ color: "#5f6368", fontSize: "13px" }}>
                      Required
                    </span>
                    <IconButton>
                      <Switch
                        name="checkbox"
                        color="primary"
                        onClick={() => {
                          requiredQuestion(i);
                        }}
                        checked={question.required}
                      />
                    </IconButton>

                    <div className="question_edit">
                      <Button
                        className="edit"
                        onClick={addQuestionField}
                        variant="contained"
                      >
                        Add Field
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </div>
          ) : (
            " "
          )}
        </Accordion>
      </>
    ));
  }
  return (
    <>
      <div className="question_form">
        <p className={errClass}>{errContent}</p>
        <br></br>
        <div className="section_form">
          <div className="question_title_section">
            <div className="question_form_top">
              <input
                type="text"
                className="question_form_top_name"
                style={{ color: "black" }}
                placeholder="Untitled document"
                name="research_title"
                onChange={(e) => {
                  setFormTitle(e.target.value);
                }}
              />
              <input
                type="text"
                className="question_form_top_desc"
                placeholder="Form description"
                name="research_desc"
                onChange={(e) => {
                  setFormDesc(e.target.value);
                }}
              />
            </div>
          </div>
          {questionsUI()}
          <div className="save_form">
            <Button
              variant="contained"
              color="primary"
              style={{ fontSize: "14px" }}
              onClick={onSaveFormClicked}
              disabled={!canSave}
            >
              Save Form
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewDataForm;
