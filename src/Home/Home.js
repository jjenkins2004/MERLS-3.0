import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import "./Home.css";
import ChineseInstructions from "./ChineseInstructions";
import EnglishInstructions from "./EnglishInstructions";

const Home = () => {
  const [videoPlayed, setVideoPlayed] = useState(true);
  const [showChineseInstruction, setShowChineseInstruction] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageParam = params.get("cn-zw");
    setShowChineseInstruction(languageParam === "true");
  }, [location]);

  return (
    <div className="home">
      <AppBar className = "titleContainer">
          <h1 className = "title">
            {showChineseInstruction ? 
            <>欢迎来到MERLS</> :
            <>Welcome to MERLS</>
            }
          </h1>
          <h2 className = "subHeading">
            {
              showChineseInstruction ?
              "请认真观看视频并完成问题再开始测试" :
              "Please watch the below video and finish the questions before starting tests"
            }
          </h2>
          <button className = "translationButton" onClick ={() => setShowChineseInstruction(!showChineseInstruction)}>
            {showChineseInstruction ? "Change to English/更改为英语" : "Change to Chinese/更改为中文"}
          </button>
      </AppBar>
      <div className="introVideo">
        <iframe
          title="parent-instruction"
          src="https://drive.google.com/file/d/1s-_7BzxT7lKRK6QhR_7cTjiaK7pDQIXZ/preview"
          width="640"
          height="480"
          allow="autoplay"
        ></iframe>
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
      <Button
        disabled={!videoPlayed}
        variant="contained"
        href={`/parent-questions?cn-zw=${
          showChineseInstruction ? "true" : "false"
        }`}
      >
        {showChineseInstruction ? 
          <>下一步</> :
          <>Next</>
        }
      </Button>
    </div>
  );
};

export default Home;
