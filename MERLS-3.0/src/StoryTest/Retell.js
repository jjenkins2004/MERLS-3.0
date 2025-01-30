import { React, useState, useRef, useEffect } from "react";
import { ReactMic } from "react-mic";
import "./StoryTest.css";

const Retell = ({ imageLinks, showChinese, beforeUnload, uploadToLambda, type, disableOption }) => {
  //microphone recording
  const [recording, setRecording] = useState(false);
  const [finishedProcessing, setFinishedProcessing] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const micRef = useRef(null);
  // const [uploading, setUploading] = useState(false);
  const questionIdRef = useRef(0);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onStop = async (recordedBlob) => {
    setFinishedProcessing(true);
    if (!recordedBlob) {
      return;
    }
    const url = recordedBlob.blobURL;
    console.log(url);
    //recordAudioBlob(questionIdRef.current, recordedBlob);
    // upload to s3
    const s3Url = await uploadToLambda(recordedBlob, type);
    console.log('Recording stored at:', s3Url);
  };

  const onFinish = () => {
    setRecording(false);
    setFinishedProcessing(false);
  };

  useEffect(() => {
    if (finishedProcessing) {
      beforeUnload();
      onFinish();
    }
  }, [finishedProcessing]);

  return (
    <div id="retell">
      <div className="reactMicContainer">
        <ReactMic
          record={recording}
          onStop={onStop}
          ref={micRef}
          visualSetting="none" // Hide the waveform
        />
      </div>
      <div className="container">
        {imageLinks.map((item) => {
          return (
            <div className="itemContainer">
              {`${item.id}.`}
              <img src={item.link} alt="story scene" className="storyItem" />
            </div>
          );
        })}
      </div>
      {recording ? (
        <div
          className="recordingActionContainer"
          onClick={() => {
            stopRecording();
          }}
        >
          <div className="recordingContainer">
            <div className="listeningBar" />
            <div className="listeningBar" />
            <div className="listeningBar" />
            <div className="listeningBar" />
            <p>{showChinese ? "正在聆听..." : "Listening..."}</p>
            <div className="listeningBar" />
            <div className="listeningBar" />
            <div className="listeningBar" />
            <div className="listeningBar" />
          </div>
          {showChinese ? "(再次点击提交答案)" : "(click again to submit answer)"}
        </div>
      ) : disableOption ? (
        <div className="recordingContainer disabled">
          <p>{showChinese ? "正在播放说明..." : "Instructions playing..."}</p>
          </div>
      ) : (
        <div className="recordingContainer enabled" onClick={startRecording}>
          <p>{showChinese ? "点击录制答案" : "Click to record answer"}</p>
        </div>
      )}
    </div>
  );
};
export default Retell;
