import React from "react";
import "./instructions.scss";

const ChineseInstructions = () => {
  return (
    <div className="instruction-container">
      <h1>MECOLAB实验说明</h1>
      <p>请在开始测试前观看实验介绍视频并完成以下所有问题！</p>

      <div className="section">
        <h2>测试设置</h2>
        <ul>
          <li>
            请您确保您和孩子在安静的房间里。请确保您的电脑或平板设备已
            <span className="redHighlight">连接互联网</span>。
          </li>
          <li>
            请确定您的设备已调试到
            <span className="redHighlight">合适的音量</span>
            ，以保证孩子可以清晰地听到音频的内容。
          </li>
          <li>
            测试开始以后请不要刷新浏览器或点击后退按钮，否则所有测试进度将会丢失。
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>测试说明</h2>
        <ul>
          <li>请确保在回答问题时，由孩子自己使用鼠标或触摸屏。</li>
          <li>
            一旦您已经开始一个测试，
            请确保完成该测试。如果情况允许，我们建议您一次性完成中文与英文测试。
          </li>
          <li>
            测试中将有一些难度较大的句子。请给孩子足够时间自行作答，请勿帮助他们回答。这是对
            <span className="redHighlight">孩子们语言能力</span>
            的测试，而非家长的测试。
          </li>
          <li>
            请不要告诉孩子他们的选择是否正确。我们
            <span className="redHighlight">并不需要</span>孩子答对每一道题。
          </li>
          <li>
            我们建议您保持安静，或参照以下例子给予孩子非纠正性的鼓励：“你做得真棒！”
          </li>
          <li>
            每一个句子会自动播放两次（可以按下暂停按钮来暂停播放），然后自动进入下一题。
          </li>
          <li>如果孩子需要休息，您可以在测试期间使用暂停按钮。</li>
          <li>在协助您的孩子时：</li>
        </ul>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="green">您可以</th>
              <th className="red">您不可以</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="green">帮助孩子点击图片（如果他们有困难的话）</td>
              <td className="red">指出或者告诉孩子答案</td>
            </tr>
            <tr>
              <td className="green">调整音量</td>
              <td className="red">告诉他们答案的对与错</td>
            </tr>
            <tr>
              <td className="green">
                鼓励他们（“你很棒”、“你真棒”
                “你还差一半就做完了”）但不要跟阅读句子做对照
              </td>
              <td className="red">重复或重新朗读完整的句子或句子的一部分</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChineseInstructions;
