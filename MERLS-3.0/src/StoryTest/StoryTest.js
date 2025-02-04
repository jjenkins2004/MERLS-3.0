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
import CompletionPage from "../Tests/CompletionPage";
import Confirmation from "../Components/Confirmation";
import Instructions from "./Instructions";
import AudioPermission from "../Tests/AudioPermission";

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
  {
    question_audio: "",
    link: "",
    image_links: [
      "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
      "https://preview.redd.it/world-where-cats-are-tiny-v0-ph2fbl81bjnc1.png?width=640&crop=smart&auto=webp&s=09b30f046cec73ae5ea0274051121df387af0c62",
      "https://imgcdn.stablediffusionweb.com/2024/9/14/7ea109f3-4496-468e-a947-460a21bb2a25.jpg",
    ],
  },
  { question_audio: "", link: "", image_links: null },
  {
    question_audio: "",
    link: "",
    image_links: [
      "https://preview.redd.it/yfdr471cb5ua1.png?auto=webp&s=e95f9bc386c1a23629600e8c6241e4a083c3aed7",
    ],
  },
  { question_audio: "", link: "", image_links: null },
];

let retellingLinks = [
  "https://merls-story-audio.s3.us-east-2.amazonaws.com/instruction/retell_instructions_1.m4a",
  "https://merls-story-audio.s3.us-east-2.amazonaws.com/instruction/retell_instructions_2.m4a",
  "https://merls-story-audio.s3.us-east-2.amazonaws.com/instruction/retell_instructions_2.m4a",
];

const LAMBDA_API_ENDPOINT =
  "https://2inehosoqi.execute-api.us-east-2.amazonaws.com/prod/audio-upload";

const narration_instruction =
  "https://merls-story-audio.s3.us-east-2.amazonaws.com/instruction/narration_instructions.m4a";

const StoryTest = ({ language }) => {
  //currentStory will use 1 based indexing
  const [currentStory, setCurrentStory] = useState(1);
  //used to keep track of the current question stage, stage 0 is instruction, stage 1 is telling the story, stage 2 is the retelling, stage 3 are the followup questions
  const [stage, setStage] = useState(0);
  //used to keep track of the stage's different parts, i.e. current question or which narration link
  const [subStage, setSubStage] = useState(1);
  const [audioUrls, setAudioUrls] = useState({});
  const [retellUrls, setRetellUrls] = useState({});
  const subStageRef = useRef(subStage);

  //data for questions
  //data for all stories
  const [stories, setStories] = useState([]);
  //used to reference story image link
  const [imageLinks, setImageLinks] = useState([]);
  //used to reference story narrationLinks
  const [narrationLinks, setNarrationLinks] = useState([]);
  //questions for the current story
  const [questions, setQuestions] = useState([]);

  const [showAudioPermission, setShowAudioPermission] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showChinese, setShowChinese] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [disableOption, setDisableOption] = useState(true);
  const timeoutRef = useRef(null);
  const [uploadsInProgress, setUploadsInProgress] = useState(0);

  //used for the progress bar
  const [totalStages, setTotalStages] = useState(1);
  const [currentStage, setCurrentStage] = useState(0);

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
    //dont initiate countdown if on loading screen or audio permission
    if (showLoading || showAudioPermission) {
      return
    }
    if (countDown > 0) {
      // timeoutRef is used here so we can pause the countDown by clearing timeout
      timeoutRef.current = setTimeout(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    } else {
      //plays audio with link that is assigned to audioLink
      if (!audioPlaying) {
        playAudio();
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [countDown, showLoading, showAudioPermission]);

  // fetching story data
  useEffect(() => {
    async function fetchStoryData() {
      const response = await fetch(
        "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions?language=" +
          language +
          "&type=story",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("getting story data");
      const data = await response.json();
      setStories(data);
      console.log("Fetched story data:", data);
      //setting variables
      setQuestions(data[0].questions);
      setImageLinks(data[0].image_links);
      setNarrationLinks(data[0].narration_audios);
      audioLink = narration_instruction;
      setShowLoading(false);

      //finding total number of stages
      var total = 0;
      for (const element of data) {
        //+ 4 for narration instruction audios + 3 retelling section + 1 for question instructions + number of questions
        total += 8;
        total += element.questions.length;
      }
      setTotalStages(total);
    }
    fetchStoryData();
  }, []);

  const recordAudioUrl = (questionId, s3Url, type) => {
    if (!questionId || !s3Url) {
      console.error("Missing required parameters:", { questionId, s3Url });
      return;
    }
    const truncatedUrl = s3Url.split("?")[0];

    if (type === "retell") {
      setRetellUrls((prev) => {
        const updatedUrls = {
          ...prev,
          [currentStory]: {
            ...(prev[currentStory] || {}),
            [questionId]: truncatedUrl,
          },
        };
        console.log("Current Audio URLs for retell:", updatedUrls);
        return updatedUrls;
      });
    } else {
      setAudioUrls((prev) => {
        const updatedUrls = {
          ...prev,
          [currentStory]: {
            ...(prev[currentStory] || {}),
            [questionId]: truncatedUrl,
          },
        };
        console.log("Current Audio URLs for questions:", updatedUrls);
        return updatedUrls;
      });
    }
  };

  // upload audio to s3, depends on type
  const uploadToLambda = async (recordedBlob, type) => {
    setUploadsInProgress(prev => prev + 1);
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(recordedBlob.blob);
    });

    // curr question id
    const questionId = subStageRef.current;
    console.log("current story id:", currentStory);
    console.log("current question id:", questionId);

    const requestBody = {
      fileType: "audio/webm",
      audioData: base64Data,
      userId: localStorage.getItem("username"),
      questionId: questionId,
      bucketName:
        type === "retell"
          ? `merls-story-user-audio/retell/${currentStory}`
          : `merls-story-user-audio/question/${currentStory}`,
    };

    const response = await fetch(LAMBDA_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    // Parse response and record audio URL
    const data = await response.json();
    if (data.url) {
      recordAudioUrl(questionId, data.url, type);
    }
    setUploadsInProgress(prev => prev - 1);
    return data.url;
  };

  const submitAnswers = async () => {
    const username = localStorage.getItem("username");
    // console.log("type:", type);
    let endpoint =
        "https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getQuestions";
    let requestBody;
    requestBody = {
      participantId: username,
      userAns: null,
      isEN: language === "CN" ? false : true,
      isAudioTest: false,
      storySubmissionList: audioUrls,
      retellSubmissionList: retellUrls,
      submissionType: "story",
    };
    console.log("Submitting data:", requestBody);

    const response = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const queryParam = `?cn-zw=${showChinese ? "true" : "false"}`;
      navigate(`/test-selection${queryParam}`);
    } else {
      alert("Failed to submit answers");
    }

  };

  //function to play instruction/story audio
  const playAudio = () => {
    console.log("playing " + audioLink);

    if (!audioLink) {
      console.log("audio link null");
      return;
    }

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

  //stop audio before when moving on
  const stopAudio = () => {
    try {
      questionAudio.pause();
      setAudioPlaying(false);
    } catch {
      console.log("couldn't pause audio");
    }
  };

  //defining functions for question flow and logic
  const updateInstructionLink = (stage, subStage) => {
    //get the next instruction link based on the based in stage and substages
    if (stage === 1) {
      audioLink = narrationLinks[subStage - 1];
    } else if (stage === 2) {
      audioLink = retellingLinks[subStage - 1];
    } else if (stage === 4) {
      // audioLink = questions[subStage - 1].link;
      audioLink = questions[subStage - 1].question_audio;
    } else {
      audioLink = "";
    }
  };

  const advanceSubStage = () => {
    if (stage === 0 && currentStory === 1) {
      setShowConfirmation(true);
      return;
    }
    //first reset all variables
    stopAudio();
    setCountDown(3);
    setDisableOption(true);

    setCurrentStage((prev) => prev + 1);
    if (stage === 0) {
      setSubStage(1);
      setStage(1);
      updateInstructionLink(1, 1);
    } else if (stage === 1) {
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
      subStageRef.current = subStage;
      //assume user will have 3 retelling sections
      if (subStage === 3) {
        audioLink =
          "https://merls-story-audio.s3.us-east-2.amazonaws.com/instruction/question_instructions.m4a";
        setStage(3);
        setSubStage(1);
      } else {
        updateInstructionLink(2, subStage + 1);
        setSubStage((prevStage) => prevStage + 1);
      }
    } else if (stage === 3) {
      setStage(4);
      updateInstructionLink(4, 1);
    } else {
      subStageRef.current = subStage;
      //go until the end of the questions
      if (subStage === questions.length) {
        //reset for next story question
        audioLink = narration_instruction;
        setStage(0);
        setSubStage(1);
        //advance story
        if (currentStory === stories.length) {
          //end test
          setCompleted(true);
          setAudioPlaying(true); //just to make sure that this componenet's audio function doesn't play, as the audio is going to be played in the Completion page
          console.log("test ending");
        } else {
          setQuestions(stories[currentStory].questions);
          setImageLinks(stories[currentStory].image_links);
          setNarrationLinks(stories[currentStory].narration_audios);
          setCurrentStory((prev) => prev + 1);
        }
      } else {
        updateInstructionLink(4, subStage + 1);
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

  if (showLoading) {
    return (
      <div className="loadingContainer">
        <CircularProgress size={75} thickness={3} variant="indeterminate" />
      </div>
    );
  } else if (showAudioPermission) {
    return (
      <AudioPermission showChinese={showChinese} setShowAudioPermission={setShowAudioPermission}/>
    )
  } else if (completed) {
    return (
      <div id="testPage">
        <AppBar className="titleContainer">
          <progress id="progress" value={1} max={1} />
          <TranslationButton
            showChinese={showChinese}
            setShowChinese={setShowChinese}
          />
        </AppBar>
        <CompletionPage
          showChinese={showChinese}
          audioLink={
            "https://sites.usc.edu/heatlab/files/2024/11/RV-Englsih-End-of-the-test-narration-w-audio.m4a"
          }
          imageLink={"https://sites.usc.edu/heatlab/files/2024/10/puppy3.gif"}
          submitAnswers={submitAnswers}
          uploadsInProgress={uploadsInProgress}
        />
      </div>
    );
  } else {
    return (
      <div id="testPage">
        <AppBar className="titleContainer">
          <progress id="progress" value={currentStage} max={totalStages} />
          <TranslationButton
            showChinese={showChinese}
            setShowChinese={setShowChinese}
          />
        </AppBar>
        {showConfirmation ? (
          <Confirmation
            showChinese={showChinese}
            setShowConfirmation={setShowConfirmation}
            englishText={
              "Are you sure you want to begin the English Story Test?"
            }
            chineseText={"你确定要开始英语故事测试吗"}
            confirmAction={() => {
              //first reset all variables
              setAudioPlaying(false);
              setCountDown(3);
              setDisableOption(true);

              //increment stage counter
              setCurrentStage((prev) => prev + 1);
              setSubStage(1);
              setStage(1);
              updateInstructionLink(1, 1);
            }}
          />
        ) : null}
        {localStorage.getItem("username") === "lucy" ? (
          <div className="debugAdvanceButton">
            <GreenButton
              textEnglish="next part"
              onClick={() => {
                stopAudio();
                advanceSubStage();
              }}
            />
          </div>
        ) : null}
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
        {stage === 0 || stage === 1 ? (
          <Story
            imageLinks={imageLinks}
            disableOption={disableOption}
            showChinese={showChinese}
            beforeUnload={() => {
              stopAudio();
              advanceSubStage();
            }}
          />
        ) : stage === 2 ? (
          <Retell
            imageLinks={getRetellLinks()}
            showChinese={showChinese}
            disableOption={disableOption}
            beforeUnload={() => {
              stopAudio();
              advanceSubStage();
            }}
            uploadToLambda={uploadToLambda}
            type="retell"
          />
        ) : stage === 3 ? (
          <Instructions
            showChinese={showChinese}
            beforeUnload={() => {
              stopAudio();
              advanceSubStage();
            }}
            disableOption={disableOption}
          />
        ) : stage === 4 ? (
          <Questions
            showChinese={showChinese}
            beforeUnload={() => {
              stopAudio();
              advanceSubStage();
            }}
            disableOption={disableOption}
            question={questions[subStage - 1]}
            uploadToLambda={uploadToLambda}
            type="question"
          />
        ) : (
          <div>page does not exist</div>
        )}
      </div>
    );
  }
};
export default StoryTest;
