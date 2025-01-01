import { useState } from "react";
import { poststudy, study_realtime } from "./api";
import { useNavigate } from "react-router-dom";
import "./Writestudy.css";

export default function Writestudy() {
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const kid_id = JSON.parse(localStorage.getItem("name"));
  const time = localStorage.getItem("Time") || 0;
  const [write, setWrite] = useState("");
  const [study, setStudy] = useState("");
  const studies = ["外国語", "数学", "国語", "理科", "社会"];
  const gra = localStorage.getItem("学年");
  const navigate = useNavigate();

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  async function finish() {
    if (write.length > time / 10) {
      try {
        await poststudy({
          UserId: email,
          子Id: kid_id["子Id"],
          学年: gra,
          教科: study,
          内容: write,
          時間: formatTime(time),
          投稿時間: new Date().toISOString(),
          承認: false,
        });

        localStorage.setItem("Time", 0);
        study_realtime({
          UserId: email,
          子Id: name["子Id"],
          勉強中: false,
        });
        navigate("/kid"); // poststudyが完了した後にページ遷移を行う
      } catch (error) {
        alert("データ送信に失敗しました。再度試してください。");
      }
    } else {
      alert(`${time / 10}文字以上入力してください`);
    }
  }

  return (
    <div className="writestudy-container">
      <div className="mypage_header">
        <h1>勉強記録の入力</h1>
      </div>
      <div className="writestudy-form">
        <h2>この時間にやった勉強の内容を記録してください。</h2>
        <label htmlFor="study-select" className="writestudy-label">
          教科を選択
        </label>
        <select
          id="study-select"
          className="writestudy-select"
          value={study}
          onChange={(e) => setStudy(e.target.value)}
        >
          <option value="">--教科を選んでください--</option>
          {studies.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label htmlFor="content-input" className="writestudy-label">
          内容
        </label>
        <textarea
          id="content-input"
          className="writestudy-textarea"
          value={write}
          onChange={(e) => setWrite(e.target.value)}
          placeholder="内容を入力してください"
        />

        <button className="writestudy-button" onClick={finish}>
          送信
        </button>
      </div>
    </div>
  );
}
