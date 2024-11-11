import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";

let instructionAudio;

const Instructions = ({showChinese, audioLink, setShowInstructions}) => {

    const [audioPlaying, setAudioPlaying] = useState(false);
    const [replay, setReplay] = useState(false);
    const [finishedListening, setFinishedListening] = useState(false);
    const [countDown, setCountDown] = useState(3);

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

    return(
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
                    <p className = "actionText">{showChinese ? 
                        <>播放说明...</> : 
                        <>Playing instructions...</>}</p>
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
                            <>再听一次指示?</> : 
                            <>Listen to instructions again?</>}</p>
                    )}
                </div>
                )}
            </div>
            <div className="puppyContainer">
                <img
                    className="instructionPuppy"
                    src="https://sites.usc.edu/heatlab/files/2024/10/puppy.png"
                    alt="puppy staring"
                ></img>
            </div>
            <div className="submitButtonContainer">
                <div className="submitButtonContainer">
                    <GreenButton 
                        showChinese={showChinese} 
                        textEnglish="Begin Practice"
                        textChinese="开始练习"
                        disabled={!finishedListening}
                        onClick={() => {
                            if (finishedListening) {
                                if (instructionAudio) {
                                    instructionAudio.pause();
                                }
                                setShowInstructions(false);
                            }
                            //testing to skip instructions before finish listening
                            // if (instructionAudio) {
                            //     instructionAudio.pause();
                            // }
                            // setShowInstructions(false);
                        }}/>
                </div>
            </div>
        </div>
    )
}

export default Instructions;