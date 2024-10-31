import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import microphoneDisabled from "../Components/mute.png";
import microphoneEnabled from "../Components/voice.png";
import GreenButton from "../Components/GreenButton";
import { ReactMic } from 'react-mic';

const LAMBDA_API_ENDPOINT = "https://2inehosoqi.execute-api.us-east-2.amazonaws.com/prod/audio-upload";

let questionAudio;

const Repetition = ({curQuestion, recordAnswer, showChinese}) => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [listening, setListening] = useState(false);
    const [finishedListening, setFinishedListening] = useState(false);
    const [recordingTimer, setRecordingTimer] = useState(20); //change this to maximum audio duration
    const [countDown, setCountDown] = useState(3);
    const [uploading, setUploading] = useState(false);

    //microphone recording
    const [recording, setRecording] = useState(false);
    const micRef = useRef(null);

    const startRecording = () => {
        setRecording(true);
    };

    const stopRecording = () => {
        setRecording(false);
    };

    const uploadToLambda = async (recordedBlob) => {
        try {
            setUploading(true);

            // Create a FileReader to convert blob to base64
            const reader = new FileReader();
            const base64Data = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(recordedBlob.blob);
            });

            const requestBody = {
                fileType: 'audio/webm',
                audioData: base64Data,
                userId: localStorage.getItem("username"),
                questionId: curQuestion.question_id
            };
            console.log('Request body:', requestBody);

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
            console.log('Upload success:', data);
            return data.url;

        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    };


    const onStop = async (recordedBlob) => {
        if (!recordedBlob) {
            return;
        }
        const url = recordedBlob.blobURL; 
        console.log(url);
        const link = document.createElement('a'); 
        link.href = url;
        link.download = 'recording.webm';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        // upload to s3
        try {
            const s3Url = uploadToLambda(recordedBlob);
            console.log('Recording stored at:', s3Url);
        } catch (error) {
            console.error('Failed to process recording:', error);
            alert("Error uploading recording: " + error.message);
        }
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
        if (recordingTimer <= 0) {
            stopRecording();
            return;
        }

        const timerId = setTimeout(() => {
            setRecordingTimer((prevSeconds) => prevSeconds - 1);
        }, 1000);

        // Cleanup function to clear the timeout
        return () => clearTimeout(timerId);
      }, [recordingTimer])

    return(
        <div>
            <div className="reactMicContainer">
                <ReactMic
                    record={recording}
                    onStop={onStop}
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
                <GreenButton 
                    showChinese={showChinese} 
                    textEnglish="Next"
                    textChinese="下一个"
                    disabled={!finishedListening}
                    onClick={() => {
                        if (finishedListening) {
                            if (questionAudio) {
                                questionAudio.pause();
                            }
                            stopRecording();
                            gotoNextQuestion();
                        }
                }}/>
            </div>
        </div>
    )
}
export default Repetition;