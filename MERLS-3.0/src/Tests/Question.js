import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";

let questionAudio;

const Question = ({ curQuestion, recordAnswer, showChinese }) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [paused, setPaused] = useState(false);
  const [remainingPlayCount, setRemainingPlayCount] = useState(2);
  const [disableOption, setDisableOption] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (questionAudio instanceof Audio) {
      questionAudio.pause();
    }
    setAudioPlaying(false);
    setCountDown(3);
    setPaused(false);
    setRemainingPlayCount(2);
  }, [curQuestion]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (countDown > 0 && !paused) {
      // timeoutRef is used here so we can pause the countDown by clearing timeout
      timeoutRef.current = setTimeout(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    } else {
      if (remainingPlayCount > 0 && !paused) {
        questionAudio = new Audio(curQuestion.question_link);
        questionAudio.addEventListener("play", () => {
          setAudioPlaying(true);
          // Note below how I set remainingPlayCount, it's because the `set` method
          // from useState are async so we need to pass in a call-back
          setRemainingPlayCount((prePlayCount) => prePlayCount - 1);
        });
        questionAudio.addEventListener("ended", () => {
          setAudioPlaying(false);
          if (disableOption) {
            // after the audio is played for the first time, we will allow user to click the options
            setDisableOption(false);
          }
          // check the most up-to-date remainingPlayCount after audio ends
          setRemainingPlayCount((prevPlayCount) => {
            if (prevPlayCount > 0) {
              setCountDown(10);
            }
            return prevPlayCount;
          });
        });
        questionAudio.play().catch((error) => {
          alert("error in playing question.", error);
          setDisableOption(false);
        });
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [countDown, paused]);

  const gotoNextQuestion = (idx) => {
    setDisableOption(true);
    // option and answer are 1-indexed
    recordAnswer(curQuestion.question_id, idx + 1);
  };

  return (
    <div>
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
                disabled={remainingPlayCount < 1}
                aria-label="play"
                style={{ marginBottom: "0" }}
                onClick={() => {
                  setPaused(false);
                  setCountDown(countDown);
                }}
              >
                <PlayCircleIcon
                  color="primary"
                  className={
                    "pauseButton" + (remainingPlayCount < 1 ? " disabled" : "")
                  }
                />
              </IconButton>
            ) : (
              <IconButton
                disabled={remainingPlayCount < 1}
                aria-label="pause"
                style={{ marginBottom: "0" }}
                onClick={() => {
                  setPaused(true);
                }}
              >
                <PauseCircleIcon
                  color="primary"
                  className={
                    "pauseButton" + (remainingPlayCount < 1 ? " disabled" : "")
                  }
                />
              </IconButton>
            )}
            {paused ? (
              <p className="actionText">
                {showChinese ? <>已被用户暂停</> : <>Paused by user</>}
              </p>
            ) : remainingPlayCount > 0 ? (
              <p className="actionText">
                {showChinese ? (
                  <>{countDown} 秒内播放音频</>
                ) : (
                  <>Audio playing in {countDown} second(s)</>
                )}
              </p>
            ) : (
              <p className="actionText">
                {showChinese ? <>单击图片选择</> : <>Click image to choose</>}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="imagesContainer">
        {curQuestion.options.map((url, idx) => (
          <div
            className={`imageContainer ${
              selectedIdx === idx ? "selected" : "unselected"
            }`}
            onClick={() => {
              if (idx === selectedIdx) {
                setSelectedIdx(-1);
              } else {
                setSelectedIdx(idx);
              }
            }}
          >
            <img className="image" src={url} alt="choice"></img>
            <div
              className={`imageSelectedOverlay ${
                selectedIdx === idx ? "visible" : ""
              }`}
            ></div>
          </div>
        ))}
      </div>
      <div className="submitButtonContainer">
        <GreenButton 
            showChinese={showChinese} 
            textEnglish="Next"
            textChinese="下一个"
            disabled={selectedIdx === -1 /*|| disableOption*/}
            onClick={() => {
              if (selectedIdx !== -1 /*&& !disableOption*/) {
                gotoNextQuestion(selectedIdx);
                setSelectedIdx(-1);
              }
          }}/>
      </div>
    </div>
  );
};

export default Question;
