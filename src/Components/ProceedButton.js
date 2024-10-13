import "./ProceedButton.css"
import React from "react";

const ProceedButton = ({showChinese, textEnglish, textChinese, onClick, disabled}) => {
    return(
        <div className="proceedButtonContainer">
        <button 
        className = {`proceedButton ${disabled ? 'disabled' : 'enabled'}`}
        disabled = {disabled}
        onClick={onClick}
        >
          {showChinese ? textChinese : textEnglish}
        </button>
      </div>
    )
};

export default ProceedButton;