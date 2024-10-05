import React, { useState, useEffect } from "react";
import "./LanguageSelection.css";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

const LanguageSelection = () => {
  const [englishCompleted, setEnglishCompleted] = useState(false);
  const [chineseCompleted, setChineseCompleted] = useState(false);
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
            setEnglishCompleted(user.is_completed_en);
            setChineseCompleted(user.is_completed_cn);
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
      <AppBar position="fixed" sx={{ height: "7.5rem" }}>
        <h2>Please select a language below to start/请选择一门语言开始测试</h2>
      </AppBar>
      <div className="languageButtonGroup">
        <Button
          variant="contained"
          href="/chinese-test"
          disabled={chineseCompleted}
        >
          Chinese/中文
        </Button>
        <Button
          variant="contained"
          href="/english-test"
          disabled={englishCompleted}
        >
          English/英文
        </Button>
      </div>
      {englishCompleted && chineseCompleted && (
        <div>Congrats! You've completed all the tests!</div>
      )}
    </div>
  );
};

export default LanguageSelection;
