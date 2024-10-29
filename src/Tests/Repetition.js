import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import microphoneDisabled from "../Components/mute.png";
import microphoneEnabled from "../Components/voice.png";
import { ReactMic } from 'react-mic';

let questionAudio;



const Repetition = ({curQuestion, recordAnswer, showChinese}) => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [listening, setListening] = useState(false);
    const [finishedListening, setFinishedListening] = useState(false);
    const [countDown, setCountDown] = useState(3);

    //microphone recording
    const [recording, setRecording] = useState(false);
    const micRef = useRef(null);

    const startRecording = () => {
        setRecording(true);
    };

    const stopRecording = () => {
        setRecording(false);
    };

    const onStop = (recordedBlob) => {
        const url = recordedBlob.blobURL; // Create a blob URL
        const link = document.createElement('a'); // Create a temporary anchor element
        link.href = url; // Set the URL to the blob
        link.download = 'recording.wav'; // Set the desired file name
        document.body.appendChild(link); // Append to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM
        URL.revokeObjectURL(url);
    };

    const timeoutRef = useRef(null);
    
      useEffect(() => {
        clearTimeout(timeoutRef.current);
        if (countDown > 0) {
          timeoutRef.current = setTimeout(() => {
            setCountDown((prevCountDown) => prevCountDown - 1);
          }, 1000);
        } else {
            questionAudio = new Audio(curQuestion.question_link);
            questionAudio.addEventListener("play", () => {
              setAudioPlaying(true);
            });
            questionAudio.addEventListener("ended", () => {
              setAudioPlaying(false);
              setFinishedListening(true);
              startRecording();
            });
            questionAudio.play();
        }
    
        return () => {
            clearTimeout(timeoutRef.current);
        }
      }, [countDown]);

      const gotoNextQuestion = () => {
        recordAnswer(curQuestion.question_id, 0 + 1);
        setAudioPlaying(false);
        setFinishedListening(false);
        setCountDown(3);
      };

      useEffect(() => {
        if (finishedListening === true) {

        }
      }, [finishedListening])

    return(
        <div>
            <div className="reactMicContainer">
                <ReactMic
                    record={recording}
                    onStop={onStop}
                    mimeType="audio/wav"
                    audioBitsPerSecond={128000}
                    ref={micRef}
                    visualSetting="none" // Hide the waveform
                />
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
                    <p className = "actionText">
                        {showChinese ? <>播放中</> : <>Playing question</>}
                    </p>
                </div>
                ) : (
                <div>
                    <IconButton
                        aria-label={finishedListening ? "pause" : "play"}
                        disabled={finishedListening ? true : false}
                        style={{marginBottom: '0'}}
                        onClick={() => {
                        if (countDown > 0) {
                            setCountDown(0);
                        }
                        }}
                    >
                        {finishedListening ? (
                            <PauseCircleIcon
                            color="primary"
                            className="pauseButton disabled"
                        />
                        ) : (
                            <PlayCircleIcon
                            color="primary"
                            className="pauseButton"
                        />
                        )}
                    </IconButton>
                    {countDown > 0 ? (
                         <p className = "actionText">{showChinese ? 
                            <>{countDown} 秒内播放音频</> : 
                            <>Audio playing in {countDown} second(s)</>}</p>
                    ) : (
                        finishedListening ? (
                            <p className = "actionText">{showChinese ? 
                                <>现在，尝试重复我所说的话。</> : 
                                <>Now, try to repeat what I said.</>}</p>
                        ) : (
                            <p className = "actionText">{showChinese ? 
                                <>仔细听我说的话。</> : 
                                <>Listen carefully to what I say.</>}</p>
                        )
                    )}
                </div>
                )}
            </div>
            <div style={{height: "60px"}} />
                {finishedListening ? (
                    <div className="listeningContainer">
                        <div className="microphoneAnimationContainer">
                            <div className="listeningBar"/>
                            <div className="listeningBar"/>
                            <div className="listeningBar"/>
                            <div className="listeningBar"/>
                            <img
                                src={microphoneEnabled}
                                alt="microhpone"
                                className="enabledMicrophone"
                            ></img>
                            <div className="listeningBar"/>
                            <div className="listeningBar"/>
                            <div className="listeningBar"/>
                            <div className="listeningBar"/>
                        </div>
                        <p className="listeningText">
                            Microphone is recording.
                        </p>
                    </div>
                ) : (
                    <div className="listeningContainer">
                        <img
                            src={microphoneDisabled}
                            alt="crossed out microhphone"
                            className="disabledMicrophone"
                        >
                        </img>
                        <p className="listeningText">
                            Please wait for me to finish speaking.
                        </p>
                    </div>
                )}
            <div style={{height: "40px"}} />
            <div className="submitButtonContainer">
                <button 
                className = {`submitButton ${finishedListening ? 'enabled' : 'disabled'}`}
                onClick={() => {
                    if (finishedListening) {
                        questionAudio.pause();
                        stopRecording();
                        gotoNextQuestion();
                    }
                }}
                >
                {showChinese ? <>下一个</> : <>Next</>}
                </button>
            </div>
        </div>
    )
}
export default Repetition;