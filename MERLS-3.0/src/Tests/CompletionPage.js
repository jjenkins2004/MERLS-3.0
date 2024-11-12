import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";
import confetti from 'canvas-confetti';

let instructionAudio;

const CompletionPage = ({showChinese, audioLink, imageLink, submitAnswers}) => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [replay, setReplay] = useState(false);
    const [finishedListening, setFinishedListening] = useState(false);
    const [countDown, setCountDown] = useState(3);
    const [paused, setPaused] = useState(false);
    const [confettiCooldown, setConfettiCooldown] = useState(true);

    const timeoutRef = useRef(null);
    
      useEffect(() => {
        clearTimeout(timeoutRef.current);
        if (countDown > 0) {
          timeoutRef.current = setTimeout(() => {
            setCountDown((prevCountDown) => prevCountDown - 1);
          }, 1000);
        } else {
            instructionAudio = new Audio(audioLink);
            instructionAudio.addEventListener("play", () => {
              setAudioPlaying(true);
            });
            instructionAudio.addEventListener("ended", () => {
              setAudioPlaying(false);
              setFinishedListening(true);
            });
            instructionAudio.play();
        }
    
        return () => {
            clearTimeout(timeoutRef.current);
        }
      }, [countDown]);

      useEffect(() => {
        if (countDown < 1 && replay) {
            setReplay(false);
            instructionAudio = new Audio(audioLink);
            instructionAudio.addEventListener("play", () => {
                setAudioPlaying(true);
            });
            instructionAudio.addEventListener("ended", () => {
                setAudioPlaying(false);
            });
            instructionAudio.play();
        }
      }, [replay])

      useEffect(() => {
        confetti({
            particleCount: 300,
            spread: 200,
            origin: { x: 0.5, y: 0.5 }, // Center of the screen
          });
      }, [])

    return(
        <div>
            <div className="confettiContainer">
                <GreenButton className="confettiButton" showChinese={showChinese} textChinese={"庆祝！🎉"} textEnglish={"Celebrate! 🎉"} 
                onClick={() => {
                    if (confettiCooldown) {
                        confetti({
                            particleCount: 100,
                            spread: 100,
                            origin: {x: (0.3 + Math.random() * (0.7 - 0.3)), y: (0.3 + Math.random() * (0.7 - 0.3))}
                        });
                        setConfettiCooldown(false);
                        setTimeout(() => {
                            setConfettiCooldown(true);
                        }, 500);
                    }
                }}/>
            </div>
            <div className="indicator">
                {audioPlaying ? (
                <div>
                    <IconButton aria-label="pause" disabled>
                    <PauseCircleIcon
                        color="primary"
                        className="pauseButton disabled"
                    />
                    </IconButton>
                    <p className = "actionText">{showChinese ? 
                        <>播放中...</> : 
                        <>Playing...</>}</p>
                </div>
                ) : (
                <div>
                    <IconButton
                        aria-label="play"
                        style={{marginBottom: '0'}}
                        onClick={() => {
                        if (countDown > 0) {
                            setCountDown(0);
                        }
                        else {
                            setReplay(true);
                        }
                        }}
                    >
                        <PlayCircleIcon
                        color="primary"
                        className="pauseButton"
                        />
                    </IconButton>
                    {countDown > 0 ? (
                         <p className = "actionText">{showChinese ? 
                            <>{countDown} 秒内播放音频</> : 
                            <>Audio playing in {countDown} second(s)</>}</p>
                    ) : (
                        <p className = "actionText">{showChinese ? 
                            <>再听一遍吗?</> : 
                            <>Listen again?</>}</p>
                    )}
                </div>
                )}
            </div>
            <div className="puppyContainer">
                <img
                    className="instructionPuppy"
                    src={imageLink}
                    alt="puppy animation"
                ></img>
            </div>
            <div className="submitButtonContainer">
                <GreenButton 
                    showChinese={showChinese} 
                    textEnglish="Submit Answers"
                    textChinese="提交答案"
                    onClick={() => {
                        submitAnswers();
                }}/>
            </div>
        </div>
    )
};
export default CompletionPage;