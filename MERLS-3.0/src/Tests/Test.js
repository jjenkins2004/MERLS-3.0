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
import CompletionPage from "./CompletionPage";

const LAMBDA_API_ENDPOINT = "https://2inehosoqi.execute-api.us-east-2.amazonaws.com/prod/audio-upload";

const Test = ({ type, language }) => {
  const [questions, setQuestions] = useState([]);
  const [curId, setCurId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showReinforcementPage, setShowReinforcementPage] = useState(false);
  const [showPractice, setShowPractice] = useState(true);
  const [showAudioPermission, setShowAudioPermission] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showChinese, setShowChinese] = useState(false);
  const [reinforcementID, setReinforcementID] = useState(0);
  const [audioBlobs, setAudioBlobs] = useState({});

  const navigate = useNavigate();

  let ReinforcementAudio = [
    ["https://sites.usc.edu/heatlab/files/2024/11/RV-English-14-way-through-the-test-w-audio.m4a", "https://sites.usc.edu/heatlab/files/2024/11/RV-14-way-through-the-test-w-audio.m4a"],
    ["https://sites.usc.edu/heatlab/files/2024/11/RV-Englsih-Midway-through-the-test-w-audio.m4a", "https://sites.usc.edu/heatlab/files/2024/11/RV-Midway-through-the-test-w-audio.m4a"],
    ["https://sites.usc.edu/heatlab/files/2024/11/RV-English-34-way-through-the-test-w-audio.m4a", "https://sites.usc.edu/heatlab/files/2024/11/RV-34-way-through-the-test-w-audio-2.m4a"],
    ["https://sites.usc.edu/heatlab/files/2024/11/RV-Englsih-End-of-the-test-narration-w-audio.m4a", "https://sites.usc.edu/heatlab/files/2024/11/RV-End-of-the-test-narration-w-audio.m4a"]]

  let audioLink = useRef("");

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
    console.log("question id:", curId);
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const recordAudioBlob = (questionId, blob) => {
    if (!questionId || !blob) {
      console.error('Missing required parameters:', { questionId, blob });
      return;
    }

    setAudioBlobs(prev => {
      const updatedBlobs = { ...prev, [questionId]: blob };
      console.log('Current Audio Blobs:', Object.keys(updatedBlobs));
      return updatedBlobs;
    });
  };

  const uploadBlobToLambda = async (blob, questionId) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob.blob);
      });

      const requestBody = {
        fileType: 'audio/webm',
        audioData: base64Data,
        userId: localStorage.getItem("username"),
        questionId: questionId
      };

      const response = await fetch(LAMBDA_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
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
          const audioUrls = {};
          for (const [questionId, blob] of Object.entries(audioBlobs)) {
            try {
              const s3UrlMatch = await uploadBlobToLambda(blob, questionId);
              if (s3UrlMatch) {
                audioUrls[questionId] = s3UrlMatch.split('?')[0];
              } else {
                console.error('Invalid S3 URL format:', s3UrlMatch);
              }
            } catch (error) {
              console.error(`Failed to upload audio for question ${questionId}:`, error);
            }
          }
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

  useEffect(() => {
    if (type === "matching") {
      audioLink.current = language === "CN" ? "https://sites.usc.edu/heatlab/files/2024/11/RV-Mandarin-test-instruction-w-audio.m4a" : "https://sites.usc.edu/heatlab/files/2024/11/RV-English-test-instruction-w-audio.m4a"
      
    }
    else if (type === "repetition") {
      audioLink.current = language === "CN" ? "https://bpb-us-w1.wpmucdn.com/sites.usc.edu/dist/b/837/files/2024/11/RV-Mandarin-test-instruction-w-audio.m4a" : "https://bpb-us-w1.wpmucdn.com/sites.usc.edu/dist/b/837/files/2024/11/RV-English-test-instruction-w-audio.m4a";
      setShowAudioPermission(true);
    }
  }, [type, language]);

  useEffect(() => {
    if (type === "matching" && language === "CN" && curId === 29) {
      audioLink.current = "https://sites.usc.edu/heatlab/files/2024/11/RV-Quantifier-test-instruction-w-audio.m4a";
      setShowInstructions(true);
      setShowPractice(true);
    }
  }, [curId])

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
            <CompletionPage showChinese={showChinese} imageLink="https://sites.usc.edu/heatlab/files/2024/10/puppy3.gif" submitAnswers={submitAnswers} audioLink={ReinforcementAudio[3][language === "EN" ? 0 : 1]}/>
          ) : showReinforcementPage ? (
            <ReinforcementPage showChinese={showChinese} audioLink={ReinforcementAudio[reinforcementID][language === "EN" ? 0 : 1]} imageLink="https://sites.usc.edu/heatlab/files/2024/10/puppy3.gif" setShowReinforcement={setShowReinforcementPage}/>
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
            language={curId > 1 ? "second" : language}
            question={questions[curId-1]}
            showChinese={showChinese}
            recordAudioBlob={recordAudioBlob}/>
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
                recordAudioBlob={recordAudioBlob}
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
