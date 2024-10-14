import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import "./Home.css";
import ChineseInstructions from "./ChineseInstructions";
import EnglishInstructions from "./EnglishInstructions";
import TranslationButton from "../Components/TranslationButton";
import ProceedButton from "../Components/ProceedButton";

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
        <iframe
          title="parent-instruction"
          src={
            showChineseInstruction
              ? "https://drive.google.com/file/d/1L-ndiuh5e-EoFXQwWKn1sNjxAXnMSZc4/preview"
              : "https://drive.google.com/file/d/1vf9OY__JyOuY7qgM3-GlOskB1NuMzZXE/preview"
          }
          width="640"
          height="480"
        ></iframe>
      </div>
      <div className="introVideo">
        <iframe
          title="child-instruction"
          src={
            showChineseInstruction
              ? "https://drive.google.com/file/d/1Iw0x5F4y82vB1HrlF14kujTzffCeostq/preview"
              : "https://drive.google.com/file/d/1pTGSn4nQEUGCUQfwSY3wZmEQUeviKcyq/preview"
          }
          width="640"
          height="480"
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
      <ProceedButton 
        disabled={!videoPlayed}
        showChinese={showChineseInstruction} 
        textEnglish={"Next"}
        textChinese={"下一步"}
        onClick={()=> {
          const url = `/parent-questions?cn-zw=${showChineseInstruction ? "true" : "false"}`;
          window.location.href = url;
        }}
      />
    </div>
  );
};

export default Home;
