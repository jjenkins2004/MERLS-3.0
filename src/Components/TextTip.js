import React from "react";
import "./TextTip.css";
import Triangle from './Triangle.png';
import ProceedButton from "./BlueButton";

const TextTip = ({englishText, chineseText, showChinese, tipNum, setTipNum}) => {
    function nextToolTip() {
        setTipNum((prevTipNum) => prevTipNum + 1);
      }

    return (
    <div className="ttContainer">
        <div className="ttRectangle">
            {showChinese ? chineseText : englishText}
            <div className="button">
                <ProceedButton showChinese={showChinese} textEnglish="Got it!" textChinese="明白了！" onClick={nextToolTip} disabled={false}/>
            </div>
        </div>
        <img 
            className="ttTriangle" 
            src={Triangle}
            alt="triangle"
        />
    </div>
    )
}

export default TextTip;