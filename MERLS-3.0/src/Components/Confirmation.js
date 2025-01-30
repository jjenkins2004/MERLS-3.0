import React from "react";
import BlueButton from "./BlueButton";
import GreenButton from "./GreenButton";
import "./Confirmation.css";

const Confirmation = ({
  setShowConfirmation,
  showChinese,
  chineseText,
  englishText,
  confirmAction,
}) => {
  return (
    <div className="confirmationContainer">
      <div className="grayOutBackground" />
      <div className="confirmationPopup">
        <div className="textContainer">
          {showChinese ? chineseText : englishText}
        </div>
        <div className="buttonContainer">
          <BlueButton
            className="buttonOverride"
            showChinese={showChinese}
            textEnglish={"Not yet"}
            textChinese={"还没"}
            onClick={() => {
              setShowConfirmation(false);
            }}
          />
          <div style={{ width: "30px" }} />
          <GreenButton
            className="buttonOverride"
            showChinese={showChinese}
            textEnglish={"Yes!"}
            textChinese={"是的!"}
            onClick={() => {
              confirmAction();
              setShowConfirmation(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Confirmation;
