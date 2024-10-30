import "./ProceedButton.css"
import React from "react";

const ProceedButton = ({className, showChinese, textEnglish, textChinese, onClick, disabled}) => {
    return(
        <div className="proceedButtonContainer">
        <button 
        className = {`proceedButton ${disabled ? 'disabled' : 'enabled'} ${className}`}
        disabled = {disabled}
        onClick={onClick}
        >
          {showChinese ? textChinese : textEnglish}
        </button>
      </div>
    )
};

export default ProceedButton;