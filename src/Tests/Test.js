import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Question from "./Question";
import Repetition from "./Repetition";
import Instructions from "./Instructions";
import GuidedTutorial from "./GuidedTutorial";
import Practice from "./Practice";
import TranslationButton from "../Components/TranslationButton";
import AudioPermission from "./AudioPermission";
import ReinforcementPage from "./ReinforcementPage";

const Test = ({ type, language }) => {
  const [questions, setQuestions] = useState([]);
  const [curId, setCurId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showReinforcementPage, setShowReinforcementPage] = useState(false);
  const [showGuidedTutorial, setShowGuidedTutorial] = useState(true);
  const [showPractice, setShowPractice] = useState(true);
  const [showAudioPermission, setShowAudioPermission] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showChinese, setShowChinese] = useState(false);
  const [reinforcementID, setReinforcementID] = useState(0);
  const [audioUrls, setAudioUrls] = useState({});

  const navigate = useNavigate();

  let ReinforcementAudio = [
    "https://sites.usc.edu/heatlab/files/2024/10/English-1-4-way-through-the-test-w-audio.m4a",
    "https://sites.usc.edu/heatlab/files/2024/10/English-Midway-through-the-test-w-audio.m4a",
    "https://sites.usc.edu/heatlab/files/2024/10/English-3-4-way-through-the-test-w-audio.m4a",
    "https://sites.usc.edu/heatlab/files/2024/10/English-End-of-the-test-narration-w-audio.m4a"]

  // record answer and go to next question
  const recordAnswer = (questionId, answerId) => {
    // show the reinforcement page when the test is half through
    if (curId === Math.floor(questions.length / 4)) {
      setShowReinforcementPage(true);
      setReinforcementID(0);
    } else if (curId === Math.floor(questions.length / 2)) {
      setShowReinforcementPage(true);
      setReinforcementID(1);
    } else if (curId === Math.floor(3*questions.length / 4)) {
      setShowReinforcementPage(true);
      setReinforcementID(2);
    }
    setCurId(curId + 1);
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const recordAudioUrl = (questionId, s3Url) => {
    if (!questionId || !s3Url) {
      console.error('Missing required parameters:', { questionId, s3Url });
      return;
    }
    const truncatedUrl = s3Url.split('?')[0];

    setAudioUrls(prev => {
      const updatedUrls = { ...prev, [questionId]: truncatedUrl };
      console.log('Current Audio URLs:', updatedUrls);
      return updatedUrls;
    });
  };

  const submitAnswers = () => {
    try {
      const username = localStorage.getItem("username");
      async function submitAnswersToDB() {
        console.log("type:", type);
        let endpoint = "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions";
        let requestBody;

        if (type === "matching") {
          requestBody = {
            participantId: username,
            userAns: answers,
            isEN: language === "CN" ? false : true,
            isAudioTest: false,
            audioSubmissionList: null,
          };
        } else if (type === "repetition") {
          requestBody = {
            participantId: username,
            audioSubmissionList: audioUrls,
            isEN: language === "CN" ? false : true,
            isAudioTest: true,
            userAns: null,
          };
        }

        console.log("Submitting data:", requestBody);

        const response = await fetch(endpoint, {
          method: "PUT",
          body: JSON.stringify(requestBody)
        });

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
          language + "&type=" + type,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("getting questions");
      const questionList = await response.json();
      setQuestions(questionList);
    }
    fetchQuestionList();
  }, []);

  let audioLink = useRef("");

  useEffect(() => {
    if (type === "matching") {
      audioLink.current = language === "CN" ? "https://sites.usc.edu/heatlab/files/2024/10/Mandarin-test-instruction-w-audio.m4a" : "https://sites.usc.edu/heatlab/files/2024/10/English-test-instruction-w-audio.m4a"
      
    }
    else if (type === "repetition") {
      audioLink.current = null;
      setShowAudioPermission(true);
    }
  }, [type, language]);

  let completed = curId === questions.length;

  if (questions.length > 0) {
    return (
      <div id="testPage">
        <AppBar className = "titleContainer">
          <progress id="progress" value={curId-1} max={questions.length-1}/>
         <TranslationButton 
            showChinese={showChinese}
            setShowChinese={setShowChinese}
         />
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
            <ReinforcementPage showChinese={showChinese} audioLink={ReinforcementAudio[reinforcementID]} imageLink="https://sites.usc.edu/heatlab/files/2024/10/puppy3.gif" setShowReinforcement={setShowReinforcementPage}/>
          ) : showAudioPermission ? (
            <AudioPermission setShowAudioPermission = {setShowAudioPermission} showChinese = {showChinese}/>
          ) : showInstructions ? (
            <div>
              <Instructions
                showChinese = {showChinese}
                audioLink = {audioLink.current}
                setShowInstructions = {setShowInstructions}
              />
            </div>
          ) : showPractice ? (
            <Practice 
            setShowPractice={setShowPractice}
            type={type}
            language={language}
            question={questions[0]}
            showChinese={showChinese}
            recordAudioUrl={recordAudioUrl}/>
          ) : type === "matching" ? (
            <Question
              curQuestion={questions[curId]}
              recordAnswer={recordAnswer}
              showChinese={showChinese}
            />
          ) : type === "repetition" ? (
              <Repetition
                curQuestion={questions[curId]}
                recordAnswer={recordAnswer}
                showChinese={showChinese}
                recordAudioUrl={recordAudioUrl}
              />
          ) : (
            <p>page doesn't exist</p>
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
