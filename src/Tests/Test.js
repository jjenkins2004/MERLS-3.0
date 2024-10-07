import React, { useState, useEffect } from "react";
import "./Test.scss";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Question from "./Question";
import Repetition from "./Repetition";

const Test = ({ type, language }) => {
  const [questions, setQuestions] = useState([]);
  const [curId, setCurId] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showReinforcementPage, setShowReinforcementPage] = useState(false);
  const [showChinese, setShowChinese] = useState(false);

  const navigate = useNavigate();

  // record answer and go to next question
  const recordAnswer = (questionId, answerId) => {
    // show the reinforcement page when the test is half through
    if (curId === Math.floor(questions.length / 2)) {
      setShowReinforcementPage(true);
    } else {
      setCurId(curId + 1);
    }
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const submitAnswers = () => {
    try {
      const username = localStorage.getItem("username");
      async function submitAnswersToDB() {
        const response = await fetch(
          "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions",
          {
            method: "PUT",
            body: JSON.stringify({
              participantId: username,
              userAns: answers,
              isEN: language === "CN" ? false : true,
            }),
          }
        );
        if (response.ok) {
          navigate("/test-selection");
        } else {
          alert("Failed to submit answers");
        }
      }
      submitAnswersToDB();
    } catch (error) {
      alert("Failed to submit answers");
      console.error("Failed to submit answers: ", error);
    }
  };

  useEffect(() => {
    async function fetchQuestionList() {
      const response = await fetch(
        "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions?language=" +
          language,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const questionList = await response.json();
      setQuestions(questionList);
    }
    fetchQuestionList();
  }, []);

  let completed = curId === questions.length;

  if (questions.length > 0) {
    return (
      <div id="testPage">
        <AppBar className = "titleContainer">
          <progress id="progress" value={curId} max={questions.length}>
            {Math.floor((curId / questions.length) * 100)}%
          </progress>
          <button className = "translationButton" onClick ={() => setShowChinese(!showChinese)}>
            {showChinese ? "Change to English/更改为英语" : "Change to Chinese/更改为中文"}
          </button>
      </AppBar>
        <Container className="testContainer">
          {completed ? (
            <div>
              <div className="indicator">
                <p> {showChinese ? 
                <>太棒了！题目都完成了！</> : 
                <>Hooray! All questions completed!</>}</p>
              </div>
              <div className="completionContainer">
                <img
                  className="completionImg"
                  src="https://previews.123rf.com/images/mariaprischepa/mariaprischepa1807/mariaprischepa180700011/105938717-bright-abstract-elements-set.jpg"
                  alt="completion celebration"
                />
                <div className="completionMessage">
                {showChinese ? 
                <>万岁！您已完成{language === "CN" ? "中文" : "英语"}部分，请按下面的“提交”记录您的答案！</> : 
                <>Hooray! You've completed the{" "}
                {language === "CN" ? "Chinese" : "English"} section, press
                "Submit" below to record your answers!</>}
                  
                </div>
                <Button variant="contained" onClick={submitAnswers}>
                {showChinese ? 
                <>提交</> : 
                <>Submit</>}
                </Button>
              </div>
            </div>
          ) : showReinforcementPage ? (
            <div>
              <div className="indicator">
                <p>
                  Come on! You are half way through!/加油！你已经完成一半了！
                </p>
              </div>
              <div className="reinforcementContainer">
                <img
                  className="reinforcementGif"
                  src="https://i0.wp.com/images.onwardstate.com/uploads/2015/05/oie_14175751vZSQRLEn.gif?fit=650%2C408&ssl=1"
                  alt="reinforcement gif"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowReinforcementPage(false);
                    setCurId(curId + 1);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : type === "match" ? (
            <Question
              curQuestion={questions[curId]}
              recordAnswer={recordAnswer}
              showChinese={showChinese}
            />
          ) : (
            <Repetition
              curQuestion={questions[curId]}
              recordAnswer={recordAnswer}
              showChinese={showChinese}
            />
          )}
        </Container>
      </div>
    );
  } else {
    return (
      <div>
        <CircularProgress
          size={"10rem"}
          sx={{
            display: "block",
            margin: "0 auto",
            position: "relative",
            top: "15rem",
          }}
        />
      </div>
    );
  }
};

export default Test;
