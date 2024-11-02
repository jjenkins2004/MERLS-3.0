import React from "react";
import "./instructions.scss";

const EnglishInstructions = () => {
  return (
    <div className="instruction-container">
      <h1>MECOLAB Instructions Page</h1>
      <p>
        Please watch the instruction video and answer the questions that will
        appear below before getting started!{" "}
      </p>

      <div className="section">
        <h2>Set up</h2>
        <ul>
          <li>
            You will need a computer or tablet{" "}
            <span className="redHighlight">connected to the internet</span> in a
            quiet room without distractions.{" "}
            <span className="redHighlight">Google Chrome</span> and{" "}
            <span className="redHighlight">Microsoft Edge</span>
            {" "}browsers are recommended for testing on your device. If you are
            using <span className="redHighlight">Safari</span> please see the
            instruction.
          </li>
          <li>
            Make sure the device’s audio is set to a{" "}
            <span className="redHighlight">loud</span> volume so your child can
            hear the task.
          </li>
          <li>
            Make sure the child sits in a comfortable position and can clearly
            see the screen.
          </li>
          <li>
            <span className="redHighlight">Do not</span> refresh the browser or
            hit the back button once you have started a task or all progress
            will be lost.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>Testing Instructions</h2>
        <ul>
          <li>
            Be sure the child is the one using the mouse or touch screen when
            answering the questions.
          </li>
          <li>
            Once you start a task, please finish it. You don’t have to do both
            the English and Mandarin tasks at once, but it is recommended.
          </li>
          <li>
            Some of the sentences will be difficult.{" "}
            <span className="redHighlight">Allow your child to guess</span>
            {" "}rather than tell them the answers. This should be a reflection of{" "}
            <span className="redHighlight">their knowledge</span>, not yours.
          </li>
          <li>
            This may be hard for you, but{" "}
            <span className="redHighlight">do not</span> tell your child if the
            answer is correct or incorrect. We{" "}
            <span className="redHighlight">do not</span> expect your child to
            get all the answers right.
          </li>
          <li>
            It’s okay to stay silent, but if you want to show encouragement,
            here are some examples: ‘You did a good job listening!’; ‘Great job
            paying attention!’
          </li>
          <li>
            Each sentence will automatically play{" "}
            <span className="redHighlight">twice</span> (there is a pause
            between sentences) before progressing to the next sentence.
          </li>
          <li>
            Use the pause button during the testing if your child needs a break.
          </li>
          <li>When assisting your child:</li>
        </ul>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="green">YOU MAY</th>
              <th className="red">YOU MAY NOT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="green">
                Help them click on an image if they are struggling with the
                device
              </td>
              <td className="red">Show or tell them the answer</td>
            </tr>
            <tr>
              <td className="green">Adjust the volume</td>
              <td className="red">
                Tell them if their answer is right or wrong
              </td>
            </tr>
            <tr>
              <td className="green">
                Encourage them without talking over the prompt. For example:
                “Good job!”; “you can guess if you want.” “It looks like you’re
                halfway done!”
              </td>
              <td className="red">Repeat all or some of the sentence prompt</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnglishInstructions;
