import React, { useState, useEffect, useRef } from "react";
import { ReactMic } from "react-mic";

const Questions = ({ showChinese, beforeUnload, imageLinks, uploadToLambda, type }) => {
  //microphone recording
  const [recording, setRecording] = useState(false);
  const [finishedProcessing, setFinishedProcessing] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const micRef = useRef(null);

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
    <div id="questions">
      <div className="reactMicContainer">
        <ReactMic
          record={recording}
          onStop={onStop}
          ref={micRef}
          visualSetting="none" // Hide the waveform
        />
      </div>
        {imageLinks ? (
          <div className="container">
            {imageLinks.map((item) => {
              return (
                <div className="itemContainer">
                  <img
                    src={item}
                    alt="story scene"
                    className="storyItem"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space"/>
        )}
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
            <p>Listening...</p>
            <div className="listeningBar" />
            <div className="listeningBar" />
            <div className="listeningBar" />
            <div className="listeningBar" />
          </div>
          (click again to submit answer)
        </div>
      ) : (
        <div className="recordingContainer" onClick={startRecording}>
          <p>Click to Record Answer</p>
        </div>
      )}
    </div>
  );
};

export default Questions;
