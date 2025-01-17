import { React, useState, useRef, useEffect } from "react";
import { ReactMic } from "react-mic";
import "./StoryTest.css";

const LAMBDA_API_ENDPOINT = "https://2inehosoqi.execute-api.us-east-2.amazonaws.com/prod/audio-upload";

const Retell = ({ imageLinks, showChinese, beforeUnload }) => {
  //microphone recording
  const [recording, setRecording] = useState(false);
  const [finishedProcessing, setFinishedProcessing] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const micRef = useRef(null);
  const [audioUrls, setAudioUrls] = useState({});
  // const [uploading, setUploading] = useState(false);
  const questionIdRef = useRef(0);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const recordAudioUrl = (questionId, s3Url) => {
    if (!questionId || !s3Url) {
      console.error('Missing required parameters:', { questionId, s3Url });
      return;
    }
    const truncatedUrl = s3Url.split('?')[0];

    setAudioUrls(prev => {
      const updatedUrls = {...prev, [questionId]: truncatedUrl};
      console.log('Current Audio URLs:', updatedUrls);
      return updatedUrls;
    });
  };

  const uploadToLambda = async (recordedBlob) => {
    try {
      // setUploading(true);

      // Create a FileReader to convert blob to base64
      const reader = new FileReader();
      const base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(recordedBlob.blob);
      });
      // temp question id
      questionIdRef.current += 1;
      const questionId = questionIdRef.current;

      const requestBody = {
        fileType: 'audio/webm',
        audioData: base64Data,
        userId: localStorage.getItem("username"),
        questionId: questionId,
        bucketName: "merls-story-user-audio",
      };
      // console.log('Request body:', requestBody);

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
      // console.log('Upload success:', data);

      // Record the S3 URL for this question
      if (data.url) {
        recordAudioUrl(questionIdRef.current, data.url);
      }
      return data.url;

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      // setUploading(false);
    }
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
    const s3Url = await uploadToLambda(recordedBlob);
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
