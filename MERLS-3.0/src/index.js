import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Test from "./Tests/Test";
import Home from "./Home/Home";
import StoryTest from "./StoryTest/StoryTest";
import ParentQuestions from "./Home/ParentQuestions";
import TestSeletion from "./Test Selection/TestSelection";
import UserValidation from "./Home/UserValidation";
import ExportResult from "./ExportResult";
import { HashRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/parent-questions" element={<ParentQuestions />} />
      <Route path="login" element={<UserValidation />} />
      <Route path="/test-selection" element={<TestSeletion />} />
      <Route path="/matching-test-chinese" element={<Test type = "matching" language="CN" />} />
      <Route path="/matching-test-english" element={<Test type = "matching" language="EN" />} />
      <Route path="/repetition-test-chinese" element={<Test type = "repetition" language="CN" />} />
      <Route path="/repetition-test-english" element={<Test type = "repetition" language="EN" />} />
      <Route path="/story-test-english" element={<StoryTest language = "EN" />} />
      <Route path="/story-test-chinese" element={<StoryTest language = "CN" />} />
      <Route path="download-report" element={<ExportResult />} />
    </Routes>
  </HashRouter>
);
