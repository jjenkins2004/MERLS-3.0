import { React, useState, useRef, useEffect } from "react";
import { ReactMic } from "react-mic";
import "./StoryTest.css";

const Retell = ({ imageLinks, showChinese, beforeUnload }) => {
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
    //download file
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "recording.webm";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
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
export default Retell;
