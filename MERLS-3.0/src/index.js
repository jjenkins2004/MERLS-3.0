import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Test from "./Tests/Test";
import Home from "./Home/Home";
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
      <Route path="/chinese-test" element={<Test type = "matching" language="CN" />} />
      <Route path="/english-test" element={<Test type = "matching" language="EN" />} />
      <Route path="/chinese-repetition-test" element={<Test type = "repetition" language="CN" />} />
      <Route path="/english-repetition-test" element={<Test type = "repetition" language="EN" />} />
      <Route path="download-report" element={<ExportResult />} />
    </Routes>
  </HashRouter>
);
