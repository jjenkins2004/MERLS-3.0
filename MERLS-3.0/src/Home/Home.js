import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import YouTube from "react-youtube";
import "./Home.css";
import ChineseInstructions from "./ChineseInstructions";
import EnglishInstructions from "./EnglishInstructions";
import TranslationButton from "../Components/TranslationButton";
import BlueButton from "../Components/BlueButton";

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
      setParentInstructionPlayed(true); // Parent video played
    } else if (videoIndex === 2) {
      setChildInstructionPlayed(true); // Child video played
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
            : "Please watch the below videos and finish the questions before starting tests"}
        </h2>
        <TranslationButton
          showChinese={showChineseInstruction}
          setShowChinese={setShowChineseInstruction}
        />
      </AppBar>

      {/* Parent video with header */}
      <div className="videoSection">
        <h3>
          {showChineseInstruction ? "家长介绍视频" : "Parent Instruction Video"}
        </h3>
        <YouTube
          videoId={showChineseInstruction ? "wRf7l93Xvds" : "iklkk62J6-Q"} // replaced with parent instruction's from MERLS YouTube video ID
          onEnd={() => onVideoEnd(1)}
          opts={{
            playerVars: {
                rel: 0, // disables youtube's video suggestion feature at the end of the clip
            },
          }}
        />
        {!parentInstructionPlayed && ( // moved warning to below parent video for clarity
          <p style={{ color: "red" }}>
            {showChineseInstruction
              ? "请先观看家长介绍视频"
              : "Please watch the parent instruction video first"}
          </p>
        )}
      </div>

      {/* Child video with header, only enabled after parent video ends */}
      <div className="videoSection">
        <h3>
          {showChineseInstruction ? "儿童介绍视频" : "Child Instruction Video"}
        </h3>
        <YouTube
          videoId={showChineseInstruction ? "6zwj_DnnYfA" : "T4z2BCcjzP8"} // replaced with child instruction's from MERLS YouTube video ID
          onEnd={() => onVideoEnd(2)}
          opts={{
              playerVars: {
                  rel: 0, // disables youtube's video suggestion feature at the end of the clip
              },
          }}
          style={{
            pointerEvents: parentInstructionPlayed ? "auto" : "none",
            opacity: parentInstructionPlayed ? 1 : 0.5,
          }}
        />
        {/* {!parentInstructionPlayed && (
          <p style={{ color: "red" }}>
            {showChineseInstruction
              ? "请先观看家长介绍视频"
              : "Please watch the parent instruction video first"}
          </p>
        )} */}
      </div>

      {/* Language-specific instructions */}
      {showChineseInstruction ? (
        <div>
          <ChineseInstructions />
        </div>
      ) : (
        <div>
          <EnglishInstructions />
        </div>
      )}

      {/* Proceed button, only enabled after both videos are played */}
      <BlueButton
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
