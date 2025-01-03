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
  const playAudio = () => {
    questionAudio = new Audio(
      "https://sites.usc.edu/heatlab/files/2024/11/RV-English-test-instruction-w-audio.m4a"
    );
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

  return (
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
      <Story imageLinks={links} />
      <GreenButton
        showChinese={showChinese}
        textEnglish="Next"
        textChinese="下一个"
        onClick={() => {}}
        disabled={disableOption}
      />
    </div>
  );
};
export default StoryTest;
