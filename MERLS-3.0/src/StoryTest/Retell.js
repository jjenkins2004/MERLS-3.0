import React from "react";
import "./StoryTest.css";

const Retell = ({ imageLinks }) => {
  return (
    <div id="retell">
      {imageLinks.map((link, index) => {
        return (
          <div className="itemContainer">
            {`${index + 1}.`}
            <img src={link} alt="story scene" className="storyItem" />
          </div>
        );
      })}
    </div>
  );
};
export default Retell;
