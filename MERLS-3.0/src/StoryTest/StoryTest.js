import { React, useState, useEffect, useRef } from "react";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";
import GreenButton from "../Components/GreenButton";
import Story from "./Story";
import TranslationButton from "../Components/TranslationButton";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import "../Tests/Test.scss";
import Retell from "./Retell";
import Questions from "./Questions";

let questionAudio;
let audioLink;

let links = [
  "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
  "https://preview.redd.it/world-where-cats-are-tiny-v0-ph2fbl81bjnc1.png?width=640&crop=smart&auto=webp&s=09b30f046cec73ae5ea0274051121df387af0c62",
  "https://i.pinimg.com/736x/28/95/e0/2895e0015ce0f5c34406aea2f9cc5643.jpg",
  "https://imgcdn.stablediffusionweb.com/2024/9/14/7ea109f3-4496-468e-a947-460a21bb2a25.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOuymCW3YqLt21VvEEM3gtdU65O8aU6oDAXw&s",
  "https://ychef.files.bbci.co.uk/1280x720/p0jkct29.jpg",
];

let test_questions = [
  {question_audio:"", link: "", image_links: ["https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7", "https://preview.redd.it/world-where-cats-are-tiny-v0-ph2fbl81bjnc1.png?width=640&crop=smart&auto=webp&s=09b30f046cec73ae5ea0274051121df387af0c62", "https://imgcdn.stablediffusionweb.com/2024/9/14/7ea109f3-4496-468e-a947-460a21bb2a25.jpg"]},
  {question_audio:"", link: "", image_links: null},
  {question_audio:"", link: "", image_links: ["https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7"]},
  {question_audio:"", link: "", image_links: null},
];

let retellingLinks = [];

const LAMBDA_API_ENDPOINT = "https://2inehosoqi.execute-api.us-east-2.amazonaws.com/prod/audio-upload";

const StoryTest = ({ language }) => {
  //currentStory and stages will use 1 based indexing
  const [currentStory, setCurrentStory] = useState(1);
  //used to keep track of the current question stage, stage 1 is telling the story, stage 2 is the retelling, stage 3 are the followup questions
  const [stage, setStage] = useState(1);
  //used to keep track of the stage's different parts, i.e. current question or which narration link
  const [subStage, setSubStage] = useState(1);
  const [audioUrls, setAudioUrls] = useState({});

  //data for questions
  const [stories, setStories] = useState([]);
  const [imageLinks, setImageLinks] = useState(links);
  const [narrationLinks, setNarrationLinks] = useState([]);
  const [questions, setQuestions] = useState(test_questions);

  const [showLoading, setShowLoading] = useState(false);
  const [showChinese, setShowChinese] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [disableOption, setDisableOption] = useState(true);
  const timeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  //changing language display preference
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageParam = params.get("cn-zw");
    setShowChinese(languageParam === "true");
  }, [location]);

  //initial audio instructions
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (countDown > 0) {
      // timeoutRef is used here so we can pause the countDown by clearing timeout
      timeoutRef.current = setTimeout(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    } else {
      //plays audio with link that is assigned to audioLink
      playAudio();
    }

    return () => clearTimeout(timeoutRef.current);
  }, [countDown]);

  // fetch question list
  useEffect(() => {
    async function fetchQuestionList() {
      const response = await fetch(
          "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions?language=" +
          language + "&type=story_question",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
      );
      console.log("getting questions");
      const questionList = await response.json();
      console.log("Fetched questions:", questionList);
      setQuestions(questionList);
    }
    fetchQuestionList();
  }, []);

  // fetch story list
  useEffect(() => {
    async function fetchStoryList() {
      const response = await fetch(
          "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions?language=" +
          language + "&type=story_narration",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
      );
      console.log("getting stories");
      const storyList = await response.json();
      console.log("Fetched stories:", storyList);
      setStories(storyList);
      setImageLinks(storyList[0].image_links);
      // setNarrationLinks(storyList[0].narration_audios);
    }
    fetchStoryList();
  }, []);

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

  // upload audio to s3, depends on type
  const uploadToLambda = async (recordedBlob, type) => {
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(recordedBlob.blob);
    });

    // curr question id
    const questionId = subStage;

    const requestBody = {
      fileType: 'audio/webm',
      audioData: base64Data,
      userId: localStorage.getItem("username"),
      questionId: questionId,
      bucketName: type === "retell"
          ? "merls-story-user-audio/retell"
          : "merls-story-user-audio/question"
    };

    const response = await fetch(LAMBDA_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // Parse response and record audio URL
    const data = await response.json();
    if (data.url) {
      recordAudioUrl(questionId, data.url);
    }
    return data.url;
  };

  //function to play instruction/story audio
  const playAudio = () => {
    setDisableOption(false);
    questionAudio = new Audio(audioLink);
    questionAudio.addEventListener("play", () => {
      setAudioPlaying(true);
    });
    questionAudio.addEventListener("ended", () => {
      setAudioPlaying(false);

      if (disableOption) {
        // after the audio is played for the first time, we will allow user to click the options
        setDisableOption(false);
      }
    });
    questionAudio.play().catch((error) => {
      alert("error in playing question.", error);
      setDisableOption(false);
    });
  };

  //defining functions for question flow and logic
  const updateInstructionLink = (stage, subStage) => {
    //get the next instruction link based on the based in stage and substages
    if (stage === 1) {
      audioLink = narrationLinks[subStage - 1];
    } else if (stage === 2) {
      audioLink = retellingLinks[subStage - 1];
    } else if (stage === 3) {
      // audioLink = questions[subStage - 1].link;
      audioLink = questions[subStage - 1].question_audio;
    } else {
      audioLink = "";
    }
  };

  const advanceSubStage = () => {
    //first reset all variables
    setAudioPlaying(false);
    setCountDown(3);
    setDisableOption(true);
    if (stage === 1) {
      //assume there are always 3 narration links each narrating two pictures
      if (subStage === 3) {
        updateInstructionLink(2, 1);
        setStage(2);
        setSubStage(1);
      } else {
        updateInstructionLink(1, subStage + 1);
        setSubStage((prevStage) => prevStage + 1);
      }
    } else if (stage === 2) {
      //assume user will have 3 retelling sections
      if (subStage === 3) {
        updateInstructionLink(3, 1);
        setStage(3);
        setSubStage(1);
      } else {
        updateInstructionLink(2, subStage + 1);
        setSubStage((prevStage) => prevStage + 1);
      }
    } else {
      //go until the end of the questions
      if (subStage === questions.length) {
        audioLink = "instuction audio";
        setStage(1);
        setSubStage(1);
        //advance story
        if (currentStory === stories.length) {
          //end test
        } else {
          setCurrentStory((prev) => prev + 1);
        }
      } else {
        updateInstructionLink(3, subStage + 1);
        setSubStage((prevStage) => prevStage + 1);
      }
    }
  };

  const getRetellLinks = () => {
    console.log("current substage is: " + subStage);
    if (subStage === 1) {
      return [
        { id: 1, link: imageLinks[0] },
        { id: 2, link: imageLinks[1] },
      ];
    } else if (subStage === 2) {
      return [
        { id: 3, link: imageLinks[2] },
        { id: 4, link: imageLinks[3] },
      ];
    } else if (subStage === 3) {
      return [
        { id: 5, link: imageLinks[4] },
        { id: 6, link: imageLinks[5] },
      ];
    } else {
      return null;
    }
  };

  return (
    <div>
      {showLoading ? (
        <div></div>
      ) : (
        <div id="testPage">
          <AppBar className="titleContainer">
            <progress id="progress" value={5} max={10} />
            <TranslationButton
              showChinese={showChinese}
              setShowChinese={setShowChinese}
            />
          </AppBar>
          <div className="debugAdvanceButton">
            <GreenButton
              textEnglish="next part"
              onClick={() => {
                setAudioPlaying(false);
                setCountDown(3);
                setDisableOption(true);
                setStage((prevStage) => prevStage + 1);
                setSubStage(1);
              }}
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
                <p className="actionText">
                  {showChinese ? <>播放中</> : <>Playing Instructions</>}
                </p>
              </div>
            ) : (
              <div>
                <IconButton
                  aria-label="play"
                  style={{ marginBottom: "0" }}
                  onClick={() => {
                    playAudio();
                  }}
                >
                  <PlayCircleIcon color="primary" className={"pauseButton"} />
                </IconButton>
                <div className="actionText">
                  {countDown > 0 ? (
                    <p className="actionText">
                      {showChinese ? (
                        <>{countDown} 秒内播放音频</>
                      ) : (
                        <>Audio playing in {countDown} second(s)</>
                      )}
                    </p>
                  ) : (
                    <p className="actionText">
                      {showChinese ? (
                        <>再听一次指示?</>
                      ) : (
                        <>Listen to instructions again?</>
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {stage === 1 ? (
            <Story
              imageLinks={imageLinks}
              disableOption={disableOption}
              showChinese={showChinese}
              beforeUnload={advanceSubStage}
            />
          ) : stage === 2 ? (
            <Retell
              imageLinks={getRetellLinks()}
              showChinese={showChinese}
              disableOption={disableOption}
              beforeUnload={advanceSubStage}
              uploadToLambda={uploadToLambda}
              type="retell"
            />
          ) : stage === 3 ? (
            <Questions
              showChinese={showChinese}
              beforeUnload={advanceSubStage}
              disableOption={disableOption}
              imageLinks={questions[subStage-1].image_links}
              uploadToLambda={uploadToLambda}
              type="question"
            />
          ) : (
            <div>page does not exist</div>
          )}
        </div>
      )}
    </div>
  );
};
export default StoryTest;
