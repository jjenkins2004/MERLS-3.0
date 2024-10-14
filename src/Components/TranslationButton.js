import "./TranslationButton.css"
import React from "react";

const TranslationButton = ({showChinese, setShowChinese}) => {
    return (
        <button
          className="translationButton"
          onClick={() => setShowChinese(!showChinese)}
        >
          {showChinese
            ? "Change to English/更改为英语"
            : "Change to Chinese/更改为中文"}
        </button>
    )
};

export default TranslationButton;