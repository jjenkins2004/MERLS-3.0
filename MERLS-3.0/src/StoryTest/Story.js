import React from "react";
import "./StoryTest.css";

const Story = ({ imageLinks }) => {
  return (
    <div id="fullStory">
      <div className="container">
        {imageLinks.map((link, index) => {
          return (
            <div className="itemContainer">
              {`${index + 1}.`}
              <img src={link} alt="story scene" className="storyItem" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Story;
