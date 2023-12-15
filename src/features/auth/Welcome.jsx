import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const secondSection = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "6.3rem",
  };

  const navigate = useNavigate();

  const { Username } = useAuth();

  const onNewDataFormClicked = () => navigate("/dataforms/addform");

  window.addEventListener("scroll", reveal);

  function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var revealTop = reveals[i].getBoundingClientRect().top;
      var revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  return (
    <>
      <div
        className="Public"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
        }}
      >
        <section className="section__one--public" style={secondSection}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              maxWidth: "65rem",
            }}
          >
            <h1 className="section_one__title">
              Welcome{" "}
              <span style={{ color: "blue", lineHeight: 1.2 }}>
                {Username}{" "}
              </span>{" "}
              {/* Gathering Accurate Data to Enhance{" "}
              <span style={{ color: "blue", lineHeight: 1.2 }}>
                Migration Management{" "}
              </span>{" "}
              in Ghana */}
            </h1>
            <h2>
              Let&apos;s start collecting{" "}
              <span style={{ color: "blue", lineHeight: 1.2 }}>data</span>{" "}
              together!
            </h2>
          </div>
        </section>
        <section
          className="section__two--public"
          style={{ marginBottom: "4rem" }}
        >
          <div
            className="section_wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              maxWidth: "50rem",
            }}
          >
            <p style={{ lineHeight: 1.5, fontSize: "1.5rem" }}>
              Migrant <span style={{ color: "blue" }}>Flow</span> is a
              user-friendly, safe platform for gathering data that is especially
              intended for migration management in Ghana. With Migrant{" "}
              <span style={{ color: "blue" }}>Flow</span>, researchers can
              design their own research forms and gather qualitative and
              quantitative data to help manage migration in Ghana.
            </p>
          </div>
        </section>
        <section
          className="section__three--public"
          style={{ marginBottom: "8rem" }}
        >
          <h2 style={{ fontSize: "1.8rem" }}>
            {" "}
            <span style={{ color: "blue" }}>Migration</span> Management
          </h2>
          <div className="section_three">
            <div className="bg-img" style={{ flex: 1 }}></div>
            <p
              className="reveal"
              style={{
                lineHeight: 1.5,
                fontSize: "clamp(1rem, 2vw, 1.3rem)",
                flex: 1,
                marginLeft: "1em",
              }}
            >
              Migration Management programmes in Ghana include a focus on
              Migrant Protection and Assistance{" "}
              <span style={{ color: "blue" }}>(MPA)</span> , including direct
              assistance to vulnerable migrants, counter human traffcking,
              assisted voluntary return and reintegration{" "}
              <span style={{ color: "blue" }}>(AVRR)</span> , migrant health,
              migration policy development, migration data management,
              immigration and border management{" "}
              <span style={{ color: "blue" }}>(IBM)</span> , labour migration
              and human development and overall capacity building on Migration
              Management.
            </p>
          </div>
        </section>

        <section
          className="section__four--public"
          style={{
            backgroundColor: "#1d2541",
            padding: "1rem",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "1.8rem" }}>
            Create research forms
          </h2>
          <div className="section__four--container">
            <div className="card__public">
              <h3>Flexibility of creating your own research forms</h3>
              <p style={{ lineHeight: 1.5, fontSize: "1.3rem" }}>
                Set Research Questions with multiple choice answers
              </p>
              <Button onClick={onNewDataFormClicked} variant="contained">
                Try it out!
              </Button>
            </div>
            <div className="card__public reveal">
              <h3>Visualize Data instantly!</h3>
              <iframe
                width="clamp(200px, 5vw, 371px)"
                height="330"
                seamless
                // frameborder="0"
                scrolling="no"
                src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTuceqzDxkCzSi0ye8275wjfwqnZp3Z3MuJsjVaet_GWOrFEvBhPyvnl4ASWvIemKmvl__r1QeGjBt-/pubchart?oid=1410371586&amp;format=interactive"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Welcome;
