import React, { useContext, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../App";
import { useAuth } from '../AuthContext';
import Chatbot from "./Chatbot";
import "./topicCard.css";

export default function TopicCard({ questionData }) {
  const dark = useContext(ThemeContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const findPercentage = (doneQuestions, totalQuestions) => Math.round((doneQuestions / totalQuestions) * 100);

  useEffect(() => {
    !isLoggedIn && navigate("/login")
    // eslint-disable-next-line
  }, [isLoggedIn])

  let totalSolved = 0;
  let totalQuestions = 0;

  let topicCard = questionData.map((topic, index) => {
    let { doneQuestions, questions, started } = topic;
    let percentDone = findPercentage(doneQuestions, questions.length);
    let questionsRemainig = questions.length - doneQuestions;

    totalSolved += doneQuestions;
    totalQuestions += questions.length;

    return (
      <Fade key={index} duration={500 + index * 0.4}>
        <div className="col mb-4">
          <Link
            to={`/${encodeURI(topic.topicName.toLowerCase())}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              className={`mb-3 ${started ? "inprogress-card animate__slideInDown" : "notstarted-card"
                } hvr-grow ${dark ? "darkCard" : ""}`}
            >
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title className="topicName">{topic.topicName}</Card.Title>
                  </Col>
                  <Col>
                    <h4>
                      <Badge
                        pill
                        variant={started ? "success" : "primary"}
                        className="float-right"
                        style={{ fontWeight: "500", cursor: "pointer" }}
                      >
                        {started
                          ? questionsRemainig === 0
                            ? "Done 👏🏻"
                            : "Solve Now 🙇🏻‍♂️"
                          : "Start Now"}
                      </Badge>
                    </h4>
                  </Col>
                </Row>
                <Card.Text className="totalQuestion">
                  Total Questions {questions.length} <br />
                  {`${questionsRemainig}`} More to go
                </Card.Text>
                <p className="percentDone mb-1">
                  <b>{percentDone}% Done</b>
                </p>
                <ProgressBar
                  animated={percentDone === 100 ? false : true}
                  variant="success"
                  now={percentDone}
                />
              </Card.Body>
            </Card>
          </Link>
        </div>
      </Fade>
    );
  });

  return (
    <>
      {
        !questionData || questionData.length === 0 ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" variant="success" />
          </div>
        ) : (
          <>
            <h3 className="app-heading2 text-center mb-3">Solve DSA problems to master DSA</h3>
            <br />
            <br />
            <h4 className="text-center mb-4">
              {totalSolved
                ? `Total Questions Solved: ${totalSolved} (${((totalSolved / totalQuestions) * 100).toFixed(
                  2
                )}% Done)`
                : "Start Solving"}
              <br />
              <br />
              <p className="percentDone container mt-1">
                {totalSolved ? (
                  <ProgressBar
                    animated={
                      ((totalSolved / totalQuestions) * 100).toFixed(2) === "100" ? false : true
                    }
                    variant="success"
                    now={((totalSolved / totalQuestions) * 100).toFixed(2)}
                    style={{ margin: "0.2em 5em" }}
                  />
                ) : null}
              </p>
            </h4>
            <div className="row row-cols-1 row-cols-md-3 mt-3 grids" style={{ paddingTop: '5px', paddingBottom: '10px', paddingLeft: '5px', paddingRight: '5px' }}>
              {topicCard}
            </div>

            <Chatbot />
          </>
        )
      }
    </>

  );
}