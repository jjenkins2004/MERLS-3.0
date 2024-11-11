import React, {useState, useEffect, useRef} from "react";
import "./Test.scss";
import Question from "./Question";
import Repetition from "./Repetition";
import GuidedTutorial from "./GuidedTutorial";
import AudioPermission from "./AudioPermission";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";

const Practice = ({setShowPractice, question, type, language, showChinese, recordAudioUrl}) => {
    const [showPracticeQuestion, setShowPracticeQuestion] = useState(true);
    const [showGuidedTutorial, setShowGuidedTutorial] = useState(true);

    const finishPractice = () => {
        setShowPracticeQuestion(false);
    }

    const getAudioLink = () => {
        if (type === "repetition") {
            return language === "CN" ? "https://sites.usc.edu/heatlab/files/2024/11/SR练习完成后.m4a" : "https://sites.usc.edu/heatlab/files/2024/11/SR-once-the-practice-is-completed.m4a";
        }
        else if (language === "EN") {
            return "https://sites.usc.edu/heatlab/files/2024/10/English-Transition-to-the-real-test-items-w-audio-.m4a";
        }
        else {
            return "https://sites.usc.edu/heatlab/files/2024/10/Mandarin-Transition-to-the-real-test-items-w-audio.m4a";
        }
    }

    return (
       <div>
        {
             showPracticeQuestion ? (
                type === "matching" ? (
                    <div> 
                        <p className="practiceText">
                            {showChinese ? "这是一个练习题！" : "This a practice question!"}
                        </p>
                        <Question
                            curQuestion={question}
                            recordAnswer={finishPractice}
                            showChinese={showChinese}
                        />
                    </div>
                ) : type === "repetition" ? (
                    showGuidedTutorial ? (
                        <GuidedTutorial setShowGuidedTutorial = {setShowGuidedTutorial} showChinese = {showChinese}/>
                    ) : (
                        <div> 
                            <p className="practiceText">
                                {showChinese ? "这是一个练习题！" : "This a practice question!"}
                            </p>
                            <Repetition
                                curQuestion={question}
                                recordAnswer={finishPractice}
                                showChinese={showChinese}
                                recordAudioUrl={recordAudioUrl}
                            />
                        </div>
                    )
                ) : (
                    <p> type invalid </p>
                )
            ) : (
                <PracticePage showChinese={showChinese} audioLink={getAudioLink()} setShowPractice={setShowPractice}/>
            )
        }
       </div>
    )
};

let instructionAudio;

const PracticePage = ({showChinese, audioLink, setShowPractice}) => {

    const [audioPlaying, setAudioPlaying] = useState(false);
    const [replay, setReplay] = useState(false);
    const [finishedListening, setFinishedListening] = useState(true);
    const [countDown, setCountDown] = useState(3);
    const [paused, setPaused] = useState(false);

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
        if (countDown < 1) {
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
                    src="https://sites.usc.edu/heatlab/files/2024/10/puppy2.jpg"
                    alt="puppy raising paw"
                ></img>
            </div>
            <div className="submitButtonContainer">
                <GreenButton 
                    showChinese={showChinese} 
                    textEnglish="Begin Test"
                    textChinese="开始测试"
                    onClick={() => {
                        if (instructionAudio) {
                            instructionAudio.pause();
                        }
                        setShowPractice(false);
                    }}/>
            </div>
        </div>
    )
};

export default Practice;