import "./BlueButton.css"
import React from "react";

const BlueButton = ({className, showChinese, textEnglish, textChinese, onClick, disabled}) => {
    return(
        <div className="blueButtonContainer">
        <button 
        className = {`blueButton ${disabled ? 'disabled' : 'enabled'} ${className}`}
        disabled = {disabled}
        onClick={onClick}
        >
          {showChinese ? textChinese : textEnglish}
        </button>
      </div>
    )
};

export default BlueButton;