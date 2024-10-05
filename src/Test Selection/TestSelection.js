import React, { useState, useEffect } from "react";
import "./TestSelection.css";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

const LanguageSelection = () => {
  const [englishListeningCompleted, setEnglishListeningCompleted] = useState(false);
  const [chineseListeningCompleted, setChineseListeningCompleted] = useState(false);
  const [englishRepetitionCompleted, setEnglishRepetitionCompleted] = useState(false);
  const [chineseRepetitionCompleted, setChineseRepetitionCompleted] = useState(false);
  const [selectedButton, setSelectedButton] = useState(0);
  const [showChinese, setShowChinese] = useState(true);
  const [itemSelected, setItemSelected] = useState(false);

  const linkLocations = ["/chinese-test", "/english-test", "/chinese-repetition-test", "/english-repetition-test"];


  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getUsers?participant_id=${username}`
          );
          const data = await response.json();
          if (data && data.length > 0 && data[0].is_active) {
            const user = data[0];
            setEnglishListeningCompleted(/*user.is_completed_en*/false);
            setChineseListeningCompleted(/*user.is_completed_cn*/false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, []);
  return (
    <div className="languageSelection">
      <AppBar className = "titleContainer">
          <h1 className = "selectionTitle">
            {showChinese ? 
            <>请选择下面的测试来开始</> :
            <>Please select a test below to start</>
            }
          </h1>
          <button className = "translationButton" onClick ={() => setShowChinese(!showChinese)}>
            {showChinese ? "Change to English/更改为英语" : "Change to Chinese/更改为中文"}
          </button>
      </AppBar>
      <div className="testSelectionGroup">
        <button
          className = {`testButton ${selectedButton === 1 ? 'scaled' : 'testButtonUnselected'}`}
          //href="/chinese-test"
          onClick={() => {
            if (selectedButton === 1) {
              setSelectedButton(0);
            }
            else {
              setSelectedButton(1);

            }
          }}
          disabled={chineseListeningCompleted}
        >
          {showChinese ? 
            <>汉语听力</> :
            <>Chinese Listening</>
          }
        </button>
        <button
          className = {`testButton ${selectedButton === 2 ? 'scaled' : 'testButtonUnselected'}`}
          // href="/english-test"
          onClick={() => {
            if (selectedButton === 2) {
              setSelectedButton(0);
            }
            else {
              setSelectedButton(2);
            }
          }}
          disabled={englishListeningCompleted}
        >
          {showChinese ? 
            <>英语听力</> :
            <>English Listening</>
          }
        </button>
        <button
          className = {`testButton ${selectedButton === 3 ? 'scaled' : 'testButtonUnselected'}`}
          onClick={() => {
            if (selectedButton === 3) {
              setSelectedButton(0);
            }
            else {
              setSelectedButton(3);
            }
          }}
          disabled={englishListeningCompleted}
        >
          {showChinese ? 
            <>汉语句子复读</> :
            <>Chinese Sentence Repetition</>
          }
        </button>
        <button
          className = {`testButton ${selectedButton === 4 ? 'scaled' : 'testButtonUnselected'}`}
          onClick={() => {
            if (selectedButton === 4) {
              setSelectedButton(0);
            }
            else {
              setSelectedButton(4);
            }
          }}
          disabled={englishListeningCompleted}
        >
          {showChinese ? 
            <>英语句子重复</> :
            <>English Sentence Repetition</>
          }
        </button>
        <button
          className = {selectedButton === 0 ? "selectionButton selectionDisabled": "selectionButton selectionEnabled"}
          disabled = {selectedButton === 0}
          onClick = {() => {
            window.location.href = linkLocations[selectedButton-1];
          }}
        >
          {showChinese ?
            <>开始</> :
            <>Start</>
          }
        </button>
      </div>
      {englishListeningCompleted && chineseListeningCompleted && (
        <div className="completionText">
            
            {showChinese ? 
            <>恭喜!您已完成所有测试!</> :
            <>Congrats! You've completed all the tests!</>
            }
        </div>
      )}
    </div>
  );
};

export default LanguageSelection;
