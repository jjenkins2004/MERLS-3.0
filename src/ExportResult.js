import React, { useState } from "react";
import "./Tests/Test.scss";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import "./ExportResult.scss";

const ExportResult = () => {
  const [username, setUsername] = useState(null);
  const [language, setLanguage] = useState(null);

  const alertExportFailure = () => {
    alert(
      "Failed to download, make sure fields are not empty and user name is correct."
    );
  };
  const downloadReport = async () => {
    try {
      let response = await fetch(
        `https://ue2r8y56oe.execute-api.us-east-2.amazonaws.com/default/getReport?participant_id=${username}&language=${language}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${username}-${language}-report.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        alertExportFailure();
      }
    } catch (error) {
      alertExportFailure();
    }
  };
  return (
    <div className="exportResult">
      <AppBar position="fixed" sx={{ height: "7.5rem" }}>
        <h2>输入用户名并选择一门语言后，点击Download下载报告</h2>
      </AppBar>
      <div className="reportAttributes">
        <TextField
          label="Username"
          variant="standard"
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormControl>
          <ol>
            <li>
              <RadioGroup
                row
                name="exportLanguageSelection"
                className="exportLanguageSelection"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <span>请选择想要下载报告的语言：</span>
                <FormControlLabel value={"EN"} control={<Radio />} label="EN" />
                <FormControlLabel value={"CN"} control={<Radio />} label="CN" />
              </RadioGroup>
            </li>
          </ol>
        </FormControl>
        <Button
          variant="contained"
          onClick={downloadReport}
          disabled={!(username && language)}
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default ExportResult;
