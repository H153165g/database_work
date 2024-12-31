import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Study.css";
import { study_realtime } from "./api";

export default function Study() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0); // 経過時間（秒単位）
  const [isRunning, setIsRunning] = useState(false); // ストップウォッチの状態
  const email = localStorage.getItem("email");
  const name = JSON.parse(localStorage.getItem("name"));

  // ページ読み込み時に時間を復元
  useEffect(() => {
    const savedTime = localStorage.getItem("Time");
    if (savedTime !== null) {
      const parsedTime = parseInt(savedTime, 10);
      if (!isNaN(parsedTime)) {
        setTime(parsedTime); // 保存されている時間をステートに反映
      }
    }
  }, []);

  // タイマーの動作
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const updatedTime = prevTime + 1;
          localStorage.setItem("Time", updatedTime); // 最新の時間を保存
          return updatedTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // クリーンアップ
  }, [isRunning]);

  // 画面を離れたら停止する
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false); // ページが非表示になったら停止
        study_realtime({ UserId: email, 子Id: name["子Id"], 勉強中: false });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 時間のフォーマット (時間:分:秒)
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="study-container">
      <div className="mypage_header">
        <h1>勉強中</h1>
      </div>
      <div>
        <h3>画面から離れるとタイマーが止まります。</h3>
        <h3>ご注意ください</h3>
      </div>
      <h1 className="study-title">勉強時間</h1>
      <h2 className="study-timer">{formatTime(time)}</h2>
      <div className="study-actions">
        {!isRunning ? (
          <button
            className="study-button study-start-button"
            onClick={() => {
              setIsRunning(true);
              study_realtime({
                UserId: email,
                子Id: name["子Id"],
                勉強中: true,
              });
            }}
          >
            再開
          </button>
        ) : (
          <button
            className="study-button study-stop-button"
            onClick={() => setIsRunning(false)}
          >
            停止
          </button>
        )}
        <button
          className="study-button study-finish-button"
          onClick={() => navigate("./write")}
        >
          勉強を終わる
        </button>
      </div>
    </div>
  );
}
