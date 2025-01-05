import { React, useState, useEffect, useRef } from "react";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";
import Story from "./Story";
import TranslationButton from "../Components/TranslationButton";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import "../Tests/Test.scss";

let questionAudio;

let links = [
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
];

const StoryTest = ({ language }) => {
  //used to keep track of the current question stage, stage 1 is telling the story, stage 2 is the retelling, stage 3 are the followup questions
  const [stage, setStage] = useState(1);
  //used to keep track of the stage's different parts, i.e. current question or which narration link
  const [subStage, setSubStage] = useState(1);

  //data for questions
  const [stories, setStories] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [narrationLinks, setNarrationLinks] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [showLoading, setShowLoading] = useState(false);
  const [showChinese, setShowChinese] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [disableOption, setDisableOption] = useState(true);
  const timeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  //changing language display preference
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageParam = params.get("cn-zw");
    setShowChinese(languageParam === "true");
  }, [location]);

  //initial audio instructions
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (countDown > 0) {
      // timeoutRef is used here so we can pause the countDown by clearing timeout
      timeoutRef.current = setTimeout(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    } else {
      playAudio();
    }

    return () => clearTimeout(timeoutRef.current);
  }, [countDown]);

  //function to play instruction/story audio
  const playAudio = (link) => {
    questionAudio = new Audio(link);
    questionAudio.addEventListener("play", () => {
      setAudioPlaying(true);
    });
    questionAudio.addEventListener("ended", () => {
      setAudioPlaying(false);

      if (disableOption) {
        // after the audio is played for the first time, we will allow user to click the options
        setDisableOption(false);
      }
    });
    questionAudio.play().catch((error) => {
      alert("error in playing question.", error);
      setDisableOption(false);
    });
  };

  //defining functions for question flow and logic
  const getInstructionLink = () => {
    //get the current instruction audio link
    return "link";
  };

  const advanceNarrator = () => {
    //advance the narrator to the next part of the story
    playAudio(getInstructionLink());
  };

  const nextQuestion = () => {
    //go to next question
    return "question";
  }



  return (
    <div>
      {showLoading ? (
        <div></div>
      ) : (
        <div id="testPage">
          <AppBar className="titleContainer">
            <progress id="progress" value={5} max={10} />
            <TranslationButton
              showChinese={showChinese}
              setShowChinese={setShowChinese}
            />
          </AppBar>
          <div className="indicator">
            {audioPlaying ? (
              <div>
                <IconButton aria-label="pause" disabled>
                  <PauseCircleIcon
                    color="primary"
                    className="pauseButton disabled"
                  />
                </IconButton>
                <p className="actionText">
                  {showChinese ? <>播放中</> : <>Playing Instructions</>}
                </p>
              </div>
            ) : (
              <div>
                <IconButton
                  aria-label="play"
                  style={{ marginBottom: "0" }}
                  onClick={() => {
                    playAudio();
                  }}
                >
                  <PlayCircleIcon color="primary" className={"pauseButton"} />
                </IconButton>
                <p className="actionText">
                  {countDown > 0 ? (
                    <p className="actionText">
                      {showChinese ? (
                        <>{countDown} 秒内播放音频</>
                      ) : (
                        <>Audio playing in {countDown} second(s)</>
                      )}
                    </p>
                  ) : (
                    <p className="actionText">
                      {showChinese ? (
                        <>再听一次指示?</>
                      ) : (
                        <>Listen to instructions again?</>
                      )}
                    </p>
                  )}
                </p>
              </div>
            )}
          </div>
          {stage === 1 ? (
            <Story
              imageLinks={links}
              disableOption={disableOption}
              showChinese={showChinese}
              beforeUnload={() => {}}
            />
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};
export default StoryTest;
