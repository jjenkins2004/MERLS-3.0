import { React, useState, useEffect } from "react";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";
import TranslationButton from "../Components/TranslationButton";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import "../Tests/Test.scss";

const StoryTest = ({ language }) => {
  const [showChinese, setShowChinese] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [paused, setPaused] = useState(false);
  const [disableOption, setDisableOption] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageParam = params.get("cn-zw");
    setShowChinese(languageParam === "true");
  }, [location]);

  return (
    <div id="testPage">
      <AppBar className="titleContainer">
      <progress id="progress" value={5} max={10}/>
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
              {showChinese ? <>播放中</> : <>Playing question</>}
            </p>
          </div>
        ) : (
          <div>
            {paused ? (
              <IconButton
                aria-label="play"
                style={{ marginBottom: "0" }}
                onClick={() => {
                  setPaused(false);
                  setCountDown(countDown);
                }}
              >
                <PlayCircleIcon color="primary" className={"pauseButton"} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="pause"
                style={{ marginBottom: "0" }}
                onClick={() => {
                  setPaused(true);
                }}
              >
                <PauseCircleIcon color="primary" className={"pauseButton"} />
              </IconButton>
            )}
            {paused ? (
              <p className="actionText">
                {showChinese ? <>已被用户暂停</> : <>Paused by user</>}
              </p>
            ) : (
              <p className="actionText">
                {showChinese ? (
                  <>{countDown} 秒内播放音频</>
                ) : (
                  <>Audio playing in {countDown} second(s)</>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default StoryTest;
