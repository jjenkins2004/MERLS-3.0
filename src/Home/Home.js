import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import YouTube from "react-youtube";
import "./Home.css";
import ChineseInstructions from "./ChineseInstructions";
import EnglishInstructions from "./EnglishInstructions";
import TranslationButton from "../Components/TranslationButton";
import ProceedButton from "../Components/ProceedButton";

const Home = () => {
  const [parentInstructionPlayed, setParentInstructionPlayed] = useState(false);
  const [childInstructionPlayed, setChildInstructionPlayed] = useState(false);
  const [showChineseInstruction, setShowChineseInstruction] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageParam = params.get("cn-zw");
    setShowChineseInstruction(languageParam === "true");
  }, [location]);

  const onVideoEnd = (videoIndex) => {
    if (videoIndex === 1) {
      setParentInstructionPlayed(true);
    } else if (videoIndex === 2) {
      setChildInstructionPlayed(true);
    }
  };

  return (
    <div className="home">
      <AppBar className="titleContainer">
        <h1 className="title">
          {showChineseInstruction ? <>欢迎来到MERLS</> : <>Welcome to MERLS</>}
        </h1>
        <h2 className="subHeading">
          {showChineseInstruction
            ? "请认真观看视频并完成问题再开始测试"
            : "Please watch the below video and finish the questions before starting tests"}
        </h2>
        <TranslationButton
          showChinese={showChineseInstruction}
          setShowChinese={setShowChineseInstruction}
        />
      </AppBar>
      <div className="introVideo">
        {parentInstructionPlayed ? (
          <YouTube
            videoId={showChineseInstruction ? "orbkg5JH9C8" : "orbkg5JH9C8"} // Replace with child instruction's YouTube video ID, which is the part of the URL after v=
            onEnd={() => onVideoEnd(2)}
          />
        ) : (
          <YouTube
            videoId={showChineseInstruction ? "hP0Jz-6JoyY" : "hP0Jz-6JoyY"} // Replace with parent instruction's YouTube video ID, which is the part of the URL after v=
            onEnd={() => onVideoEnd(1)}
          />
        )}
      </div>
      {showChineseInstruction ? (
        <div>
          <ChineseInstructions />
        </div>
      ) : (
        <div>
          <EnglishInstructions />
        </div>
      )}
      <ProceedButton
        disabled={!childInstructionPlayed}
        showChinese={showChineseInstruction}
        textEnglish={"Next"}
        textChinese={"下一步"}
        onClick={() => {
          const url = `/parent-questions?cn-zw=${
            showChineseInstruction ? "true" : "false"
          }`;
          window.location.href = url;
        }}
      />
    </div>
  );
};

export default Home;
