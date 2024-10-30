import "./GreenButton.css"
import React from "react";

const GreenButton = ({className, showChinese, textEnglish, textChinese, onClick, disabled}) => {
    return(
        <div className="greenButtonContainer">
        <button 
        className = {`greenButton ${disabled ? 'disabled' : 'enabled'} ${className}`}
        disabled = {disabled}
        onClick={onClick}
        >
          {showChinese ? textChinese : textEnglish}
        </button>
      </div>
    )
};

export default GreenButton;