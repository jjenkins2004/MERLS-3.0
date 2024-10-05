import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Test from "./Test";
import Home from "./Home/Home";
import ParentQuestions from "./Home/ParentQuestions";
import LanguageSeletion from "./LanguageSelection";
import UserValidation from "./Home/UserValidation";
import ExportResult from "./ExportResult";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/parent-questions" element={<ParentQuestions />} />
      <Route path="login" element={<UserValidation />} />
      <Route path="/language-selection" element={<LanguageSeletion />} />
      <Route path="/chinese-test" element={<Test language="CN" />} />
      <Route path="/english-test" element={<Test language="EN" />} />
      <Route path="download-report" element={<ExportResult />} />
    </Routes>
  </BrowserRouter>
);
