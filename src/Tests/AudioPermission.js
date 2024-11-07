import React, {useEffect, useState} from "react";
import { ReactMic } from 'react-mic';
import BlueButton from "../Components/BlueButton";
import "./Test.scss";

const AudioPermission = ({showChinese, setShowAudioPermission}) => {
    const [gavePermission, setGavePermission] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [disableRecordButton, setDisableRecordingButton] = useState(true);
    const [tested, setTested] = useState(false);

    const proceed = () => {
        setShowAudioPermission(false);
    }

    const checkProceedStatus = () => {
        if (!tested || !gavePermission) {
            return true;
        }
        else {
            return false;
        }
    }

    const getProceedTextEnglish = () => {
        if (!gavePermission) {
            return "Give Permission to Continue";
        }
        else if (!tested) {
            return "Test Microphone to Continue";
        }
        else {
            return "Proceed to Instructions";
        }
    }

    const getProceedTextChinese = () => {
        if (!gavePermission) {
            return "允许继续";
        }
        else if (!tested) {
            return "测试麦克风以继续";
        }
        else {
            return "继续到说明";
        }
    }

    const redirect = (page) => {
        console.log("redirecting");
        window.open(page, '_blank', 'noopener,noreferrer');
    }

    const beginRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            }, 5000);
    }

    const getButtonTextEnglish = () => {
        if (!gavePermission) {
            return "Microphone Access Disabled"
        }
        else if (isRecording) {
            return "Listening..."
        }
        else if (isPlaying) {
            return "Playing..."
        }
        else {
            return "Test Microphone"
        }
    }

    const getButtonTextChinese = () => {
        if (!gavePermission) {
            return "麦克风访问被禁用"
        }
        else if (isRecording) {
            return "正在听..."
        }
        else if (isPlaying) {
            return "正在播放..."
        }
        else {
            return "测试麦克风"
        }
    }

    useEffect(() => {
        if (isRecording || isPlaying || !gavePermission) {
            setDisableRecordingButton(true);
        }
        else {
            setDisableRecordingButton(false);
        }
    }, [isRecording, isPlaying, gavePermission])


    async function checkMicrophonePermission() {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
          if (permissionStatus.state === 'granted') {
            setGavePermission(true);
          } else if (permissionStatus.state === 'denied') {
            setGavePermission(false);
          } else {
            setGavePermission(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    
    const requestMicrophoneAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {}

        checkMicrophonePermission();
    }

    useEffect(() => {
        requestMicrophoneAccess();
    }, [])

    const onStop = (recordedBlob) => {
        if (recordedBlob) {
            const audio = new Audio(recordedBlob.blobURL);
            setIsPlaying(true);
            audio.play();
            audio.addEventListener("ended", () => {
                setIsPlaying(false);
                setDisableRecordingButton(false);
                setTested(true);
            })
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%"}}>
            <p style={{fontSize: "25px", fontWeight: "700", textAlign: "center"}}>
                {!showChinese ? "Please allow microphone access to proceed." : "请允许麦克风访问以继续。"}
            </p>
            <div style={{height: "30px"}}/>
            <p style={{fontSize: "15px", fontWeight: "500", textAlign: "center"}}>
                {!showChinese ? "If you see the moving bars, that means your microphone is working." : "如果您看到移动的条形图，那意味着您的麦克风正在工作。"}
            </p>
            <ReactMic
                record={isRecording}
                onStop={onStop}
                strokeColor="#ABC8E1"
                backgroundColor="#F0F8FF"
                visualSetting="frequencyBars"
                className="reactMicStyle" />
            <div style={{height: "20px"}}/>
            <BlueButton className="testMicrophone" showChinese={showChinese} textEnglish={getButtonTextEnglish()} textChinese={getButtonTextChinese()} onClick={beginRecording} disabled={disableRecordButton}/>
            <div style={{height: "90px"}}/>
            <BlueButton showChinese={showChinese} textEnglish={getProceedTextEnglish()} textChinese={getProceedTextChinese()} onClick={proceed} disabled={checkProceedStatus()}/>
            <div style={{height: "30px"}}/>
            <div className="divider"/>
            <p style={{fontSize: "20px", fontWeight: "700", textAlign: "center"}}>
                {!showChinese ? "Click on your browser to find out how to enable access" : "点击您的浏览器以了解如何启用访问权限"}
            </p>
            <div className="browserIconContainer">
                <img className="browserIcon" src="https://www.google.com/chrome/static/images/chrome-logo.svg" alt="google chrome icon" onClick={() => redirect("https://support.google.com/chrome/answer/2693767")}/>
                <img className="browserIcon" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg" alt="safari icon" onClick={() => redirect("https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac")}/>
                <img className="browserIcon" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Edge_logo_%282019%29.png" alt="microsoft edge icon" onClick={() => redirect("https://support.microsoft.com/en-us/windows/windows-camera-microphone-and-privacy-a83257bc-e990-d54a-d212-b5e41beba857")}/>
                <img className="browserIcon" src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg" alt="firefox icon"onClick={() => redirect("https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions")}/>
            </div>
        </div>
    )
};
export default AudioPermission;