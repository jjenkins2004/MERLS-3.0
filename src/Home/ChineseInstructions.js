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
            请确保您和孩子在一个安静的房间内。请确保你的电脑或平板设备已连接上互联网，我们推荐您使用Google
            Chrome或Microsoft
            Edge浏览器进行测试。如果您正在使用Safari浏览器，请参看设置说明。
          </li>
          <li>
            确保设备的音量已调至合适的音量，以便您的孩子可以清晰地听到测试内容。
          </li>
          <li>
            测试开始后请勿刷新浏览器或点击后退按钮，否则所有进度将会丢失。
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>测试说明</h2>
        <ul>
          <li>
            一旦你已经开始一个测试，请确保完成该测试。如果情况允许，我们建议您一次性完成中英文测试，虽然这不是必须的。
          </li>
          <li>
            测试中的一些句子将会比较的有难度。请允许您的孩子猜测答案，而不要帮助他们回答。这是孩子们所掌握知识的真实反映。
          </li>
          <li>
            测试内容有可能较难，您可能会很难不告诉孩子答案的对与否。我们不希望您的孩子答对每一道题。
          </li>
          <li>
            保持安静是好的，但是如果你想要表达鼓励，这里有一些例子供您参考，在每3-5个句子后给予孩子非正性的鼓励：“你做的真棒！”、“你真棒！”、“你很认真在听！”。
          </li>
          <li>每一句子将会自动播放两次，然后自动进入下一个问题。</li>
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
