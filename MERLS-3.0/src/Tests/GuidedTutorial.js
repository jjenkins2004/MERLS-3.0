import React, { useState, useEffect, useRef } from "react";
import "./Test.scss";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import microphoneDisabled from "../Components/mute.png";
import microphoneEnabled from "../Components/voice.png";
import GreenButton from "../Components/GreenButton";
import TextTip from "../Components/TextTip";

let questionAudio;

const toolTipText = [
    ["Welcome to the guided tutorial. Please read everything carefully to understand how this test works. Then, you can try a practice question before starting the real test.", ""],
    ["This picture means it's not time to speak yet. You can speak after I finish speaking.", "这张图片表示还不是说话的时间。等我说完后你就可以说话了。"],
    ["Be ready, I will start speaking in 3 seconds.", "准备好，我将在3秒后开始说话。"],
    ["Listen carefully, I am going to speak now!", "请仔细听，我现在要开始说话了！"],
    ["This picture means that you can speak now, the computer is recording. Try your best to repeat what I said.", "这张图片表示你现在可以说话了，计算机正在录音。尽力重复我说的话吧。"],
    ["Click this button once you are done talking to stop recording and move on to the next question.", "完成说话后点击这个按钮，以停止录音并继续下一个问题。"]
]



const GuidedTutorial = ({setShowGuidedTutorial, showChinese, lang}) => {
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [listening, setListening] = useState(false);
    const [beginCountDown, setBeginCountDown] = useState(false);
    const [recordingTimer, setRecordingTimer] = useState(20);
    const [finishedListening, setFinishedListening] = useState(false);
    const [countDown, setCountDown] = useState(3);
    const [tipNum, setTipNum] = useState(1);

    const timeoutRef = useRef(null);
    
      useEffect(() => {
        clearTimeout(timeoutRef.current);
        if (!finishedListening) {
            if (countDown > 0) {
                timeoutRef.current = setTimeout(() => {
                    //make sure that countdown doesn't go down when the first three tips are active
                    if (tipNum > 3) {
                        setCountDown((prevCountDown) => prevCountDown - 1);
                    }
                }, 1000);
                } else {
                    if (tipNum > 4) {
                        questionAudio = new Audio(lang === "CN" ? "https://sites.usc.edu/heatlab/files/2024/12/SR-当你看到麦克风时new.m4a" : "https://bpb-us-w1.wpmucdn.com/sites.usc.edu/dist/b/837/files/2024/11/SR-When-you-see-the-blue-microphone.m4a");
                        questionAudio.addEventListener("play", () => {
                        setAudioPlaying(true);
                        });
                        questionAudio.addEventListener("ended", () => {
                        setAudioPlaying(false);
                        setFinishedListening(true);
                        });
                        questionAudio.play();
                    }
                    else if (tipNum === 4) {
                        //change UI for this tip, but don't play audio
                        setAudioPlaying(true);
                    }
                }   
        }
    
        return () => {
            clearTimeout(timeoutRef.current);
        }
      }, [countDown, tipNum]);
    
    //skip tutorial for testing
    //   useEffect(() => {
    //     setShowGuidedTutorial(false);
    //   }, [])

    return(
        <HighlightArea showChinese={showChinese} tipNum={tipNum} setTipNum={setTipNum} toolTipNum={1}
            childView={
                <div>
                    <div className="indicator">
                        {audioPlaying ? (
                        <div>
                            <IconButton aria-label="pause" 
                            style={{marginBottom: '0', padding: '0'}}
                            disabled>
                            <PauseCircleIcon
                                color="primary"
                                className="pauseButton disabled"
                            />
                            </IconButton>
                            <HighlightArea showChinese={showChinese} tipNum={tipNum} setTipNum={setTipNum} toolTipNum={4}
                                childView={
                                    <p className = "actionText">{showChinese ? 
                                        <>仔细听我说的话。</> : 
                                        <>Listen carefully to what I say.</>}</p>
                                }
                            />
                        </div>
                        ) : (
                        <div>
                            <IconButton
                                aria-label={finishedListening ? "pause" : "play"}
                                disabled={finishedListening ? true : false}
                                style={{marginBottom: '0', padding: '0'}}
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
                                <HighlightArea showChinese={showChinese} tipNum = {tipNum} setTipNum={setTipNum} toolTipNum={3} 
                                    childView={
                                        <p className = "actionText">{showChinese ? 
                                            <>{countDown} 秒内播放音频</> : 
                                            <>Audio playing in {countDown} second(s)</>}</p>
                                    }
                                />
                            ) : (
                                <div> 
                                    <p className = "actionText">{showChinese ? 
                                        <>现在，尝试重复我所说的话。</> : 
                                        <>Now, try to repeat what I said.</>}</p>
                                    <p className = "actionText subText">{showChinese ? 
                                        <>如果你不知道，就说出你记得的。</> : 
                                        <>If you don't know, just say what you remember.</>}</p>
                                </div>
                            )}
                        </div>
                        )}
                    </div>
                        {finishedListening ? (
                            <HighlightArea showChinese={showChinese} tipNum={tipNum} setTipNum={setTipNum} toolTipNum={5}
                            childView={
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
                                    <p className="listeningText"> {showChinese ? 
                                        <>麦克风正在录音。</> : 
                                        <>Microphone is recording.</>}
                                    </p>
                                </div>
                            }
                        />
                        ) : (
                            <HighlightArea showChinese={showChinese} tipNum={tipNum} setTipNum={setTipNum} toolTipNum={2} 
                                childView={
                                    <div className="listeningContainer">
                                        <img
                                            src={microphoneDisabled}
                                            alt="crossed out microhphone"
                                            className="disabledMicrophone"
                                        >
                                        </img>
                                        <p className="listeningText"> {showChinese ? 
                                            <>请等待我说完。</> : 
                                            <>Please wait for me to finish speaking.</>}
                                        </p>
                                    </div>
                                }
                            />
                        )}
                        <div style={{height: "40px"}} />
                    <div className="submitButtonContainer">
                        <HighlightArea showChinese={showChinese} tipNum={tipNum} setTipNum={setTipNum} toolTipNum={6} 
                                childView={
                                    <GreenButton 
                                        showChinese={showChinese} 
                                        textEnglish="Next"
                                        textChinese="下一个"
                                        disabled={!finishedListening}
                                        onClick={() => {
                                            if (finishedListening) {
                                                setShowGuidedTutorial(false);
                                            }
                                    }}/>
                                }
                            />
                    </div>
                </div>
            }
        />
    )
};

const HighlightArea = ({showChinese, tipNum, setTipNum, toolTipNum, childView}) => {
    return (
        tipNum === toolTipNum ? (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div className="toolTipContainer">
                    <div className="grayOutBackground"/>
                    <div className="pointingToolTip"> 
                        <TextTip showChinese={showChinese} englishText={toolTipText[tipNum-1][0]} chineseText={toolTipText[tipNum-1][1]} tipNum={tipNum} setTipNum={setTipNum}/>
                    </div>
                    <div className="highlightedAreaContainer">
                        <div className="backgroundHighlight"/>
                        <div className="blockingOverlay"/>
                        {childView}
                    </div>
                </div>
            </div>
        ) : (
            childView
        )
    )
}


export default GuidedTutorial;