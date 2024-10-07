import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import { SignalCellularConnectedNoInternet0Bar } from "@mui/icons-material";

let questionAudio;

const Question = ({ curQuestion, recordAnswer, showChinese}) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [paused, setPaused] = useState(false);
  const [remainingPlayCount, setRemainingPlayCount] = useState(2);
  const [disableOption, setDisableOption] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const timeoutRef = useRef(null);

  // calculate the option card's width according to the number of options
  const getOptionWidth = () => {
    const optionsLen = curQuestion.options.length;
    switch (optionsLen) {
      case 2:
      case 4:
        return 6;
      case 3:
      default:
        return 4;
    }
  };

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
      timeoutRef.current = setTimeout(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    } else {
      if (remainingPlayCount > 0 && !paused) {
        questionAudio = new Audio(curQuestion.question_link);
        questionAudio.addEventListener("play", () => {
          setAudioPlaying(true);
          setRemainingPlayCount((prePlayCount) => prePlayCount - 1);
        });
        questionAudio.addEventListener("ended", () => {
          setAudioPlaying(false);
          if (disableOption) {
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
        questionAudio.play();
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
            <p>{showChinese ? 
                <>播放中</> : 
                <>Playing question</>}</p>
          </div>
        ) : (
          <div>
            {paused ? (
              <IconButton
                disabled={remainingPlayCount < 1}
                aria-label="play"
                style={{marginBottom: '0'}}
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
                style={{marginBottom: '0'}}
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
              <p>{showChinese ? 
                <>已被用户暂停</> : 
                <>Paused by user</>}</p>
            ) : remainingPlayCount > 0 ? (
              <p>{showChinese ? 
                <>{countDown} 秒内播放音频</> : 
                <>Audio playing in {countDown} second(s)</>}</p>
            ) : (
              <p>{showChinese ? 
                <>单击图片选择</> : 
                <>Click image to choose</>}</p>
            )}
          </div>
        )}
      </div>
      {/* <Container>
        <Grid
          container
          spacing={4}
          sx={{
            width: curQuestion.options.length === 3 ? "100%" : "70%",
            margin: "0 auto",
          }}
          alignItems="baseline"
        >
          {curQuestion.options.map((url, idx) => (
            <Grid item xs={getOptionWidth()} key={idx}>
              <Card>
                <CardActionArea disabled={disableOption}>
                  <CardMedia
                    component="img"
                    image={url}
                    alt="option image"
                    disabled
                    className = "cardImage"
                    style={{
                      boxShadow: '10px 10px 12px rgba(0, 0, 0, 1)',
                    }}
                    onClick={() => gotoNextQuestion(idx)}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container> */}
      <div className = "imagesContainer"> 
        {curQuestion.options.map((url, idx) => (
          <div className="imageContainer">
            <img
              className={`image ${selectedIdx === idx ? 'selected' : 'unselected'}`}
              src={url}
              alt="choice"
              onClick={() => {
                if (idx === selectedIdx) {
                  setSelectedIdx(-1);
                }
                else {
                  setSelectedIdx(idx);
                }
              }}
            >
            </img>
            <div className={`imageSelectedOverlay ${selectedIdx === idx ? 'visible' : ''}`}></div>
          </div>
        ))}
      </div>
      <div className="submitButtonContainer">
        <button 
        className = {`submitButton ${selectedIdx === -1 ? 'disabled' : 'enabled'}`}
        onClick={() => {
          if (selectedIdx !== -1) {
            gotoNextQuestion(selectedIdx);
            setSelectedIdx(-1);
          }
        }}
        >
          {showChinese ? <>下一个</> : <>Next</>}
        </button>
      </div>
    </div>
  );
};

export default Question;
