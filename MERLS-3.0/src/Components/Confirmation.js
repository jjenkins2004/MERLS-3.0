import React from "react"
import BlueButton from "./BlueButton";
import GreenButton from "./GreenButton";
import "./Confirmation.css"

const Confirmation = ({setShowConfirmation, showChinese, chineseText, englishText, confirmAction}) => {
    return (
        <div className="confirmationContainer">
            <div className="grayOutBackground"/>
            <div className="confirmationPopup">
                <div className="textContainer">
                    {showChinese ? chineseText : englishText}
                </div>
                <div className="buttonContainer">
                    <BlueButton 
                        className="buttonOverride"
                        showChinese={showChinese}
                        textEnglish={"Not yet"}
                        textChinese={""}
                        onClick={() => {setShowConfirmation(false)}}
                    />
                    <div style={{width: "30px"}}/>
                    <GreenButton 
                        className="buttonOverride"
                        showChinese={showChinese}
                        textEnglish={"Yes!"}
                        textChinese={""}
                        onClick={confirmAction}
                    />
                </div>
            </div>
        </div>
    )
};
export default Confirmation;