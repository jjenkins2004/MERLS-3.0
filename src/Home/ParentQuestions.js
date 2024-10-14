import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import "./Home.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const ParentQuestions = () => {
  const location = useLocation();
  const [answers, setAnswers] = useState({
    answer1: null,
    answer2: null,
    answer3: null,
    answer4: null,
    answer5: null,
    answer6: null,
    answer7: null,
  });

  const [showQuestionInChinese, setShowQuestionInChinese] = useState(false);
  const [allAnsweredCorrectly, setAllAnsweredCorrectly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const languageParam = params.get("cn-zw");
    setShowQuestionInChinese(languageParam === "true");
  }, [location]);

  const handleChange = (question, value) => {
    setAnswers({ ...answers, [question]: value === "true" });
  };

  const checkCorrectness = () => {
    if (
      answers.answer1 === true &&
      answers.answer2 === true &&
      answers.answer3 === true &&
      answers.answer4 === false &&
      answers.answer5 === true &&
      answers.answer6 === false &&
      answers.answer7 === true
    ) {
      setAllAnsweredCorrectly(true);
    } else {
      alert(
        showQuestionInChinese
          ? "至少有一道题没有答对"
          : "At least one question is answered incorrectly."
      );
    }
  };

  const questions = {
    en: [
      "Does your computer have a stable connection to the internet?",
      "Is the room quiet and without distractions?",
      "Is your audio set to a good volume?",
      "If your child is unsure about the answer, can you repeat the question for them?",
      "If your child hesitates, can you encourage them to guess?",
      "If your child is wrong, can you correct them?",
      "Is your child doing the selection/clicking independently?",
    ],
    cn: [
      "您的电脑是否有稳定的互联网连接？",
      "您的房间目前是否安静且没有干扰？",
      "您的音量是否设置合适？",
      "如果您的孩子不确定答案，您能重复问题给他们吗？",
      "如果您的孩子不确定答案，您可以鼓励他们猜答案吗？",
      "如果你的孩子回答错误, 您可以纠正他们吗？",
      "您的孩子接下来会自己独立进行选择/点击的吗？",
    ],
  };

  const labels = {
    yes: showQuestionInChinese ? "是" : "Yes",
    no: showQuestionInChinese ? "否" : "No",
  };

  const currentQuestions = showQuestionInChinese ? questions.cn : questions.en;

  return (
    <div className="home">
      <AppBar className="titleContainer">
        <h1 className="title">
          {showQuestionInChinese ? <>亲爱的家长</> : <>Dear parent(s)</>}
        </h1>
        <h2 className="subHeading">
          {showQuestionInChinese ? (
            <>请正确回答问题以开始</>
          ) : (
            <>Please correctly answer the following questions to start</>
          )}
        </h2>
        <button
          className="translationButton"
          onClick={() => setShowQuestionInChinese(!showQuestionInChinese)}
        >
          {showQuestionInChinese
            ? "Change to English/更改为英语"
            : "Change to Chinese/更改为中文"}
        </button>
      </AppBar>
      <div className="questionContainer">
        <FormControl>
          <ol>
            {currentQuestions.map((question, index) => (
              <li key={index}>
                <RadioGroup
                  row
                  name={`question${index + 1}`}
                  className="parentQuestion"
                  onChange={(e) =>
                    handleChange(`answer${index + 1}`, e.target.value)
                  }
                >
                  <span>{question}</span>
                  <span className="radioButtons">
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={labels.yes}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={labels.no}
                    />
                  </span>
                </RadioGroup>
              </li>
            ))}
          </ol>
          <Button
            style={{
              marginLeft: "auto",
              marginRight: "auto", // Above 2 are for centering
              width: "20%",
              display: "block",
            }}
            variant="contained"
            onClick={checkCorrectness}
          >
            Submit
          </Button>
        </FormControl>
      </div>
      <div className="nextBack">
        <Button
          style={{ marginRight: "0.5rem" }}
          variant="contained"
          href={`/?cn-zw=${showQuestionInChinese ? "true" : "false"}`}
        >
          {showQuestionInChinese ? "后退" : "Back"}
        </Button>
        <Button
          style={{ marginLeft: "0.5rem" }}
          disabled={!allAnsweredCorrectly}
          variant="contained"
          href={`/login?cn-zw=${showQuestionInChinese ? "true" : "false"}`}
        >
          {showQuestionInChinese ? "下一步" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ParentQuestions;
